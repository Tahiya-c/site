import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin-auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
