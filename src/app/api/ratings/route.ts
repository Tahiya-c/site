import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ratings = await prisma.rating.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ 
      success: true, 
      ratings 
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 Received rating submission:', body);

    const { orderId, rating, feedback } = body;

    if (!orderId || !rating) {
      console.error('❌ Missing required fields:', { orderId, rating });
      return NextResponse.json(
        { success: false, error: 'Order ID and rating are required' },
        { status: 400 }
      );
    }

    const newRating = await prisma.rating.create({
      data: {
        orderId,
        rating: parseInt(rating),
        feedback: feedback || null,
      },
    });

    console.log('✅ Rating saved successfully:', newRating);

    return NextResponse.json({ 
      success: true, 
      rating: newRating,
      message: 'Thank you for your feedback!' 
    });

  } catch (error) {
    console.error('❌ Error saving rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save rating' },
      { status: 500 }
    );
  }
}