import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";

// ✅ GET - Fetch all orders for admin panel
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'asc' // First come first served
      }
    });

    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// ✅ POST - Create new order (from checkout)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      deliveryAddress,
      items, 
      subtotal,
      tax,
      total,
      paymentMethod,
      notes 
    } = body;

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !deliveryAddress ||
      !Array.isArray(items) ||
      items.length === 0 ||
      total == null
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        items,
        subtotal,
        tax,
        total,
        paymentMethod,
        notes,
        status: 'pending' // Default status
      },
    });

    // Send confirmation email
    const emailResult = await sendOrderConfirmationEmail({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items as any[],
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      deliveryAddress: order.deliveryAddress,
    });

    if (!emailResult.success) {
      console.warn('Order created but email failed:', emailResult.error);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      emailSent: emailResult.success,
      message: emailResult.success 
        ? '✅ Order confirmed! Check your email for details.' 
        : '✅ Order confirmed! (Email notification pending)'
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}