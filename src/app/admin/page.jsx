"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, Bell, RefreshCw, Video, Phone, MessageCircle, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

const typeIcon = {
  Chat: MessageCircle,
  "Audio Call": Phone,
  "Video Call": Video,
  "Clinic Visit": Building2,
};

const PAYMENT_OPTIONS = [
  { value: "approved", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "not_required", label: "Pay at clinic" },
  { value: "rejected", label: "Rejected" },
];

const paymentPillStyle = {
  approved: { color: token.sageDeep, background: token.sage },
  pending: { color: token.gold, background: token.goldSoft },
  rejected: { color: token.roseDeep, background: token.rose },
  not_required: { color: token.inkSoft, background: token.line },
};

// Number of queue items after which left/right arrow controls are shown.
// The row is ALWAYS horizontally scrollable (overflow-x-auto) regardless of
// count — this guarantees the scroll is always contained inside the widget
// and never bleeds out into the page. The threshold only controls whether
// we bother showing the arrow buttons (nice-to-have, not required to scroll).
const QUEUE_SLIDER_THRESHOLD = 6;

function serviceKey(name = "") {
  if (name.startsWith("Acne")) return "Acne";
  if (name.startsWith("Anti")) return "Anti Aging";
  if (name.startsWith("Cosmetic")) return "Cosmetic";
  if (name.startsWith("Laser")) return "Laser";
  return "Other";
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

function PaymentDropdown({ value, onChange, disabled }) {
  const s = paymentPillStyle[value] || paymentPillStyle.pending;
  return (
    <select
      value={value || "pending"}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="text-[11px] font-medium px-2 py-1 rounded-full border-none outline-none cursor-pointer"
      style={{ color: s.color, background: s.background }}
    >
      {PAYMENT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
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

function TypeTag({ type }) {
  const Icon = typeIcon[type] || Building2;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: token.inkSoft }}>
      <Icon size={13} />
      {type || "Clinic Visit"}
    </span>
  );
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const POLL_INTERVAL_MS = 60000;
const LAST_SEEN_KEY = "derma_last_seen_bookings_at";

export default function DermaDashboard() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `.no-scrollbar::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState(null);
  const notifRef = useRef(null);

  // Ref for the Today's Queue horizontal scroll container (slider mode)
  const queueScrollRef = useRef(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(LAST_SEEN_KEY) : null;
    setLastSeenAt(stored || new Date().toISOString());
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load bookings");
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
    const interval = setInterval(() => {
      loadBookings();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  async function handleAction(id, action, extra = {}) {
    setActingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Action failed");
      setBookings((prev) => prev.map((b) => (b._id === id ? data.booking : b)));
    } catch (err) {
      setError(err.message);
    }
    setActingId(null);
  }

  function handlePaymentChange(id, paymentStatus) {
    handleAction(id, "set_payment", { paymentStatus });
  }

  // Scrolls the Today's Queue slider left/right by a fixed pixel amount
  function scrollQueueBy(amount) {
    if (queueScrollRef.current) {
      queueScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  }

  const today = todayISO();

  const newBookings = useMemo(() => {
    if (!lastSeenAt) return [];
    return [...bookings]
      .filter((b) => b.createdAt && new Date(b.createdAt) > new Date(lastSeenAt))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, lastSeenAt]);

  function handleBellClick() {
    setShowNotifDropdown((prev) => !prev);
  }

  function handleMarkAllSeen() {
    const now = new Date().toISOString();
    setLastSeenAt(now);
    if (typeof window !== "undefined") localStorage.setItem(LAST_SEEN_KEY, now);
  }

  // All of today's bookings (used for the "Today's Appointments" KPI count —
  // this should NOT shrink as appointments get marked done, it's a count of
  // everything scheduled today).
  const todaysBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.date === today)
        .sort((a, b) => new Date(`${a.date} ${a.timeSlot}`) - new Date(`${b.date} ${b.timeSlot}`)),
    [bookings, today]
  );

  // Just the still-pending items for the visual queue strip — once a
  // patient is marked done (completed), they drop out of this list and
  // disappear from Today's Queue automatically.
  const todaysQueue = useMemo(
    () => todaysBookings.filter((b) => b.status !== "completed"),
    [todaysBookings]
  );

  // Show arrow controls once the queue is crowded past the threshold.
  // (The strip itself is always scrollable regardless of this flag.)
  const showQueueArrows = todaysQueue.length > QUEUE_SLIDER_THRESHOLD;

  const pendingPayments = useMemo(
    () => bookings.filter((b) => b.paymentStatus === "pending"),
    [bookings]
  );

  const thisMonthRevenue = useMemo(() => {
    const ym = today.slice(0, 7);
    return bookings
      .filter((b) => b.paymentStatus === "approved" && b.date?.startsWith(ym))
      .reduce((sum, b) => sum + (b.amount || 0), 0);
  }, [bookings, today]);

  const newPatientsThisMonth = useMemo(() => {
    const ym = today.slice(0, 7);
    return new Set(
      bookings.filter((b) => b.createdAt?.startsWith(ym)).map((b) => b.email)
    ).size;
  }, [bookings, today]);

  const kpis = [
    { label: "Today's Appointments", value: String(todaysBookings.length), sub: "scheduled today" },
    { label: "Pending Payments", value: String(pendingPayments.length), sub: "need review" },
    { label: "Revenue — This Month", value: `Rs. ${thisMonthRevenue.toLocaleString()}`, sub: "verified payments" },
    { label: "New Patients", value: String(newPatientsThisMonth), sub: "this month" },
  ];

  const revenueTrend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = todayISOForDate(d);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const revenue = bookings
        .filter((b) => b.paymentStatus === "approved" && b.date === iso)
        .reduce((sum, b) => sum + (b.amount || 0), 0);
      days.push({ day: label, revenue });
    }
    return days;
  }, [bookings]);

  const upcoming = useMemo(
    () =>
      [...bookings]
        .filter((b) => b.status !== "cancelled" && b.date >= today)
        .sort((a, b) => new Date(`${a.date} ${a.timeSlot}`) - new Date(`${b.date} ${b.timeSlot}`))
        .slice(0, 8),
    [bookings, today]
  );

  const activity = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((b) => ({
          text: `${b.name} booked ${b.service}`,
          time: timeAgo(b.createdAt),
        })),
    [bookings]
  );

  return (
    <main className="px-4 sm:px-6 md:px-10 py-7 max-w-350 min-w-0 w-full" style={{ color: token.ink }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl md:text-[28px]" style={{ color: token.ink }}>
            {getGreeting()}, <span style={{ fontStyle: "italic", color: token.coral }}>Dr. Malik</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: token.inkSoft }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })} — here's how the clinic looks today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: token.line, background: token.card }}>
            <Search size={15} style={{ color: token.inkSoft }} />
            <input placeholder="Search patients, bookings…" className="text-sm outline-none bg-transparent w-40 md:w-56" style={{ color: token.ink }} />
          </div>
          <button onClick={loadBookings} className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0" style={{ borderColor: token.line, background: token.card }}>
            <RefreshCw size={16} style={{ color: token.ink }} className={loading ? "animate-spin" : ""} />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={handleBellClick}
              className="w-10 h-10 rounded-xl flex items-center justify-center border relative shrink-0"
              style={{ borderColor: token.line, background: token.card }}
            >
              <Bell size={16} style={{ color: token.ink }} />
              {newBookings.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-semibold"
                  style={{ background: token.coral, color: token.card }}
                >
                  {newBookings.length > 9 ? "9+" : newBookings.length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div
                className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border shadow-lg z-20 overflow-hidden"
                style={{ background: token.card, borderColor: token.line }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: token.line }}>
                  <p className="font-display font-semibold text-sm" style={{ color: token.ink }}>New Bookings</p>
                  {newBookings.length > 0 && (
                    <button onClick={handleMarkAllSeen} className="text-xs font-medium" style={{ color: token.teal }}>
                      Mark all seen
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {newBookings.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm" style={{ color: token.inkSoft }}>
                      No new bookings since last check.
                    </p>
                  ) : (
                    newBookings.map((b) => (
                      <div key={b._id} className="flex items-start gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: token.line }}>
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: token.coral }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: token.ink }}>{b.name}</p>
                          <p className="text-xs" style={{ color: token.inkSoft }}>
                            {serviceKey(b.service)} · {b.dateLabel || b.date}, {b.timeSlot}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: token.inkSoft }}>{timeAgo(b.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: token.rose, color: token.roseDeep }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-5 border" style={{ background: token.card, borderColor: token.line }}>
            <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: token.inkSoft }}>{k.label}</p>
            <p className="font-display font-semibold text-[28px] mt-2" style={{ color: token.ink }}>{loading ? "—" : k.value}</p>
            <span className="text-xs" style={{ color: token.inkSoft }}>{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Today's Queue — ALWAYS horizontally scrollable inside its own box
          (overflow-x-auto), never dependent on item count. This guarantees
          the scroll is fully contained here and can never push/scroll the
          whole page. Items use fixed shrink-0 widths (no flex-grow) so the
          row's total width is deterministic and the container reliably
          shows its own scrollbar instead of overflowing its parent. */}
      <div className="rounded-2xl p-5 mb-6 border min-w-0 w-full overflow-hidden" style={{ background: token.card, borderColor: token.line }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold text-lg" style={{ color: token.ink }}>Today's Queue</p>
          <span className="text-xs" style={{ color: token.inkSoft }}>{todaysQueue.length} in queue</span>
        </div>
        {todaysBookings.length === 0 ? (
          <p className="text-sm" style={{ color: token.inkSoft }}>
            {loading ? "Loading…" : "No appointments booked for today yet."}
          </p>
        ) : todaysQueue.length === 0 ? (
          <p className="text-sm" style={{ color: token.inkSoft }}>
            All of today's appointments are marked done. 🎉
          </p>
        ) : (
          <div className="relative min-w-0 w-full">
            {showQueueArrows && (
              <button
                onClick={() => scrollQueueBy(-280)}
                className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center border shadow-md"
                style={{ background: token.card, borderColor: token.line }}
              >
                <ChevronLeft size={16} style={{ color: token.ink }} />
              </button>
            )}

            <div
              ref={queueScrollRef}
              className="flex items-stretch gap-0 overflow-x-auto scroll-smooth no-scrollbar"
              style={{
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingLeft: showQueueArrows ? 36 : 0,
                paddingRight: showQueueArrows ? 36 : 0,
              }}
            >
              {todaysQueue.map((b, i) => {
                const isDone = b.status === "completed";
                return (
                  <React.Fragment key={b._id}>
                    <div className="flex flex-col items-center gap-2 px-2 shrink-0" style={{ width: 110 }}>
                      <span className="font-mono-data text-[11px]" style={{ color: token.inkSoft }}>{b.timeSlot}</span>

                      <button
                        onClick={() => handleAction(b._id, isDone ? "uncomplete" : "complete")}
                        disabled={actingId === b._id}
                        className="w-3 h-3 rounded-full border-2 transition-colors disabled:opacity-50 cursor-pointer"
                        style={{
                          borderColor: serviceColor[serviceKey(b.service)].fg,
                          background: isDone ? token.sageDeep : token.card,
                        }}
                        title={isDone ? "Mark as not done" : "Mark as done"}
                      />
                      <p className="text-xs font-medium text-center leading-tight" style={{ color: token.ink }}>{b.name.split(" ")[0]}</p>
                      <ServiceTag service={b.service} />
                      <TypeTag type={b.appointmentType} />
                    </div>
                    {i < todaysQueue.length - 1 && (
                      <div className="shrink-0 h-px self-center" style={{ width: 40, background: token.line }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {showQueueArrows && (
              <button
                onClick={() => scrollQueueBy(280)}
                className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center border shadow-md"
                style={{ background: token.card, borderColor: token.line }}
              >
                <ChevronRight size={16} style={{ color: token.ink }} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border overflow-hidden" style={{ background: token.card, borderColor: token.line }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <p className="font-display font-semibold text-lg" style={{ color: token.ink }}>Upcoming Appointments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr style={{ color: token.inkSoft }} className="text-xs uppercase tracking-wide font-semibold">
                  <td className="px-5 py-2">Patient</td>
                  <td className="px-5 py-2">Service</td>
                  <td className="px-5 py-2">Type</td>
                  <td className="px-5 py-2">Time</td>
                  <td className="px-5 py-2">Status</td>
                  <td className="px-5 py-2">Payment</td>
                </tr>
              </thead>
              <tbody>
                {upcoming.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-sm" style={{ color: token.inkSoft }}>
                      {loading ? "Loading bookings…" : "No upcoming bookings."}
                    </td>
                  </tr>
                )}
                {upcoming.map((b) => (
                  <tr key={b._id} style={{ borderTop: `1px solid ${token.line}` }}>
                    <td className="px-5 py-3 font-medium">{b.name}</td>
                    <td className="px-5 py-3"><ServiceTag service={b.service} /></td>
                    <td className="px-5 py-3"><TypeTag type={b.appointmentType} /></td>
                    <td className="px-5 py-3 font-mono-data text-xs" style={{ color: token.inkSoft }}>
                      {b.dateLabel || b.date}, {b.timeSlot}
                    </td>
                    <td className="px-5 py-3"><StatusPill status={b.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <PaymentDropdown
                          value={b.paymentStatus}
                          disabled={actingId === b._id}
                          onChange={(val) => handlePaymentChange(b._id, val)}
                        />
                        {b.transactionRef && (
                          <span className="font-mono-data text-[10px]" style={{ color: token.inkSoft }}>
                            Ref: {b.transactionRef}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl p-5 border" style={{ background: token.card, borderColor: token.line }}>
            <p className="font-display font-semibold text-lg mb-1" style={{ color: token.ink }}>Revenue — Last 7 Days</p>
            <p className="text-xs mb-3" style={{ color: token.inkSoft }}>
              Total Rs. {revenueTrend.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={token.coral} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={token.coral} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={token.line} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: token.inkSoft }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${token.line}`, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke={token.coral} strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 border flex-1" style={{ background: token.card, borderColor: token.line }}>
            <p className="font-display font-semibold text-lg mb-3" style={{ color: token.ink }}>Recent Activity</p>
            {activity.length === 0 ? (
              <p className="text-sm" style={{ color: token.inkSoft }}>{loading ? "Loading…" : "No activity yet."}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: token.coral }} />
                    <div>
                      <p className="text-sm" style={{ color: token.ink }}>{a.text}</p>
                      <p className="text-xs" style={{ color: token.inkSoft }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function todayISOForDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}