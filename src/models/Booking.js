import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    appointmentType: {
      type: String, // "Chat" | "Audio Call" | "Video Call" | "Clinic Visit"
      required: true,
    },
    date: {
      type: String, // stored as "2026-07-15"
      required: true,
    },
    dateLabel: {
      type: String, // e.g. "15 Jul, 2026"
      default: "",
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    reasonForVisit: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String, // "cash" | "advance"
      default: "",
    },
    paymentMethod: {
      type: String, // "card" | "jazzcash" | "easypaisa"
      default: "",
    },
    transactionRef: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["not_required", "pending", "approved", "rejected"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    archived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);