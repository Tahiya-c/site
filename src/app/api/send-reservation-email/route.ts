import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/adminAuth";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: NextRequest) {
  // 🔐 Admin check
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const {
      reservationId,
      status,
      name,
      email,
      date,
      time,
      guests,
      message,
    } = body;

    if (!status || !name || !email || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ CONFIRMED EMAIL
    if (status === "confirmed") {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your Reservation is Approved! - Club Grille",
        html: `<!DOCTYPE html> ... YOUR CONFIRMED TEMPLATE ...`,
      });
    }

    // ❌ CANCELLED EMAIL
    if (status === "cancelled") {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reservation Update - Club Grille",
        html: `<!DOCTYPE html> ... YOUR CANCELLED TEMPLATE ...`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully for ${status} reservation`,
    });

  } catch (error) {
    console.error("Error sending reservation email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
