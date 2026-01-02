import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/adminAuth";

// ✅ GET - Fetch all orders for admin panel (admin-only)
export async function GET(req: NextRequest) {
  // 🔐 Check admin authentication
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'asc' } // First come first served
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

// ✅ POST - Create new order (from checkout, public)
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
      notes,
      bkashData
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

    // Validate bKash payment data if payment method is bKash
    if (paymentMethod === 'bkash') {
      if (!bkashData) {
        return NextResponse.json(
          { success: false, error: 'bKash payment details are required' },
          { status: 400 }
        );
      }

      const { customerBkashNumber, transactionId, paidAmount } = bkashData;

      if (!customerBkashNumber || !transactionId || !paidAmount) {
        return NextResponse.json(
          { success: false, error: 'Incomplete bKash payment information' },
          { status: 400 }
        );
      }

      // Validate bKash number format (Bangladesh phone number)
      const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
      const cleanBkashNumber = customerBkashNumber.replace(/[\s\-]/g, '');
      
      if (!phoneRegex.test(cleanBkashNumber)) {
        return NextResponse.json(
          { success: false, error: 'Invalid bKash number format' },
          { status: 400 }
        );
      }

      // Validate transaction ID (at least 8 characters)
      if (transactionId.trim().length < 8) {
        return NextResponse.json(
          { success: false, error: 'Invalid transaction ID' },
          { status: 400 }
        );
      }

      // Validate paid amount matches total (small tolerance)
      const numericAmount = parseFloat(paidAmount);
      if (isNaN(numericAmount) || Math.abs(numericAmount - total) > 0.01) {
        return NextResponse.json(
          { success: false, error: 'Paid amount does not match order total' },
          { status: 400 }
        );
      }
    }

    // Prepare order data
    const orderData: any = {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      items,
      subtotal,
      tax,
      total,
      paymentMethod: paymentMethod || 'cash',
      notes,
      status: 'pending'
    };

    // Add bKash fields if payment method is bKash
    if (paymentMethod === 'bkash' && bkashData) {
      orderData.bkashNumber = bkashData.customerBkashNumber;
      orderData.bkashTransactionId = bkashData.transactionId;
      orderData.bkashAmount = parseFloat(bkashData.paidAmount);
    }

    // Create order in database
    const order = await prisma.order.create({
      data: orderData,
    });

    // Prepare email data
    const emailData: any = {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items as any[],
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      deliveryAddress: order.deliveryAddress,
    };

    if (order.paymentMethod) emailData.paymentMethod = order.paymentMethod;
    if (order.bkashNumber) emailData.bkashNumber = order.bkashNumber;
    if (order.bkashTransactionId) emailData.bkashTransactionId = order.bkashTransactionId;
    if (order.bkashAmount) emailData.bkashAmount = order.bkashAmount;

    // Send confirmation email
    const emailResult = await sendOrderConfirmationEmail(emailData);

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
