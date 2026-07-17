"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Save, Check } from "lucide-react";

const token = {
  forest: "#16302A",
  cream: "#F7F4EE",
  card: "#FFFFFF",
  ink: "#0E1512",
  inkSoft: "#4B564F",
  line: "#E3DDD0",
  coral: "#DD6B3E",
  coralSoft: "#FBE1D2",
  sage: "#CDE0D2",
  sageDeep: "#2F6146",
  rose: "#E9C1C9",
  roseDeep: "#9C3F4C",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function normalizeContent(c) {
  return {
    clinicName: c.clinicName || "",
    tagline: c.tagline || "",
    logo: c.logo || "",
    doctorName: c.doctorName || "",
    credentials: c.credentials || "",
    phone: c.phone || "",
    whatsapp: c.whatsapp || "",
    email: c.email || "",
    address: c.address || "",
    mapLink: c.mapLink || "",
    socials: {
      instagram: c.socials?.instagram || "",
      facebook: c.socials?.facebook || "",
      tiktok: c.socials?.tiktok || "",
    },
    consultationFee: c.consultationFee || "",
    bankAccount: c.bankAccount || "",
    jazzcash: c.jazzcash || "",
    easypaisa: c.easypaisa || "",
    paymentInstructions: c.paymentInstructions || "",
    metaTitle: c.metaTitle || "",
    metaDescription: c.metaDescription || "",
    footerText: c.footerText || "",
    slotDuration: c.slotDuration || 20,
    workingHours:
      c.workingHours && c.workingHours.length > 0
        ? c.workingHours.map((h) => ({
            day: h.day,
            closed: h.closed || false,
            morning: { open: h.morning?.open || "", close: h.morning?.close || "" },
            evening: { open: h.evening?.open || "", close: h.evening?.close || "" },
          }))
        : DAYS.map((day) => ({
            day,
            closed: false,
            morning: { open: "", close: "" },
            evening: { open: "", close: "" },
          })),
  };
}

function Section({ title, sub, children }) {
  return (
    <div className="rounded-2xl p-5 md:p-6 border mb-6" style={{ background: token.card, borderColor: token.line }}>
      <p className="font-display font-semibold text-lg" style={{ color: token.ink }}>{title}</p>
      {sub && <p className="text-xs mt-1 mb-4" style={{ color: token.inkSoft }}>{sub}</p>}
      <div className={sub ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: token.inkSoft }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  borderColor: token.line,
  background: token.cream,
  color: token.ink,
};

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none focus:border-current"
      style={{ ...inputStyle, ...(props.style || {}) }}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none focus:border-current resize-none"
      style={{ ...inputStyle, ...(props.style || {}) }}
    />
  );
}

export default function ContentPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function loadContent() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load content");
      setContent(normalizeContent(data.content));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadContent();
  }, []);

  function update(field, value) {
    setContent((prev) => ({ ...prev, [field]: value }));
  }

  function updateNested(group, field, value) {
    setContent((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }));
  }

  function updateHourRange(index, session, field, value) {
    setContent((prev) => {
      const hours = [...prev.workingHours];
      hours[index] = {
        ...hours[index],
        [session]: { ...hours[index][session], [field]: value },
      };
      return { ...prev, workingHours: hours };
    });
  }

  function toggleClosed(index, value) {
    setContent((prev) => {
      const hours = [...prev.workingHours];
      hours[index] = { ...hours[index], closed: value };
      return { ...prev, workingHours: hours };
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save");
      setContent(normalizeContent(data.content));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  if (loading || !content) {
    return (
      <main className="px-6 md:px-10 py-7 max-w-250">
        <p className="text-sm" style={{ color: token.inkSoft }}>Loading content…</p>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-10 py-7 max-w-250" style={{ color: token.ink }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl md:text-[28px]">Site Settings</h1>
          <p className="text-sm mt-1" style={{ color: token.inkSoft }}>
            Edit what appears on your public website — no code changes needed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadContent}
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ borderColor: token.line, background: token.card }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl disabled:opacity-60"
            style={{ background: saved ? token.sageDeep : token.forest, color: token.card }}
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: token.rose, color: token.roseDeep }}>
          {error}
        </div>
      )}

      {/* Clinic identity */}
      <Section title="Clinic Identity" sub="Name and tagline shown across the site.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Clinic name">
            <TextInput value={content.clinicName} onChange={(e) => update("clinicName", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <TextInput value={content.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </Field>
          <Field label="Doctor name">
            <TextInput value={content.doctorName} onChange={(e) => update("doctorName", e.target.value)} />
          </Field>
          <Field label="Credentials">
            <TextInput
              placeholder="MBBS, FCPS (Dermatology)"
              value={content.credentials}
              onChange={(e) => update("credentials", e.target.value)}
            />
          </Field>
          <Field label="Logo URL">
            <TextInput value={content.logo} onChange={(e) => update("logo", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact Details" sub="Shown in the header, footer, and contact section.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone">
            <TextInput value={content.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <TextInput value={content.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={content.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Google Maps link">
            <TextInput value={content.mapLink} onChange={(e) => update("mapLink", e.target.value)} />
          </Field>
          <Field label="Address" full>
            <TextArea rows={2} value={content.address} onChange={(e) => update("address", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Working hours */}
      <Section
        title="Working Hours"
        sub="Toggle a day off if the clinic is closed. Two sessions per day — morning and evening."
      >
        <div className="mb-5">
          <Field label="Appointment slot duration (minutes)">
            <TextInput
              type="number"
              min={5}
              step={5}
              value={content.slotDuration}
              onChange={(e) => update("slotDuration", Number(e.target.value))}
              style={{ width: 130 }}
            />
          </Field>
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: token.line }}>
          {content.workingHours.map((h, i) => (
            <div key={h.day} className="py-3" style={{ borderColor: token.line }}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="w-24 text-sm font-medium">{h.day}</span>
                <label className="flex items-center gap-1.5 text-xs" style={{ color: token.inkSoft }}>
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => toggleClosed(i, e.target.checked)}
                  />
                  Closed
                </label>
              </div>

              {!h.closed && (
                <div className="grid sm:grid-cols-2 gap-4 pl-0 sm:pl-30">
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: token.inkSoft }}>Morning</p>
                    <div className="flex items-center gap-2">
                      <TextInput
                        placeholder="10:00 AM"
                        value={h.morning?.open || ""}
                        onChange={(e) => updateHourRange(i, "morning", "open", e.target.value)}
                        style={{ width: 130 }}
                      />
                      <span className="text-xs" style={{ color: token.inkSoft }}>to</span>
                      <TextInput
                        placeholder="2:00 PM"
                        value={h.morning?.close || ""}
                        onChange={(e) => updateHourRange(i, "morning", "close", e.target.value)}
                        style={{ width: 130 }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: token.inkSoft }}>Evening</p>
                    <div className="flex items-center gap-2">
                      <TextInput
                        placeholder="5:00 PM"
                        value={h.evening?.open || ""}
                        onChange={(e) => updateHourRange(i, "evening", "open", e.target.value)}
                        style={{ width: 130 }}
                      />
                      <span className="text-xs" style={{ color: token.inkSoft }}>to</span>
                      <TextInput
                        placeholder="9:00 PM"
                        value={h.evening?.close || ""}
                        onChange={(e) => updateHourRange(i, "evening", "close", e.target.value)}
                        style={{ width: 130 }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Socials */}
      <Section title="Social Links">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Instagram">
            <TextInput value={content.socials.instagram} onChange={(e) => updateNested("socials", "instagram", e.target.value)} />
          </Field>
          <Field label="Facebook">
            <TextInput value={content.socials.facebook} onChange={(e) => updateNested("socials", "facebook", e.target.value)} />
          </Field>
          <Field label="TikTok">
            <TextInput value={content.socials.tiktok} onChange={(e) => updateNested("socials", "tiktok", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Payments */}
      <Section title="Payment Settings" sub="Shown to patients when they book and need to pay an advance.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Consultation fee">
            <TextInput value={content.consultationFee} onChange={(e) => update("consultationFee", e.target.value)} />
          </Field>
          <Field label="Bank account">
            <TextInput value={content.bankAccount} onChange={(e) => update("bankAccount", e.target.value)} />
          </Field>
          <Field label="JazzCash number">
            <TextInput value={content.jazzcash} onChange={(e) => update("jazzcash", e.target.value)} />
          </Field>
          <Field label="EasyPaisa number">
            <TextInput value={content.easypaisa} onChange={(e) => update("easypaisa", e.target.value)} />
          </Field>
          <Field label="Payment instructions" full>
            <TextArea
              rows={3}
              placeholder="Please send the advance payment and upload your transaction screenshot/reference below."
              value={content.paymentInstructions}
              onChange={(e) => update("paymentInstructions", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO" sub="Controls how your site appears on Google and when shared.">
        <div className="grid gap-4">
          <Field label="Page title">
            <TextInput value={content.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} />
          </Field>
          <Field label="Meta description">
            <TextArea rows={2} value={content.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <Field label="Footer text">
          <TextInput
            placeholder="© 2026 Dr. Ahsan Malik Clinic. All rights reserved."
            value={content.footerText}
            onChange={(e) => update("footerText", e.target.value)}
          />
        </Field>
      </Section>
    </main>
  );
}