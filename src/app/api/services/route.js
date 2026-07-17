// src/app/api/services/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await dbConnect();
    
    let services = await Service.find({});
    
    // Id db empty insert this by default
    if (services.length === 0) {
      const dummyServices = [
        { icon: "Stethoscope", title: "General Dermatology", desc: "Diagnosis & treatment of common skin conditions.", price: "$150+" },
        { icon: "Sparkles", title: "Acne Treatment", desc: "Customized plans for all acne types.", price: "$200+" },
        { icon: "Syringe", title: "Anti-Aging & Cosmetic", desc: "Injectables, lasers & rejuvenating treatments.", price: "$300+" },
        { icon: "ShieldCheck", title: "Skin Cancer Screening", desc: "Comprehensive exams for early detection.", price: "$180+" },
        { icon: "Zap", title: "Laser Services", desc: "Hair removal, skin resurfacing, vein treatments.", price: "$250+" },
        { icon: "Wand2", title: "Aesthetic Facials", desc: "Medical-grade facials for radiance.", price: "$120+" }
      ];
      
      await Service.insertMany(dummyServices);
      services = await Service.find({}); // Dubara fetch karein insert karne ke baad
    }

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}