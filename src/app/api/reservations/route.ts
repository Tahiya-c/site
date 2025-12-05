import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      guests,
      specialRequests,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✔ FIXED: Match EXACT fields in your Prisma schema
    const reservation = await prisma.reservation.create({
      data: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        date: new Date(date),
        time: time,
        guests: Number(guests),
        message: specialRequests || "",
        status: "PENDING", // ✔ use UPPERCASE to match enum or string
      },
    });

    return NextResponse.json(
      {
        success: true,
        reservationId: reservation.id,
        message: "Reservation created successfully",
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

// Optional GET
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Fetch Reservations Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
