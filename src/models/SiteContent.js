import mongoose from "mongoose";

const TimeRangeSchema = new mongoose.Schema(
  {
    open: { type: String, default: "" },  // e.g. "10:00 AM"
    close: { type: String, default: "" }, // e.g. "2:00 PM"
  },
  { _id: false }
);

const WorkingHourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // e.g. "Monday"
    closed: { type: Boolean, default: false },
    morning: { type: TimeRangeSchema, default: () => ({ open: "10:00 AM", close: "2:00 PM" }) },
    evening: { type: TimeRangeSchema, default: () => ({ open: "5:00 PM", close: "9:00 PM" }) },
  },
  { _id: false }
);

const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    // Clinic identity
    clinicName: { type: String, default: "Dr. Ahsan Malik" },
    tagline: { type: String, default: "Your Skin, Our Priority" },
    logo: { type: String, default: "" },

    // Doctor
    doctorName: { type: String, default: "" },
    credentials: { type: String, default: "" },

    // Contact
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    mapLink: { type: String, default: "" },

    // Working hours — morning/evening split
    workingHours: {
      type: [WorkingHourSchema],
      default: () =>
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
          day,
          closed: false,
          morning: { open: "10:00 AM", close: "2:00 PM" },
          evening: { open: "5:00 PM", close: "9:00 PM" },
        })),
    },

    // Appointment slot settings
    slotDuration: { type: Number, default: 20 }, // minutes — admin can change to 15/20/etc

    // Hero section
    heroHeading: { type: String, default: "" },
    heroSubheading: { type: String, default: "" },
    heroImage: { type: String, default: "" },

    // About section
    aboutText: { type: String, default: "" },
    aboutImage: { type: String, default: "" },

    // Social links
    socials: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      tiktok: { type: String, default: "" },
    },

    // Payment / booking settings
    paymentInstructions: { type: String, default: "" },
    bankAccount: { type: String, default: "" },
    jazzcash: { type: String, default: "" },
    easypaisa: { type: String, default: "" },
    consultationFee: { type: String, default: "" },

    // SEO
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },

    // Footer
    footerText: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);