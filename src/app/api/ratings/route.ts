import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, rating, feedback } = body;

    if (!orderId || !rating) {
      return NextResponse.json(
        { success: false, error: "Order ID and rating are required" },
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

    return NextResponse.json({
      success: true,
      rating: newRating,
      message: "Thank you for your feedback!",
    });

  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save rating" },
      { status: 500 }
    );
  }
}
