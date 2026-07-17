"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope,
  Sparkles,
  Syringe,
  ShieldCheck,
  Zap,
  Wand2,
} from "lucide-react";

const iconMap = { Stethoscope, Sparkles, Syringe, ShieldCheck, Zap, Wand2 };

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Database se services fetch karna
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) return <p className="text-center py-20 text-primary">Loading services...</p>;

  return (
    <section className="bg-light py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* ===== Hero ===== */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary">Specialized Skincare Services</h1>
          <p className="text-dark/70 mt-2">Discover personalized treatments for healthy, glowing skin.</p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-75 md:h-100 rounded-3xl overflow-hidden border-4 border-accent/30 mb-14">
          <Image src="/servi1.jpeg" alt="Dermatology" fill className="object-cover" priority />
        </div>

        {/* ===== Services list (Dynamic from DB) ===== */}
        <div className="flex flex-col gap-5">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Sparkles;
            return (
              <div key={service._id} className="bg-primarySoft rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primaryPale/50 text-primary rounded-full p-3 shrink-0">
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <h3 className="text-accentDark font-semibold">{service.title}</h3>
                    <p className="text-sm text-dark/70">{service.desc}</p>
                    <p className="text-sm font-semibold text-dark mt-1">Price: {service.price}</p>
                  </div>
                </div>
                <Link href="/book" className="bg-accent hover:bg-accentDark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition">
                  Book Service
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}