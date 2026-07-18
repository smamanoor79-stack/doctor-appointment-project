"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Copy, Filter, ChevronDown } from "lucide-react";

const token = {
  forest: "#16302A",
  forestSoft: "#234339",
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

// Status options shown in the dropdown, mirroring the Appointments page pattern
const STATUS_OPTIONS = [
  { value: "approved", label: "Verified", color: token.sageDeep, background: token.sage },
  { value: "pending", label: "Pending", color: token.gold, background: token.goldSoft },
  { value: "not_required", label: "Pay at clinic", color: token.inkSoft, background: token.line },
  { value: "rejected", label: "Rejected", color: token.roseDeep, background: token.rose },
];

function statusStyle(paymentStatus) {
  return STATUS_OPTIONS.find((s) => s.value === paymentStatus) || STATUS_OPTIONS[1];
}

function PaymentStatusDropdown({ booking, onChange, disabled }) {
  const s = statusStyle(booking.paymentStatus);
  return (
    <div className="relative inline-block">
      <select
        value={booking.paymentStatus}
        disabled={disabled}
        onChange={(e) => onChange(booking._id, e.target.value)}
        className="appearance-none text-xs font-medium pl-2.5 pr-7 py-1 rounded-full outline-none cursor-pointer disabled:opacity-50"
        style={{ color: s.color, background: s.background, border: "none" }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ color: token.ink, background: token.card }}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
        style={{ color: s.color }}
      />
    </div>
  );
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Verified" },
  { key: "rejected", label: "Rejected" },
];

export default function PaymentsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load payments");
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);


  async function handleStatusChange(id, paymentStatus) {
    setActingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Action failed");
      setBookings((prev) => prev.map((b) => (b._id === id ? data.booking : b)));
    } catch (err) {
      setError(err.message);
    }
    setActingId(null);
  }

  // ---- Derived data --------------------------------------------------------
  const payable = useMemo(() => bookings.filter((b) => b.paymentStatus !== "not_required"), [bookings]);

  const totals = useMemo(() => {
    const approved = payable.filter((b) => b.paymentStatus === "approved");
    const pending = payable.filter((b) => b.paymentStatus === "pending");
    const rejected = payable.filter((b) => b.paymentStatus === "rejected");
    const verifiedAmount = approved.reduce((s, b) => s + (b.amount || 0), 0);
    const pendingAmount = pending.reduce((s, b) => s + (b.amount || 0), 0);
    return {
      verifiedAmount,
      pendingAmount,
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
    };
  }, [payable]);

  const kpis = [
    { label: "Verified Revenue", value: `Rs. ${totals.verifiedAmount.toLocaleString()}`, sub: `${totals.approvedCount} payments` },
    { label: "Awaiting Review", value: `Rs. ${totals.pendingAmount.toLocaleString()}`, sub: `${totals.pendingCount} pending` },
    { label: "Rejected", value: String(totals.rejectedCount), sub: "declined transactions" },
    { label: "Total Transactions", value: String(payable.length), sub: "all time" },
  ];

  const filtered = useMemo(() => {
    let rows = payable;
    if (filter !== "all") rows = rows.filter((b) => b.paymentStatus === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.phone?.toLowerCase().includes(q) ||
          b.transactionRef?.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [payable, filter, query]);

  function copyRef(ref) {
    if (ref) navigator.clipboard?.writeText(ref);
  }

  return (
    <main className="px-4 sm:px-6 md:px-10 py-5 md:py-7 max-w-350" style={{ color: token.ink }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="font-display font-semibold text-xl sm:text-2xl md:text-[28px]" style={{ color: token.ink }}>
            Payments
          </h1>
          <p className="text-sm mt-1" style={{ color: token.inkSoft }}>
            {payable.length} transactions — review and verify patient payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: token.line, background: token.card }}>
            <Search size={15} style={{ color: token.inkSoft }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, ref…"
              className="text-sm outline-none bg-transparent w-44 md:w-56"
              style={{ color: token.ink }}
            />
          </div>
          <button
            onClick={loadBookings}
            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border"
            style={{ borderColor: token.line, background: token.card }}
          >
            <RefreshCw size={16} style={{ color: token.ink }} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Search bar for small screens, full width below the header row */}
        <div className="flex sm:hidden items-center gap-2 px-3 py-2 rounded-xl border w-full" style={{ borderColor: token.line, background: token.card }}>
          <Search size={15} style={{ color: token.inkSoft }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, ref…"
            className="text-sm outline-none bg-transparent w-full"
            style={{ color: token.ink }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: token.rose, color: token.roseDeep }}>
          {error}
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-5 border" style={{ background: token.card, borderColor: token.line }}>
            <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: token.inkSoft }}>{k.label}</p>
            <p className="font-display font-semibold text-2xl md:text-[26px] mt-2" style={{ color: token.ink }}>{loading ? "—" : k.value}</p>
            <span className="text-xs" style={{ color: token.inkSoft }}>{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: token.card, borderColor: token.line }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 pt-5 pb-3">
          <p className="font-display font-semibold text-lg" style={{ color: token.ink }}>Transactions</p>
          <div className="flex items-center gap-1.5 p-1 rounded-xl overflow-x-auto" style={{ background: token.cream }}>
            <Filter size={13} className="shrink-0" style={{ color: token.inkSoft, marginLeft: 6 }} />
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0"
                  style={{
                    color: active ? token.card : token.inkSoft,
                    background: active ? token.forest : "transparent",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop / tablet: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: token.inkSoft }} className="text-xs uppercase tracking-wide font-semibold">
                <td className="px-5 py-2 whitespace-nowrap">Patient</td>
                <td className="px-5 py-2 whitespace-nowrap">Service</td>
                <td className="px-5 py-2 whitespace-nowrap">Reference</td>
                <td className="px-5 py-2 whitespace-nowrap">Date</td>
                <td className="px-5 py-2 whitespace-nowrap">Amount</td>
                <td className="px-5 py-2 whitespace-nowrap">Status</td>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: token.inkSoft }}>
                    {loading ? "Loading transactions…" : "No transactions match this view."}
                  </td>
                </tr>
              )}
              {filtered.map((b) => (
                <tr key={b._id} style={{ borderTop: `1px solid ${token.line}` }}>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="font-medium" style={{ color: token.ink }}>{b.name}</p>
                    <p className="text-xs" style={{ color: token.inkSoft }}>{b.email}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap"><ServiceTag service={b.service} /></td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {b.transactionRef ? (
                      <button
                        onClick={() => copyRef(b.transactionRef)}
                        className="inline-flex items-center gap-1.5 font-mono-data text-xs px-2 py-1 rounded-lg border"
                        style={{ borderColor: token.line, color: token.inkSoft }}
                        title="Copy reference"
                      >
                        {b.transactionRef}
                        <Copy size={11} />
                      </button>
                    ) : (
                      <span className="text-xs" style={{ color: token.inkSoft }}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono-data text-xs whitespace-nowrap" style={{ color: token.inkSoft }}>
                    {b.dateLabel || b.date}
                  </td>
                  <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: token.ink }}>
                    Rs. {(b.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <PaymentStatusDropdown
                      booking={b}
                      onChange={handleStatusChange}
                      disabled={actingId === b._id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-sm" style={{ color: token.inkSoft }}>
              {loading ? "Loading transactions…" : "No transactions match this view."}
            </div>
          )}
          {filtered.map((b) => (
            <div key={b._id} className="px-4 sm:px-5 py-4" style={{ borderTop: `1px solid ${token.line}` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: token.ink }}>{b.name}</p>
                  <p className="text-xs truncate" style={{ color: token.inkSoft }}>{b.email}</p>
                </div>
                <p className="font-medium text-sm shrink-0" style={{ color: token.ink }}>
                  Rs. {(b.amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 mb-2">
                <ServiceTag service={b.service} />
                <PaymentStatusDropdown
                  booking={b}
                  onChange={handleStatusChange}
                  disabled={actingId === b._id}
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-xs pt-2" style={{ borderTop: `1px solid ${token.line}`, color: token.inkSoft }}>
                <span className="font-mono-data">{b.dateLabel || b.date}</span>
                {b.transactionRef ? (
                  <button
                    onClick={() => copyRef(b.transactionRef)}
                    className="inline-flex items-center gap-1.5 font-mono-data text-xs px-2 py-1 rounded-lg border"
                    style={{ borderColor: token.line, color: token.inkSoft }}
                    title="Copy reference"
                  >
                    {b.transactionRef}
                    <Copy size={11} />
                  </button>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}