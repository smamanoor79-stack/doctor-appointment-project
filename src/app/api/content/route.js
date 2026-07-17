import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import SiteContent from "@/models/SiteContent";

// GET /api/content — used by both the public website and the admin Content page
export async function GET() {
  try {
    await dbConnect();

    let content = await SiteContent.findOne({ key: "main" });
    if (!content) {
      content = await SiteContent.create({ key: "main" });
    }

    return NextResponse.json({ success: true, content });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load content" },
      { status: 500 }
    );
  }
}

// PATCH /api/content — admin-only update of any subset of fields
export async function PATCH(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // Never let the client change the singleton key
    delete body.key;
    delete body._id;

    const content = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, content });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update content" },
      { status: 500 }
    );
  }
}