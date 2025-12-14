import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendApprovedEmail, sendRejectedEmail } from "@/lib/email";

export async function PATCH(request: Request, context: any) {
  try {
    // Unwrap params (new Next.js requirement)
    const params = await context.params;
    const { id } = params;

    const { status } = await request.json();

    // ✅ FIX: Accept both "confirmed"/"cancelled" (from UI) AND "approved"/"rejected"
    if (!["confirmed", "cancelled", "pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    // ✅ FIX: Send emails for BOTH "confirmed" and "approved"
    if (status === "confirmed" || status === "approved") {
      await sendApprovedEmail(reservation);
    }
    if (status === "cancelled" || status === "rejected") {
      await sendRejectedEmail(reservation);
    }

    return NextResponse.json({
      success: true,
      message: `Reservation ${status} and email sent`,
      reservation,
    });
  } catch (error) {
    console.error("Update reservation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

// Optional: support PUT
export async function PUT(req: Request, context: any) {
  return PATCH(req, context);
}

export async function DELETE(request: Request, context: any) {
  try {
    const params = await context.params;
    const { id } = params;

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Delete reservation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}