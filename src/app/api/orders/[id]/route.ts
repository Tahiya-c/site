import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

// ✅ DELETE all completed/cancelled orders (admin only)
export async function DELETE(req: NextRequest) {
  // 🔐 Admin check
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

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
