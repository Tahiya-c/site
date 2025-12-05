import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        items,      // RAW JSON (correct)
        subtotal,
        tax,
        total,
        paymentMethod,
        notes
      },
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: 'Order created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
