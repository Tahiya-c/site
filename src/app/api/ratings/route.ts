import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Rating } from "@prisma/client";

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

    // ALWAYS CREATE A NEW RATING (since multiple ratings per order are allowed)
    const newRating = await prisma.rating.create({
      data: {
        orderId,
        rating: parseInt(rating),
        feedback: feedback || "",
      },
    });

    console.log("Created new rating for order:", orderId);

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

// ✅ GET all ratings - show only latest rating per order
export async function GET() {
  try {
    // Get all ratings with proper typing
    const allRatings = await prisma.rating.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Filter to show only the latest rating per order
    const latestRatingsMap = new Map<string, Rating>();
    
    // Add explicit type annotation for the rating parameter
    allRatings.forEach((rating: Rating) => {
      if (!latestRatingsMap.has(rating.orderId)) {
        latestRatingsMap.set(rating.orderId, rating);
      }
    });

    const latestRatings = Array.from(latestRatingsMap.values());

    return NextResponse.json({
      success: true,
      ratings: latestRatings, // Only show latest per order
      allRatings: allRatings, // Optional: include all for debugging
      count: latestRatings.length,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}