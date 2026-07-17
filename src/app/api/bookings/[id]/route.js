import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { sendApprovedEmail, sendRejectedEmail } from "@/lib/email";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, paymentStatus, name, email, phone, service, appointmentType, date, timeSlot } = body;
    const { id } = await params;

    if (!["approve", "reject", "complete", "uncomplete", "set_payment", "edit", "archive", "restore"].includes(action)) {
      return Response.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    let update = {};
    if (action === "approve") {
      update = { paymentStatus: "approved", status: "confirmed" };
    } else if (action === "reject") {
      update = { paymentStatus: "rejected", status: "cancelled" };
    } else if (action === "complete") {
      update = { status: "completed", archived: true };
    } else if (action === "uncomplete") {
       update = { status: "confirmed", archived: false };
    } else if (action === "archive") {
      update = { archived: true };
    } else if (action === "restore") {
      update = { archived: false };
    } else if (action === "set_payment") {
      const allowed = ["approved", "pending", "rejected", "not_required"];
      if (!allowed.includes(paymentStatus)) {
        return Response.json({ success: false, message: "Invalid payment status" }, { status: 400 });
      }
      update = { paymentStatus };
      if (paymentStatus === "approved") update.status = "confirmed";
      if (paymentStatus === "rejected") update.status = "cancelled";
    } else if (action === "edit") {
      update = {};
      if (name !== undefined) update.name = name;
      if (email !== undefined) update.email = email;
      if (phone !== undefined) update.phone = phone;
      if (service !== undefined) update.service = service;
      if (appointmentType !== undefined) update.appointmentType = appointmentType;
      if (date !== undefined) update.date = date;
      if (timeSlot !== undefined) update.timeSlot = timeSlot;
    }

    const booking = await Booking.findByIdAndUpdate(id, update, {
      new: true,
      returnDocument: "after",
    });

    if (!booking) {
      return Response.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Send confirmation/rejection emails for both the direct approve/reject
    // actions (Dashboard buttons) AND the set_payment action (Appointments
    // page payment dropdown) — previously only approve/reject triggered mail,
    // so bookings confirmed via the dropdown never got an email.
    if (action === "approve") {
      await sendApprovedEmail(booking);
    } else if (action === "reject") {
      await sendRejectedEmail(booking);
    } else if (action === "set_payment") {
      if (paymentStatus === "approved") {
        await sendApprovedEmail(booking);
      } else if (paymentStatus === "rejected") {
        await sendRejectedEmail(booking);
      }
    }

    return Response.json({ success: true, booking });
  } catch (err) {
    console.error("PATCH booking error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("DELETE booking error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}