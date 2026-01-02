import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// ✅ CREATE reservation (admin only)
export async function POST(req: NextRequest) {
  // 🔐 Admin check
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, message } = body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        time,
        guests: Number(guests),
        message: message || null,
        status: "pending",
      },
    });

    // Optional: send automated email later
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

// ✅ GET all reservations (admin only)
export async function GET(req: NextRequest) {
  // 🔐 Admin check
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

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
