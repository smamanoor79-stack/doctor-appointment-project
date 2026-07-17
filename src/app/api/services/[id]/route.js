import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

// PUT: Update a service
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await req.json();
    const updatedService = await Service.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE: Delete a service
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    await Service.findByIdAndDelete(id);
    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}