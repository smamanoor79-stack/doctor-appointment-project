
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return Response.json({ success: false, message: "Date is required" }, { status: 400 });
    }

    await connectDB();

    const bookings = await Booking.find(
      {
        date,
        status: { $ne: "cancelled" },
        $or: [{ status: { $in: ["confirmed", "completed"] } }, { paymentStatus: "approved" }],
      },
      { timeSlot: 1, _id: 0 }
    );

    const bookedSlots = bookings.map((b) => b.timeSlot);

    return Response.json({ success: true, bookedSlots });
  } catch (err) {
    console.error("GET availability error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}