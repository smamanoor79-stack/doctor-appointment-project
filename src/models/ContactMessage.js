import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    reply: {
      text: { type: String, default: "" },
      sentAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);