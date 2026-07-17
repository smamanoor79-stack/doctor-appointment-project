import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { sendBookingReceivedEmails, sendClinicBookingConfirmedEmail } from "@/lib/email";

function generateBookingNumber() {
  return "BK" + Math.floor(10000000 + Math.random() * 90000000);
}

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return Response.json({ success: true, bookings });
  } catch (err) {
    console.error("GET bookings error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      email,
      phone,
      service,
      appointmentType,
      date,
      dateLabel,
      timeSlot,
      reasonForVisit,
      amount,
      paymentType,
      paymentMethod,
      transactionRef,
      paymentStatus,
    } = body;

    if (!name || !phone || !date || !timeSlot) {
      return Response.json(
        { success: false, message: "Name, phone, date, and time slot are required" },
        { status: 400 }
      );
    }

    const resolvedPaymentStatus = paymentStatus || "not_required";
    const status = resolvedPaymentStatus === "pending" ? "pending" : "confirmed";

    const booking = await Booking.create({
      name,
      email: email || "",
      phone,
      service: service || "Other",
      appointmentType: appointmentType || "Clinic Visit",
      date,
      dateLabel: dateLabel || "",
      timeSlot,
      reasonForVisit: reasonForVisit || "",
      amount: amount || 0,
      paymentType: paymentType || "",
      paymentMethod: paymentMethod || "",
      transactionRef: transactionRef || "",
      status,
      paymentStatus: resolvedPaymentStatus,
      bookingNumber: generateBookingNumber(),
    });

    // Fire the right email depending on whether payment needs review
    if (resolvedPaymentStatus === "pending") {
      await sendBookingReceivedEmails(booking);
    } else if (resolvedPaymentStatus === "not_required") {
      await sendClinicBookingConfirmedEmail(booking);
    }

    return Response.json({ success: true, booking });
  } catch (err) {
    console.error("POST booking error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}