import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, reservationId } = await request.json();

    if (!email && !reservationId) {
      return NextResponse.json(
        { error: "Email or Reservation ID is required." },
        { status: 400 }
      );
    }

    let reservation;

    if (reservationId) {
      // Lookup by ID
      reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });
    } else {
      // Lookup by Email (most recent reservation)
      reservation = await prisma.reservation.findFirst({
        where: { email: email },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!reservation) {
      return NextResponse.json(
        { error: "No reservation found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
