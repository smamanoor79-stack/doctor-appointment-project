"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

function splitClinicName(fullName) {
  const parts = fullName.trim().split(" ");
  if (parts.length < 2) return { first: fullName, last: "" };
  const last = parts.pop();
  return { first: parts.join(" "), last };
}

export default function Footer() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadContent() {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data.success) setContent(data.content);
      } catch (err) {
        console.error("Footer: failed to load site content:", err);
      }
    }
    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const clinicName = content?.clinicName || "Dr. Ahsan Malik";
  const { first: clinicFirst, last: clinicLast } = splitClinicName(clinicName);

  const address = content?.address || "Main Branch — Gulshan-e-Iqbal, Karachi";
  const email = content?.email || "info@drahsanmalik.com";
  const phone = content?.phone || "+92 300 0000000";
  const footerText =
    content?.footerText || "Copyright © 2026 Dr. Ahsan Malik Clinic. All Rights Reserved";

  const facebookLink = content?.socials?.facebook || "#";
  const instagramLink = content?.socials?.instagram || "#";
  const tiktokLink = content?.socials?.tiktok || "#";
  const linkedinLink = content?.socials?.linkedin || "";

  return (
    <footer className="relative bg-primary overflow-hidden pt-10 pb-6 px-6 md:px-12">
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: brand + links */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand + socials */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white">
              {clinicFirst} <span className="text-accent">{clinicLast}</span>
            </h3>
            <p className="text-white/70 mt-2 text-xs leading-relaxed">
              Expert dermatological care for all skin, hair, and nail concerns —
              personal, honest, and backed by science.
            </p>
            <div className="flex gap-2 mt-3">
              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent focus-visible:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
              >
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M13.5 9H15V6.5h-1.5C11.57 6.5 10 8.07 10 10v1.5H8V14h2v7h2.5v-7H15l.5-2.5h-3V10c0-.55.45-1 1-1z" />
                </svg>
              </a>
              <a
                href={tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our TikTok page"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent focus-visible:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
              >
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M16.5 3h-2.9v12.2a2.6 2.6 0 11-2.2-2.57v-2.94a5.55 5.55 0 105.1 5.53V9.3a7.5 7.5 0 004.5 1.5V7.9a4.6 4.6 0 01-4.5-4.9z" />
                </svg>
              </a>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent focus-visible:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
              >
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                </svg>
              </a>
              {/* Only render LinkedIn if a real link exists — placeholder "#" links confuse screen readers */}
              {linkedinLink && (
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn page"
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent focus-visible:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
                >
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                    <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.96 1.96 0 100 3.92 1.96 1.96 0 000-3.92zM20.44 20h-3.37v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V20H9.5V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 1 */}
          <nav aria-labelledby="footer-company-heading">
            <h4 id="footer-company-heading" className="text-white text-sm font-semibold mb-2">Company</h4>
            <div className="w-6 h-0.5 bg-accent mb-2" aria-hidden="true" />
            <ul className="space-y-2 text-white/80 text-xs">
              <li><a href="#about" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Services</a></li>
              <li><a href="#why-us" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Why Choose Us</a></li>
              <li><a href="#booking" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Book Appointment</a></li>
            </ul>
          </nav>

          {/* Column 2 */}
          <nav aria-labelledby="footer-explore-heading">
            <h4 id="footer-explore-heading" className="text-white text-sm font-semibold mb-2">Explore</h4>
            <div className="w-6 h-0.5 bg-accent mb-2" aria-hidden="true" />
            <ul className="space-y-2 text-white/80 text-xs">
              <li><a href="#testimonials" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">FAQs</a></li>
              <li><a href="#contact" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Contact Us</a></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-2">Get In Touch</h4>
            <div className="w-6 h-0.5 bg-accent mb-2" aria-hidden="true" />
            <address className="not-italic">
              <ul className="space-y-2 text-white/80 text-xs">
                <li>{address}</li>
                <li>
                  <a href={`mailto:${email}`} className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">
                    {email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">
                    {phone}
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="lg:col-span-4 relative h-40 md:h-56 -mb-6 lg:-mb-8 lg:-mr-12">
          <Image
            src="/footer.webp"
            alt="Dermatologist performing a skincare treatment on a patient"
            loading="eager"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-top rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl"
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto mt-8 pt-4 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-2 text-white/70 text-xs">
        <p>{footerText}</p>
        <div className="flex gap-4">
          <a href="/terms" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Terms &amp; Conditions</a>
          <a href="/privacy" className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors">Privacy Policy</a>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto mt-2 text-center text-white/70 text-[11px]">
        <p>
          Designed and Developed by Smama with <span aria-hidden="true">❤️</span>
          <span className="sr-only">love</span> —{" "}
          <a
            href="mailto:smamanoor79@gmail.com"
            className="hover:text-accent focus-visible:text-accent focus-visible:underline transition-colors"
          >
            smamanoor79@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}