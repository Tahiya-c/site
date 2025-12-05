import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendApprovedEmail, sendRejectedEmail } from "@/lib/email";

export async function PATCH(request: Request, context: any) {
  try {
    // ⬅ FIX: unwrap params (new Next.js requirement)
    const params = await context.params;
    const { id } = params;

    const { status } = await request.json();

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    if (status === "approved") {
      await sendApprovedEmail(reservation);
    }
    if (status === "rejected") {
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
