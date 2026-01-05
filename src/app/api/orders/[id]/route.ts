import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { sendOrderCompletionEmail } from "@/lib/email";

// ✅ PATCH - Update order status (admin only)
export async function PATCH(req: NextRequest, context: any) {
  // 🔐 Admin check
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    // Unwrap params (new Next.js requirement)
    const params = await context.params;
    const { id } = params;
    const { status } = await req.json();

    // Validate status
    if (!["pending", "preparing", "ready", "completed"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get current order to compare status
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // ✅ CRITICAL: Send completion email and create rating record when order is completed
    if (currentOrder.status !== "completed" && status === "completed") {
      
      // 1. Send completion email
      try {
        // Parse items if they're stored as JSON string
        const items = typeof order.items === 'string' 
          ? JSON.parse(order.items) 
          : order.items;

        await sendOrderCompletionEmail({
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          items: items,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod,
          bkashNumber: order.bkashNumber || undefined,
          bkashTransactionId: order.bkashTransactionId || undefined,
          bkashAmount: order.bkashAmount || undefined,
        });
        console.log("📧 Completion email sent for order:", order.id);
      } catch (emailError) {
        console.error("Failed to send completion email:", emailError);
        // Don't fail the whole request if email fails
      }

      // 2. Create rating record in database (if not exists)
      try {
        // Check if rating already exists for this order
        const existingRating = await prisma.rating.findFirst({
          where: { orderId: order.id }, // Use findFirst with orderId filter
        });

        if (!existingRating) {
          await prisma.rating.create({
            data: {
              orderId: order.id,
              rating: 0, // 0 means "not rated yet"
              feedback: "",
            },
          });
          console.log("📝 Rating record created for order:", order.id);
        } else {
          console.log("📝 Rating record already exists for order:", order.id);
        }
      } catch (ratingError) {
        console.error("Failed to create rating record:", ratingError);
      }
    }

    // ✅ Optional: Send ready notification email
    if (currentOrder.status !== "ready" && status === "ready") {
      console.log("Order is ready! Add sendOrderReadyEmail function if needed");
      // You could implement: await sendOrderReadyEmail(order);
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete order (admin only)
export async function DELETE(req: NextRequest, context: any) {
  // 🔐 Admin check
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const params = await context.params;
    const { id } = params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}

// ✅ OPTIONAL: GET single order
export async function GET(req: NextRequest, context: any) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const params = await context.params;
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}