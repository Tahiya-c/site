import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOrderCompletionEmail } from "@/lib/email";

// ✅ UPDATE order status
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await context.params;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // 🎉 Send completion email when order is marked complete
    if (status === 'completed') {
      try {
        await sendOrderCompletionEmail({
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          items: order.items as any,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          deliveryAddress: order.deliveryAddress,
        });
        console.log('✅ Completion email sent to', order.customerEmail);
      } catch (emailError) {
        console.error('❌ Failed to send completion email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      order,
      message: `Order status updated to ${status}` 
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// ✅ DELETE single order
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Order removed from panel' 
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}