import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_TITLE = " Your Skin, Our Priority 🧴";
const DEFAULT_DESCRIPTION =
  "Expert dermatological care for all skin, hair, and nail concerns. Book a consultation with Dr. Ahsan Malik for acne, anti-aging, cosmetic, and laser treatments.";


export async function generateMetadata() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne({ key: "main" }).lean();

    return {
      title: content?.metaTitle || DEFAULT_TITLE,
      description: content?.metaDescription || DEFAULT_DESCRIPTION,
    };
  } catch (err) {
    console.error("Failed to load SEO metadata:", err);
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}