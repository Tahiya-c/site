import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const ratings = await prisma.rating.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      ratings,
    });

  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
