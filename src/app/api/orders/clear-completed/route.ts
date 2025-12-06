import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const result = await prisma.order.deleteMany({
      where: {
        OR: [
          { status: 'completed' },
          { status: 'cancelled' }
        ]
      }
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count,
      message: `Cleared ${result.count} completed/cancelled orders` 
    });

  } catch (error) {
    console.error('Error clearing orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear orders' },
      { status: 500 }
    );
  }
}