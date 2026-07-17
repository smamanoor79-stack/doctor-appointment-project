import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const bookings = await Booking.find({}).sort({ createdAt: -1 });

  return NextResponse.json({ success: true, bookings });
}

export async function PATCH(req) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id, status } = await req.json();

  const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });

  return NextResponse.json({ success: true, booking: updated });
}

export async function DELETE(req) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, message: "Booking id is required" }, { status: 400 });
  }

  const deleted = await Booking.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, booking: deleted });
}

export async function DELETE(req) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, message: "Booking id is required" }, { status: 400 });
  }

  const deleted = await Booking.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, booking: deleted });
}