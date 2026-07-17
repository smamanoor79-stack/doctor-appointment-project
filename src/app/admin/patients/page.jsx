"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Trash2 } from "lucide-react";

const token = {
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
  teal: "#245C56",
  tealSoft: "#D2E6E3",
  gold: "#9C7A1F",
  goldSoft: "#F1E4C6",
};

const serviceColor = {
  Acne: { fg: token.coral, bg: token.coralSoft },
  "Anti Aging": { fg: token.sageDeep, bg: token.sage },
  Cosmetic: { fg: token.roseDeep, bg: token.rose },
  Laser: { fg: token.teal, bg: token.tealSoft },
  Other: { fg: token.gold, bg: token.goldSoft },
};

function serviceKey(name = "") {
  if (name.startsWith("Acne")) return "Acne";
  if (name.startsWith("Anti")) return "Anti Aging";
  if (name.startsWith("Cosmetic")) return "Cosmetic";
  if (name.startsWith("Laser")) return "Laser";
  return "Other";
}

function ServiceTag({ service }) {
  const key = serviceKey(service);
  const c = serviceColor[key];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ color: c.fg, background: c.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.fg }} />
      {key}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    confirmed: { color: token.sageDeep, background: token.sage, label: "Confirmed" },
    pending: { color: token.coral, background: token.coralSoft, label: "Pending" },
    cancelled: { color: token.roseDeep, background: token.rose, label: "Rejected" },
    completed: { color: token.teal, background: token.tealSoft, label: "Completed" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: s.color, background: s.background }}>
      {s.label}
    </span>
  );
}

export default function PatientsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load bookings");
      const sorted = [...(data.bookings || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sorted);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("You want to Delete this Booking? This action can't be Undone.");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // response had no JSON body (e.g. server error / method not allowed)
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Delete failed (status ${res.status})`);
      }

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message);
    }
    setDeletingId(null);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return bookings;
    const q = search.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.phone?.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  return (
    <main className="px-6 md:px-10 py-7 max-w-[1400px]" style={{ color: token.ink }}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl md:text-[28px]" style={{ color: token.ink }}>
            Patients
          </h1>
          <p className="text-sm mt-1" style={{ color: token.inkSoft }}>
            {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={loadBookings}
          className="w-10 h-10 rounded-xl flex items-center justify-center border"
          style={{ borderColor: token.line, background: token.card }}
        >
          <RefreshCw size={16} style={{ color: token.ink }} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div
        className="rounded-2xl p-4 mb-6 border flex items-center gap-2"
        style={{ background: token.card, borderColor: token.line }}
      >
        <Search size={15} style={{ color: token.inkSoft }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone"
          className="text-sm outline-none bg-transparent w-full"
          style={{ color: token.ink }}
        />
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: token.rose, color: token.roseDeep }}>
          {error}
        </div>
      )}

      <div className="rounded-2xl border overflow-hidden" style={{ background: token.card, borderColor: token.line }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: token.inkSoft, borderBottom: `1px solid ${token.line}` }} className="text-xs uppercase tracking-wide font-semibold">
              <td className="px-5 py-3">Patient</td>
              <td className="px-5 py-3">Contact</td>
              <td className="px-5 py-3">Service</td>
              <td className="px-5 py-3">Date & Time</td>
              <td className="px-5 py-3">Status</td>
              <td className="px-5 py-3">Amount</td>
              <td className="px-5 py-3">Action</td>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b._id} style={{ borderTop: `1px solid ${token.line}` }}>
                <td className="px-5 py-4 font-semibold" style={{ color: token.ink }}>{b.name}</td>
                <td className="px-5 py-4 text-xs" style={{ color: token.inkSoft }}>
                  {b.email}<br />{b.phone}
                </td>
                <td className="px-5 py-4"><ServiceTag service={b.service} /></td>
                <td className="px-5 py-4 font-mono-data text-xs" style={{ color: token.inkSoft }}>
                  {b.dateLabel || b.date}, {b.timeSlot}
                </td>
                <td className="px-5 py-4"><StatusPill status={b.status} /></td>
                <td className="px-5 py-4 text-xs" style={{ color: token.ink }}>Rs. {(b.amount || 0).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleDelete(b._id)}
                    disabled={deletingId === b._id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-50"
                    style={{ borderColor: token.line, background: token.card }}
                    title="Delete booking"
                  >
                    <Trash2 size={14} style={{ color: token.roseDeep }} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm" style={{ color: token.inkSoft }}>
                  {loading ? "Loading patients…" : "No patients found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}