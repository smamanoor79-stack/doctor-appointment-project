import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  icon: { type: String, default: "Sparkles" }, 
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: String, required: true }, // e.g., "$150+"
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);