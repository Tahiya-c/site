import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, date, time, guests, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        time,
        guests: Number(guests),
        message: message || null,
        status: "pending", // lowercase to match your schema
      },
    });

    // TODO: Send automated email here (we'll implement this later)
    // await sendPendingEmail(reservation);

    return NextResponse.json(
      {
        success: true,
        reservationId: reservation.id,
        email: reservation.email,
        message: "Reservation request received successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

// Optional GET to fetch all reservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    console.error("Fetch Reservations Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}