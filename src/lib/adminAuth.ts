import { NextRequest, NextResponse } from "next/server";

/**
 * requireAdmin
 * Checks if the "admin-auth" cookie exists.
 * Returns 401 Unauthorized if missing, otherwise returns null.
 */
export function requireAdmin(req: NextRequest) {
  const adminCookie = req.cookies.get("admin-auth")?.value;

  if (!adminCookie) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null; // proceed if admin is authenticated
}
