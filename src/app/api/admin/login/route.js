import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  // Simple session cookie, valid for 7 days
  res.cookies.set("admin_session", process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}