import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import ContactMessage from "@/models/ContactMessage";

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const doc = await ContactMessage.create({ name, email, phone, message });

    return NextResponse.json({ success: true, contact: doc });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}