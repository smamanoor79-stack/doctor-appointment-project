"use client";
import { useEffect, useState } from "react";

const FALLBACK = {
  address: "Main Branch — Gulshan-e-Iqbal, Karachi",
  email: "info@drahsanmalik.com",
  phone: "+92 300 1234567",
};

const DAY_LABEL = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const DAY_ORDER = Object.keys(DAY_LABEL);

// Turns the workingHours array saved by the admin dashboard
// (schema: [{ day: "Monday", closed, morning: {open, close}, evening: {open, close} }, ...])
// into a short human-readable summary, e.g.
// "Mon – Sat: 10:00 AM – 2:00 PM, 5:00 PM – 9:00 PM", grouping consecutive
// days that share identical hours, and listing closed days separately.
function formatWorkingHours(workingHours) {
  if (!Array.isArray(workingHours) || workingHours.length === 0) return null;

  // Make sure we always walk Monday -> Sunday regardless of array order in the DB.
  const byDay = Object.fromEntries(workingHours.map((d) => [d.day, d]));
  const ordered = DAY_ORDER.filter((day) => byDay[day]).map((day) => byDay[day]);

  if (ordered.length === 0) return null;

  const groups = [];
  let current = null;

  ordered.forEach((d) => {
    const key = d.closed
      ? "closed"
      : `${d.morning?.open || ""}-${d.morning?.close || ""}_${
          d.evening?.open || ""
        }-${d.evening?.close || ""}`;

    if (current && current.key === key) {
      current.days.push(d.day);
    } else {
      current = { key, days: [d.day], data: d };
      groups.push(current);
    }
  });

  return groups.map((g) => {
    const label =
      g.days.length > 1
        ? `${DAY_LABEL[g.days[0]]} – ${DAY_LABEL[g.days[g.days.length - 1]]}`
        : DAY_LABEL[g.days[0]];

    if (g.data.closed) {
      return `${label}: Closed`;
    }

    const parts = [];
    if (g.data.morning?.open && g.data.morning?.close) {
      parts.push(`${g.data.morning.open} – ${g.data.morning.close}`);
    }
    if (g.data.evening?.open && g.data.evening?.close) {
      parts.push(`${g.data.evening.open} – ${g.data.evening.close}`);
    }

    return `${label}: ${parts.join(", ") || "—"}`;
  });
}

export default function ContactPage() {
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data.success) {
          setContent(data.content);
        }
      } catch (err) {
        console.error("Failed to load site content:", err);
      } finally {
        if (!cancelled) setLoadingContent(false);
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const address = content?.address || FALLBACK.address;
  const email = content?.email || FALLBACK.email;
  const phone = content?.phone || FALLBACK.phone;
  const hoursLines = formatWorkingHours(content?.workingHours);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to send");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    }
    setSending(false);
  };

  return (
    <section className="bg-light py-20 px-6 relative overflow-hidden">
      <div className="absolute top-12 left-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-12 right-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">
        ✨
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white text-primary font-bold px-6 py-2 rounded-full text-s uppercase tracking-widest mb-4 shadow-md">
            📞 Contact
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            Get in <span className="text-accent underline decoration-accent/50">Touch</span>
          </h1>
          <p className="text-dark/70 max-w-xl mx-auto text-base md:text-lg">
            Have a question or want to book a visit? Send us a message and
            we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Contact info */}
          <div className="lg:col-span-2 bg-white rounded-4xl shadow-xl p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primarySoft flex items-center justify-center text-xl shrink-0">
                📍
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Clinic Address</h3>
                <p className="text-sm text-dark/70">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primarySoft flex items-center justify-center text-xl shrink-0">
                📧
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Email</h3>
                <p className="text-sm text-dark/70">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primarySoft flex items-center justify-center text-xl shrink-0">
                📱
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Phone</h3>
                <p className="text-sm text-dark/70">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primarySoft flex items-center justify-center text-xl shrink-0">
                🕐
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Timings</h3>
                {hoursLines ? (
                  <div className="text-sm text-dark/70 space-y-0.5">
                    {hoursLines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dark/70">
                    {loadingContent ? "Loading..." : "Mon – Sat: 11:00 AM – 8:00 PM"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3 bg-white rounded-4xl shadow-xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-extrabold text-primary mb-2">
                  Message Sent!
                </h3>
                <p className="text-dark/70 text-sm">
                  Thanks for reaching out — our team will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="rounded-xl px-4 py-3 text-sm bg-red-50 text-red-600">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need help with..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-accent hover:bg-accentDark text-white font-bold px-6 py-3 rounded-full text-sm transition-colors disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}