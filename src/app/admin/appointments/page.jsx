"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Trash2, RefreshCw, Plus, Pencil, X as XIcon, ArchiveRestore, Video, Phone, MessageCircle, Building2 } from "lucide-react";

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

const SERVICES = ["Acne", "Anti Aging", "Cosmetic", "Laser", "Other"];

// Matches the appointment types used on the public booking form (book/page.jsx)
const APPOINTMENT_TYPES = ["Chat", "Audio Call", "Video Call", "Clinic Visit"];

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

const paymentPillStyle = {
  approved: { color: token.sageDeep, background: token.sage },
  pending: { color: token.gold, background: token.goldSoft },
  rejected: { color: token.roseDeep, background: token.rose },
  not_required: { color: token.inkSoft, background: token.line },
};

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

// Shows the appointment type with a matching icon (Chat / Audio Call / Video Call / Clinic Visit).
// Falls back to "Clinic Visit" + building icon if older bookings are missing this field.
function TypeTag({ type }) {
  const Icon = typeIcon[type] || Building2;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: token.inkSoft }}>
      <Icon size={13} />
      {type || "Clinic Visit"}
    </span>
  );
}

const STATUS_FILTERS = [
  { id: "all", label: "All statuses" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const SERVICE_FILTERS = ["All services", "Acne", "Anti Aging", "Cosmetic", "Laser", "Other"];

const inputStyle = {
  borderColor: token.line,
  background: token.cream,
  color: token.ink,
};

function ModalField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: token.inkSoft }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(14,21,18,0.45)" }}>
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: token.card }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: token.line }}>
          <p className="font-display font-semibold text-lg" style={{ color: token.ink }}>{title}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: token.cream }}>
            <XIcon size={16} style={{ color: token.ink }} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "Acne",
  appointmentType: "Clinic Visit",
  date: "",
  timeSlot: "",
  paymentStatus: "not_required",
};

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const [view, setView] = useState("active"); // "active" | "archived"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("All services");

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [editBooking, setEditBooking] = useState(null);
  const [editForm, setEditForm] = useState(null);

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

  function handleRestore(id) {
    handleAction(id, "restore");
  }

  async function handleDelete(id, name) {
    const ok = window.confirm(`Permanently delete ${name}'s appointment? This cannot be undone and will remove it from revenue history.`);
    if (!ok) return;

    setActingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Delete failed");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message);
    }
    setActingId(null);
  }

  async function handleCreate() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to create appointment");
      setBookings((prev) => [data.booking, ...prev]);
      setShowAddModal(false);
      setAddForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  function openEdit(b) {
    setEditBooking(b);
    setEditForm({
      name: b.name || "",
      email: b.email || "",
      phone: b.phone || "",
      service: serviceKey(b.service),
      appointmentType: b.appointmentType || "Clinic Visit",
      date: b.date || "",
      timeSlot: b.timeSlot || "",
    });
  }

  async function handleEditSave() {
    if (!editBooking) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${editBooking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", ...editForm }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save changes");
      setBookings((prev) => prev.map((b) => (b._id === editBooking._id ? data.booking : b)));
      setEditBooking(null);
      setEditForm(null);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  const filtered = useMemo(() => {
    return [...bookings]
      .filter((b) => (view === "archived" ? !!b.archived : !b.archived))
      .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
      .filter((b) => (serviceFilter === "All services" ? true : serviceKey(b.service) === serviceFilter))
      .filter((b) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return (
          b.name?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.phone?.toLowerCase().includes(q) ||
          b.bookingNumber?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Completed appointments always sink to the bottom, everything else sorted by date/time.
        const aDone = a.status === "completed" ? 1 : 0;
        const bDone = b.status === "completed" ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        return new Date(`${a.date} ${a.timeSlot}`) - new Date(`${b.date} ${b.timeSlot}`);
      });
  }, [bookings, view, search, statusFilter, serviceFilter]);

  const archivedCount = useMemo(() => bookings.filter((b) => b.archived).length, [bookings]);
  const activeCount = useMemo(() => bookings.filter((b) => !b.archived).length, [bookings]);

  return (
    <main className="px-6 md:px-10 py-7 max-w-[1400px]" style={{ color: token.ink }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl md:text-[28px]" style={{ color: token.ink }}>
            Appointments
          </h1>
          <p className="text-sm mt-1" style={{ color: token.inkSoft }}>
            {filtered.length} of {view === "archived" ? archivedCount : activeCount} bookings shown
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl"
            style={{ background: token.forest, color: token.card }}
          >
            <Plus size={15} /> New appointment
          </button>
          <button
            onClick={loadBookings}
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ borderColor: token.line, background: token.card }}
          >
            <RefreshCw size={16} style={{ color: token.ink }} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Active / Archived tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setView("active")}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          style={
            view === "active"
              ? { background: token.forest, color: token.card }
              : { background: token.card, color: token.inkSoft, border: `1px solid ${token.line}` }
          }
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setView("archived")}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          style={
            view === "archived"
              ? { background: token.forest, color: token.card }
              : { background: token.card, color: token.inkSoft, border: `1px solid ${token.line}` }
          }
        >
          Completed ({archivedCount})
        </button>
      </div>

      {/* Filters bar */}
      <div className="rounded-2xl p-4 mb-6 border flex flex-col md:flex-row gap-3" style={{ background: token.card, borderColor: token.line }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1" style={{ borderColor: token.line }}>
          <Search size={15} style={{ color: token.inkSoft }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or booking #"
            className="text-sm outline-none bg-transparent w-full"
            style={{ color: token.ink }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm rounded-xl border px-3 py-2 outline-none"
          style={{ borderColor: token.line, color: token.ink, background: token.card }}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="text-sm rounded-xl border px-3 py-2 outline-none"
          style={{ borderColor: token.line, color: token.ink, background: token.card }}
        >
          {SERVICE_FILTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: token.rose, color: token.roseDeep }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: token.card, borderColor: token.line }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: token.inkSoft }} className="text-xs uppercase tracking-wide font-semibold">
              <td className="px-5 py-3 w-10">Done</td>
              <td className="px-5 py-3">Patient</td>
              <td className="px-5 py-3">Service</td>
              <td className="px-5 py-3">Type</td>
              <td className="px-5 py-3">Time</td>
              <td className="px-5 py-3">Status</td>
              <td className="px-5 py-3">Payment</td>
              <td className="px-5 py-3">Actions</td>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-sm" style={{ color: token.inkSoft }}>
                  {loading ? "Loading bookings…" : "No bookings match these filters."}
                </td>
              </tr>
            )}
            {filtered.map((b) => {
              const busy = actingId === b._id;
              const isCompleted = b.status === "completed";
              const canToggle = b.status === "confirmed" || b.status === "completed";
              return (
                <tr
                  key={b._id}
                  style={{
                    borderTop: `1px solid ${token.line}`,
                    background: isCompleted ? "#E7F2E9" : "transparent",
                    transition: "background 0.2s ease",
                  }}
                >
                  <td className="px-5 py-3">
                    {canToggle ? (
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        disabled={busy}
                        onChange={() =>
                          handleAction(b._id, isCompleted ? "uncomplete" : "complete")
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: token.sageDeep }}
                        title={isCompleted ? "Completed — click to undo" : "Mark appointment as done"}
                      />
                    ) : null}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{b.name}</p>
                    <p className="text-[11px] font-mono-data" style={{ color: token.inkSoft }}>{b.bookingNumber}</p>
                  </td>
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
                        disabled={busy}
                        onChange={(val) => handlePaymentChange(b._id, val)}
                      />
                      {b.transactionRef && (
                        <span className="font-mono-data text-[10px]" style={{ color: token.inkSoft }}>
                          Ref: {b.transactionRef}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={busy}
                        onClick={() => openEdit(b)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: token.tealSoft, color: token.teal }}
                        title="Edit appointment"
                      >
                        <Pencil size={13} />
                      </button>

                      {view === "active" ? (
                        <button
                          disabled={busy}
                          onClick={() => handleDelete(b._id, b.name)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: token.rose, color: token.roseDeep }}
                          title="Delete appointment"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <>
                          <button
                            disabled={busy}
                            onClick={() => handleRestore(b._id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: token.sage, color: token.sageDeep }}
                            title="Restore appointment"
                          >
                            <ArchiveRestore size={13} />
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => handleDelete(b._id, b.name)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: token.rose, color: token.roseDeep }}
                            title="Permanently delete appointment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New Appointment Modal */}
      {showAddModal && (
        <Modal title="New Appointment" onClose={() => setShowAddModal(false)}>
          <div className="grid gap-4">
            <ModalField label="Patient name">
              <input
                className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                style={inputStyle}
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Phone">
                <input
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={addForm.phone}
                  onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </ModalField>
              <ModalField label="Email (optional)">
                <input
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                />
              </ModalField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Service">
                <select
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={addForm.service}
                  onChange={(e) => setAddForm((f) => ({ ...f, service: e.target.value }))}
                >
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </ModalField>
              <ModalField label="Type">
                <select
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={addForm.appointmentType}
                  onChange={(e) => setAddForm((f) => ({ ...f, appointmentType: e.target.value }))}
                >
                  {APPOINTMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </ModalField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Date">
                <input
                  type="date"
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={addForm.date}
                  onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value }))}
                />
              </ModalField>
              <ModalField label="Time slot">
                <input
                  placeholder="5:00 PM"
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={addForm.timeSlot}
                  onChange={(e) => setAddForm((f) => ({ ...f, timeSlot: e.target.value }))}
                />
              </ModalField>
            </div>
            <ModalField label="Payment status">
              <select
                className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                style={inputStyle}
                value={addForm.paymentStatus}
                onChange={(e) => setAddForm((f) => ({ ...f, paymentStatus: e.target.value }))}
              >
                {PAYMENT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </ModalField>

            <button
              onClick={handleCreate}
              disabled={saving || !addForm.name || !addForm.phone || !addForm.date || !addForm.timeSlot}
              className="mt-2 text-sm font-medium px-4 py-3 rounded-xl disabled:opacity-50"
              style={{ background: token.forest, color: token.card }}
            >
              {saving ? "Creating…" : "Create appointment"}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Appointment Modal */}
      {editBooking && editForm && (
        <Modal title={`Edit — ${editBooking.name}`} onClose={() => { setEditBooking(null); setEditForm(null); }}>
          <div className="grid gap-4">
            <ModalField label="Patient name">
              <input
                className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                style={inputStyle}
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Phone">
                <input
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </ModalField>
              <ModalField label="Email">
                <input
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </ModalField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Service">
                <select
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={editForm.service}
                  onChange={(e) => setEditForm((f) => ({ ...f, service: e.target.value }))}
                >
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </ModalField>
              <ModalField label="Type">
                <select
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={editForm.appointmentType}
                  onChange={(e) => setEditForm((f) => ({ ...f, appointmentType: e.target.value }))}
                >
                  {APPOINTMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </ModalField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Date">
                <input
                  type="date"
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={editForm.date}
                  onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                />
              </ModalField>
              <ModalField label="Time slot">
                <input
                  placeholder="5:00 PM"
                  className="w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none"
                  style={inputStyle}
                  value={editForm.timeSlot}
                  onChange={(e) => setEditForm((f) => ({ ...f, timeSlot: e.target.value }))}
                />
              </ModalField>
            </div>

            <button
              onClick={handleEditSave}
              disabled={saving}
              className="mt-2 text-sm font-medium px-4 py-3 rounded-xl disabled:opacity-50"
              style={{ background: token.forest, color: token.card }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}