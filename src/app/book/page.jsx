"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const services = [
    { id: "acne", name: "Acne Treatment" },
    { id: "antiaging", name: "Anti Aging Care" },
    { id: "cosmetic", name: "Cosmetic Procedure" },
    { id: "laser", name: "Laser Therapy" },
    { id: "other", name: "Other" },
];

const appointmentTypes = [
    { id: "chat", name: "Chat", icon: "💬", price: 1000 },
    { id: "audio", name: "Audio Call", icon: "📞", price: 1500 },
    { id: "video", name: "Video Call", icon: "🎥", price: 2000 },
    { id: "clinic", name: "Clinic Visit", icon: "🏥", price: 3000 },
];

const paymentMethods = [
    { id: "card", name: "Bank Transfer", icon: "🏦" },
    { id: "jazzcash", name: "JazzCash", icon: "📱" },
    { id: "easypaisa", name: "EasyPaisa", icon: "📲" },
];

// Used only until the admin content finishes loading (or if a field is left empty).
const PAYMENT_FALLBACK = {
    clinicTitle: "Dr. Ahsan Malik Clinic",
    jazzcash: "0300-1234567",
    easypaisa: "0300-1234567",
    bankAccount: "HBL — PK00 HABB 0000 1234 5678 9012",
    consultationFee: "1,000",
    paymentInstructions:
        "After transferring, enter the Transaction ID / Reference Number below.",
    whatsapp: "923001234567",
};

// Builds the { jazzcash, easypaisa, card } instruction blocks shown at Step 4,
// pulling numbers straight from the admin's Payment Settings (SiteContent doc).
function buildPaymentInstructions(content) {
    const clinicTitle = content?.clinicName || PAYMENT_FALLBACK.clinicTitle;
    const jazzcash = content?.jazzcash || PAYMENT_FALLBACK.jazzcash;
    const easypaisa = content?.easypaisa || PAYMENT_FALLBACK.easypaisa;
    const bankAccount = content?.bankAccount || PAYMENT_FALLBACK.bankAccount;

    return {
        jazzcash: {
            label: "JazzCash",
            lines: [
                { key: "Account Title", value: clinicTitle },
                { key: "JazzCash Number", value: jazzcash },
            ],
        },
        easypaisa: {
            label: "EasyPaisa",
            lines: [
                { key: "Account Title", value: clinicTitle },
                { key: "EasyPaisa Number", value: easypaisa },
            ],
        },
        card: {
            label: "Bank Transfer",
            lines: [
                { key: "Account Title", value: clinicTitle },
                { key: "Account / IBAN", value: bankAccount },
            ],
        },
    };
}

// Fallback slots — only used if admin content hasn't loaded / has no working hours set yet.
const TIME_SLOTS_FALLBACK = {
    Morning: ["09:00 AM", "10:00 AM", "11:00 AM"],
    Evening: ["05:00 PM", "06:00 PM", "07:00 PM"],
};

// "10:00 AM" -> minutes since midnight
function parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let [, h, m, ap] = match;
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    if (ap.toUpperCase() === "PM" && h !== 12) h += 12;
    if (ap.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
}

// minutes since midnight -> "10:00 AM"
function minutesToTimeLabel(mins) {
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ap = h >= 12 ? "PM" : "AM";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}

// Generates slots every `duration` minutes between open & close (last slot must fit before close).
function generateSlots(open, close, duration) {
    const start = parseTimeToMinutes(open);
    const end = parseTimeToMinutes(close);
    if (start == null || end == null || !duration || duration <= 0) return [];
    const slots = [];
    for (let t = start; t + duration <= end; t += duration) {
        slots.push(minutesToTimeLabel(t));
    }
    return slots;
}

const WEEKDAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

// Looks up the admin's working-hours entry for a given JS Date's weekday.
function getDayConfig(date, workingHours) {
    if (!Array.isArray(workingHours)) return null;
    const dayName = WEEKDAY_NAMES[date.getDay()];
    return workingHours.find((d) => d.day === dayName) || null;
}

// Builds { Morning: [...], Evening: [...] } for the selected date using admin's
// workingHours + slotDuration. Returns null if no date/content yet, or a
// { closed: true } shape if the clinic is closed that day.

function getSlotsForDate(dateStr, content) {
    if (!dateStr) return null;

    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    if (!content?.workingHours) {
        return { closed: false, Morning: TIME_SLOTS_FALLBACK.Morning, Evening: TIME_SLOTS_FALLBACK.Evening };
    }

    const dayConfig = getDayConfig(date, content.workingHours);
    if (!dayConfig || dayConfig.closed) {
        return { closed: true, Morning: [], Evening: [] };
    }

    const duration = content.slotDuration || 20;
    const morning =
        dayConfig.morning?.open && dayConfig.morning?.close
            ? generateSlots(dayConfig.morning.open, dayConfig.morning.close, duration)
            : [];
    const evening =
        dayConfig.evening?.open && dayConfig.evening?.close
            ? generateSlots(dayConfig.evening.open, dayConfig.evening.close, duration)
            : [];

    return { closed: false, Morning: morning, Evening: evening };
}

const steps = ["Service", "Basic Info", "Date & Time", "Appointment Type", "Payment", "Confirmation"];

const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const dayFullLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const primaryBtnClasses =
    "inline-flex items-center gap-2 bg-primaryLight text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-primaryLight/30 hover:bg-primary hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed";

const PHONE_REGEX = /^03\d{2}-\d{7}$/;
function formatPhoneNumber(rawValue) {
    const digits = rawValue.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

// Fix: local date -> "YYYY-MM-DD" WITHOUT UTC conversion.
// (selected.toISOString() shifts the date back a day for UTC+5 users like PK.)
function toLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, inMonth: true });
    }
    let trailing = 1;
    while (cells.length % 7 !== 0) {
        cells.push({ day: trailing++, inMonth: false });
    }
    return cells;
}

export default function BookAppointment() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    const [content, setContent] = useState(null);
    const [loadingContent, setLoadingContent] = useState(true);

    // NEW: holds the list of time slots already taken for the currently
    // selected date (only counts confirmed / payment-verified bookings).
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        let cancelled = false;
        async function loadContent() {
            try {
                const res = await fetch("/api/content", { cache: "no-store" });
                const data = await res.json();
                if (!cancelled && data.success) setContent(data.content);
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

    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const [form, setForm] = useState({
        service: "",
        isOtherService: false,
        customServiceName: "",
        appointmentType: "",
        date: "",
        dateLabel: "",
        timeSlot: "",
        name: "",
        phone: "",
        email: "",
        reasonForVisit: "",
        paymentType: "",
        paymentMethod: "",
        transactionRef: "",
    });

    const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

    // NEW: whenever the selected date changes, fetch which slots are
    // already booked (confirmed / payment-verified) for that date.
    useEffect(() => {
        if (!form.date) {
            setBookedSlots([]);
            return;
        }
        let cancelled = false;
        async function loadAvailability() {
            try {
                const res = await fetch(`/api/bookings/availability?date=${form.date}`, {
                    cache: "no-store",
                });
                const data = await res.json();
                if (!cancelled && data.success) setBookedSlots(data.bookedSlots || []);
            } catch (err) {
                console.error("Failed to load slot availability:", err);
            }
        }
        loadAvailability();
        return () => {
            cancelled = true;
        };
    }, [form.date]);

    const paymentInstructions = buildPaymentInstructions(content);
    const whatsappNumber = content?.whatsapp || content?.phone || PAYMENT_FALLBACK.whatsapp;
    const startingFeeDisplay = content?.consultationFee || PAYMENT_FALLBACK.consultationFee;
    const paymentNote = content?.paymentInstructions || PAYMENT_FALLBACK.paymentInstructions;

    // Slots available for whichever date is currently selected (or fallback while content loads / before a date is picked).
    const slotsForSelectedDate = form.date ? getSlotsForDate(form.date, content) : null;

    const isClinicVisit = form.appointmentType === "Clinic Visit";
    const requiresAdvancePayment = !isClinicVisit;
    const isPayingNow = requiresAdvancePayment || form.paymentType === "advance";

    const displayServiceName = form.isOtherService
        ? form.customServiceName || "Other (please specify)"
        : form.service;

    const selectedTypeObj = appointmentTypes.find((t) => t.name === form.appointmentType);
    const consultationFee = selectedTypeObj?.price || 0;

    const isPhoneValid = PHONE_REGEX.test(form.phone);

    const canProceed = () => {
        if (step === 0) {
            if (!form.service) return false;
            if (form.isOtherService) return !!form.customServiceName.trim();
            return true;
        }
        if (step === 1) return !!form.name && isPhoneValid && !!form.email;
        if (step === 2) return !!form.date && !!form.timeSlot;
        if (step === 3) return !!form.appointmentType;
        if (step === 4) {
            if (isClinicVisit && !form.paymentType) return false;
            if (isPayingNow) {
                if (!form.paymentMethod) return false;
                return !!form.transactionRef.trim();
            }
            return true;
        }
        return true;
    };

    const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));

    const handleBack = () => {
        if (step === 0) {
            router.push("/");
        } else {
            setStep((s) => Math.max(s - 1, 0));
        }
    };

    const handleServiceSelect = (s) => {
        if (s.id === "other") {
            update("isOtherService", true);
            update("service", "Other");
        } else {
            update("isOtherService", false);
            update("customServiceName", "");
            update("service", s.name);
        }
    };

    const handlePhoneChange = (e) => {
        update("phone", formatPhoneNumber(e.target.value));
    };

    const handleDateSelect = (day) => {
        const selected = new Date(viewYear, viewMonth, day);
        const iso = toLocalISODate(selected); // fixed: no more UTC shift
        const label = selected.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
        update("date", iso);
        update("dateLabel", label);
        update("timeSlot", "");
    };

    const goToPrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const calendarCells = getCalendarGrid(viewYear, viewMonth);

    const isClosedDay = (day, inMonth) => {
        if (!inMonth || !content?.workingHours) return false;
        const cellDate = new Date(viewYear, viewMonth, day);
        const dayConfig = getDayConfig(cellDate, content.workingHours);
        return !!dayConfig?.closed;
    };

    const isPastDate = (day, inMonth) => {
        if (!inMonth) return true;
        const cellDate = new Date(viewYear, viewMonth, day);
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return cellDate < todayMidnight;
    };

    const isSelectedDate = (day, inMonth) => {
        if (!inMonth || !form.date) return false;
        const cellDate = toLocalISODate(new Date(viewYear, viewMonth, day));
        return cellDate === form.date;
    };

    const isToday = (day, inMonth) => {
        if (!inMonth) return false;
        return (
            day === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear === today.getFullYear()
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const payload = {
                ...form,
                service: displayServiceName,
                amount: consultationFee,
                paymentStatus: isPayingNow ? "pending" : "not_required",
            };
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.message || "Something went wrong.");
                setLoading(false);
                return;
            }

            setConfirmedBooking(data.booking);
            setStep(5);
        } catch (err) {
            setError("Network error. Please try again.");
        }
        setLoading(false);
    };

    return (
        <section className="bg-light min-h-screen py-16 px-6" aria-labelledby="book-appointment-heading">
            <h1 id="book-appointment-heading" className="sr-only">
                Book an Appointment
            </h1>
            <div className="max-w-4xl mx-auto">

                {/* Step Indicator */}
                <div className="mb-10">
                    {/* Mobile: compact progress bar */}
                    <div className="md:hidden">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-primaryLight uppercase tracking-wide">
                                Step {step + 1} of {steps.length}
                            </span>
                            <span className="text-xs font-semibold text-dark/70">
                                {steps[step]}
                            </span>
                        </div>
                        <div
                            className="w-full h-2 bg-primary/10 rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuemin={1}
                            aria-valuemax={steps.length}
                            aria-valuenow={step + 1}
                            aria-label={`Booking progress: step ${step + 1} of ${steps.length}, ${steps[step]}`}
                        >
                            <div
                                className="h-full bg-primaryLight rounded-full transition-all duration-300"
                                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Desktop: full circle stepper */}
                    <ol className="hidden md:flex items-center justify-center gap-3 list-none p-0 m-0">
                        {steps.map((label, i) => (
                            <li key={label} className="flex items-center gap-3">
                                <div
                                    className="flex flex-col items-center gap-2"
                                    aria-current={i === step ? "step" : undefined}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${i <= step
                                            ? "bg-primaryLight text-white"
                                            : "bg-white text-dark/70 border border-primary/10"
                                            }`}
                                        aria-hidden="true"
                                    >
                                        {i + 1}
                                    </div>
                                    <span
                                        className={`text-xs font-semibold ${i <= step ? "text-dark" : "text-dark/70"
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-10 h-0.5 bg-primary/10 mb-5" aria-hidden="true" />
                                )}
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Doctor + Live Summary Strip */}
                <div className="bg-white rounded-3xl shadow-sm border border-primarySoft px-6 py-6 mb-6">
                    <div className="flex items-center gap-5">
                        <img
                            src="/banner-doctor.webp"
                            alt="Dr. Ahsan Malik"
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-dark text-lg">{content?.doctorName || "Dr. Ahsan Malik"}</h3>
                            <p className="text-primary text-sm font-semibold">Consultant Dermatologist</p>
                            <p className="text-dark/75 text-xs mt-0.5">{content?.address || "Main Branch — Gulshan-e-Iqbal, Karachi"}</p>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1.5 bg-white border border-primary/15 text-primary text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-sm">
                            <span aria-hidden="true">✨</span> Consultation starting from Rs. {startingFeeDisplay}
                        </span>
                    </div>

                    {(form.service || form.date || form.appointmentType) && (
                        <div className="mt-5 pt-5 border-t border-primary/10 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {form.service && (
                                <div>
                                    <p className="text-xs text-dark/70 font-semibold uppercase tracking-wide">Service</p>
                                    <p className="text-sm font-semibold text-dark">{displayServiceName}</p>
                                </div>
                            )}
                            {form.date && (
                                <div>
                                    <p className="text-xs text-dark/70 font-semibold uppercase tracking-wide">Date & Time</p>
                                    <p className="text-sm font-semibold text-dark">
                                        {form.dateLabel}{form.timeSlot ? `, ${form.timeSlot}` : ""}
                                    </p>
                                </div>
                            )}
                            {form.appointmentType && (
                                <div>
                                    <p className="text-xs text-dark/70 font-semibold uppercase tracking-wide">Type</p>
                                    <p className="text-sm font-semibold text-dark">{form.appointmentType}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Step Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-primarySoft p-6 md:p-10">

                    {/* STEP 0: Service */}
                    {step === 0 && (
                        <div role="group" aria-labelledby="service-step-heading">
                            <h4 id="service-step-heading" className="font-bold text-dark text-lg mb-5">Select Service</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map((s) => {
                                    const selected = s.id === "other" ? form.isOtherService : form.service === s.name && !form.isOtherService;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleServiceSelect(s)}
                                            aria-pressed={selected}
                                            className={`text-left p-5 rounded-2xl border transition-all ${selected
                                                ? "border-primaryLight ring-2 ring-primaryLight bg-primaryLight/5"
                                                : "border-primary/10 hover:border-primary/30"
                                                }`}
                                        >
                                            <p className="font-bold text-dark">{s.name}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-sm text-dark/70 mt-4">
                                See our{" "}
                                <a href="/services" className="text-primary font-semibold underline">
                                    services page
                                </a>{" "}
                                for detailed pricing — exact treatment cost is confirmed at the clinic.
                            </p>

                            {form.isOtherService && (
                                <div className="mt-5">
                                    <label htmlFor="customServiceName" className="block text-sm font-semibold text-dark mb-2">
                                        Please specify the service you need
                                    </label>
                                    <input
                                        id="customServiceName"
                                        type="text"
                                        value={form.customServiceName}
                                        onChange={(e) => update("customServiceName", e.target.value)}
                                        className="w-full border border-primary/15 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primaryLight/40"
                                        placeholder="e.g. Skin consultation, mole check, etc."
                                    />
                                    <p className="text-xs text-dark/70 mt-2">
                                        We'll confirm the exact pricing with you after reviewing your request.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 1: Basic Info */}
                    {step === 1 && (
                        <div role="group" aria-labelledby="basic-info-heading">
                            <h4 id="basic-info-heading" className="font-bold text-dark text-lg mb-5">Basic Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        className="w-full border border-primary/15 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primaryLight/40"
                                        placeholder="Your full name"
                                        autoComplete="name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-dark mb-2">Phone Number</label>
                                    <input
                                        id="phoneNumber"
                                        type="tel"
                                        inputMode="numeric"
                                        value={form.phone}
                                        onChange={handlePhoneChange}
                                        maxLength={12}
                                        autoComplete="tel"
                                        aria-invalid={form.phone && !isPhoneValid ? "true" : "false"}
                                        aria-describedby={form.phone && !isPhoneValid ? "phone-error" : undefined}
                                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${form.phone && !isPhoneValid
                                            ? "border-red-400 focus:ring-red-300"
                                            : "border-primary/15 focus:ring-primaryLight/40"
                                            }`}
                                        placeholder="03XX-XXXXXXX"
                                    />
                                    {form.phone && !isPhoneValid && (
                                        <p id="phone-error" role="alert" className="text-xs text-red-500 mt-1.5">
                                            Enter a valid number in the format 03XX-XXXXXXX
                                        </p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="emailAddress" className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                                    <input
                                        id="emailAddress"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        className="w-full border border-primary/15 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primaryLight/40"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="reasonForVisit" className="block text-sm font-semibold text-dark mb-2">Reason for Visit (optional)</label>
                                    <textarea
                                        id="reasonForVisit"
                                        value={form.reasonForVisit}
                                        onChange={(e) => update("reasonForVisit", e.target.value)}
                                        rows={4}
                                        className="w-full border border-primary/15 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primaryLight/40 resize-none"
                                        placeholder="Briefly describe your concern..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div role="group" aria-labelledby="date-time-heading">
                            <h4 id="date-time-heading" className="font-bold text-dark text-lg mb-5">Select Date & Time</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                                {/* Calendar card */}
                                <div className="lg:col-span-3 bg-primarySoft/25 rounded-2xl p-5 border border-primary/5">
                                    <div className="flex items-center justify-between mb-5">
                                        <button
                                            type="button"
                                            onClick={goToPrevMonth}
                                            aria-label="Previous month"
                                            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-primary/10 hover:border-primaryLight hover:text-primaryLight text-dark/80 transition shadow-sm"
                                        >
                                            <span aria-hidden="true">‹</span>
                                        </button>
                                        <p className="font-bold text-dark text-base" aria-live="polite">{monthLabel}</p>
                                        <button
                                            type="button"
                                            onClick={goToNextMonth}
                                            aria-label="Next month"
                                            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-primary/10 hover:border-primaryLight hover:text-primaryLight text-dark/80 transition shadow-sm"
                                        >
                                            <span aria-hidden="true">›</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center mb-3" aria-hidden="true">
                                        {dayLabels.map((d) => (
                                            <p key={d} className="text-xs font-bold text-dark/70 tracking-wide">{d}</p>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`Calendar for ${monthLabel}`}>
                                        {calendarCells.map((cell, idx) => {
                                            const past = isPastDate(cell.day, cell.inMonth);
                                            const closedDay = isClosedDay(cell.day, cell.inMonth);
                                            const disabled = past || closedDay;
                                            const selected = isSelectedDate(cell.day, cell.inMonth);
                                            const todayCell = isToday(cell.day, cell.inMonth);
                                            const weekdayName = cell.inMonth ? dayFullLabels[new Date(viewYear, viewMonth, cell.day).getDay()] : "";
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    disabled={disabled}
                                                    tabIndex={cell.inMonth ? 0 : -1}
                                                    title={closedDay && !past ? "Clinic closed" : undefined}
                                                    onClick={() => handleDateSelect(cell.day)}
                                                    aria-label={
                                                        cell.inMonth
                                                            ? `${weekdayName}, ${monthLabel.split(" ")[0]} ${cell.day}${closedDay && !past ? " — clinic closed" : ""}${todayCell ? " — today" : ""}`
                                                            : undefined
                                                    }
                                                    aria-pressed={cell.inMonth ? selected : undefined}
                                                    aria-hidden={!cell.inMonth}
                                                    className={`aspect-square rounded-xl text-sm font-semibold transition-all duration-200 ${!cell.inMonth
                                                        ? "text-dark/15 cursor-default"
                                                        : disabled
                                                            ? "text-dark/20 cursor-not-allowed"
                                                            : selected
                                                                ? "bg-primaryLight text-white shadow-md shadow-primaryLight/40 scale-105"
                                                                : todayCell
                                                                    ? "bg-white text-primaryLight border border-primaryLight/40 hover:bg-primaryLight/10"
                                                                    : "bg-white text-dark hover:bg-primaryLight/10 hover:text-primaryLight border border-transparent"
                                                        }`}
                                                >
                                                    {cell.day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    {!form.date && (
                                        <div className="bg-primarySoft/25 border border-primary/10 rounded-xl px-4 py-6 text-center">
                                            <p className="text-sm text-dark/70">
                                                Pick a date to see available time slots.
                                            </p>
                                        </div>
                                    )}

                                    {form.date && slotsForSelectedDate?.closed && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center" role="alert">
                                            <p className="text-sm text-red-600 font-semibold">
                                                Clinic is closed on {form.dateLabel}.
                                            </p>
                                            <p className="text-xs text-dark/60 mt-1">Please pick another date.</p>
                                        </div>
                                    )}

                                    {form.date && slotsForSelectedDate && !slotsForSelectedDate.closed &&
                                        ["Morning", "Evening"].map((period) => {
                                            const slots = slotsForSelectedDate[period] || [];
                                            if (slots.length === 0) return null;
                                            return (
                                                <div key={period} className="mb-5">
                                                    <div className="flex items-center gap-2 mb-2.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primaryLight" aria-hidden="true" />
                                                        <p className="text-sm font-semibold text-dark/70" id={`${period}-slots-heading`}>{period}</p>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby={`${period}-slots-heading`}>
                                                        {slots.map((slot) => {
                                                            const isBooked = bookedSlots.includes(slot);
                                                            return (
                                                                <button
                                                                    key={slot}
                                                                    type="button"
                                                                    disabled={isBooked}
                                                                    onClick={() => update("timeSlot", slot)}
                                                                    aria-pressed={form.timeSlot === slot}
                                                                    aria-disabled={isBooked}
                                                                    title={isBooked ? "This slot is already booked" : undefined}
                                                                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${isBooked
                                                                        ? "bg-dark/5 text-dark/30 border-dark/5 cursor-not-allowed line-through"
                                                                        : form.timeSlot === slot
                                                                            ? "bg-primaryLight text-white border-primaryLight shadow-md shadow-primaryLight/30"
                                                                            : "bg-white text-dark border-primary/10 hover:border-primaryLight/40 hover:text-primaryLight"
                                                                        }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    {form.dateLabel && form.timeSlot && (
                                        <div className="mt-2 bg-primarySoft/40 border border-primary/10 rounded-xl px-4 py-3" aria-live="polite">
                                            <p className="text-xs text-dark/70 font-semibold uppercase tracking-wide mb-1">Selected</p>
                                            <p className="text-sm font-semibold text-dark">{form.dateLabel}, {form.timeSlot}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Appointment Type */}
                    {step === 3 && (
                        <div role="group" aria-labelledby="appointment-type-heading">
                            <h4 id="appointment-type-heading" className="font-bold text-dark text-lg mb-5">Select Appointment Type</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {appointmentTypes.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                            update("appointmentType", t.name);
                                            update("paymentType", "");
                                        }}
                                        aria-pressed={form.appointmentType === t.name}
                                        className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all ${form.appointmentType === t.name
                                            ? "border-primaryLight ring-2 ring-primaryLight bg-primaryLight/5"
                                            : "border-primary/10 hover:border-primary/30"
                                            }`}
                                    >
                                        <span className="text-2xl" aria-hidden="true">{t.icon}</span>
                                        <p className="font-semibold text-dark text-sm text-center">{t.name}</p>
                                        <p className="text-xs text-dark/75">Rs. {t.price.toLocaleString()}</p>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-dark/70 mt-4">
                                This is the consultation fee for your session. Any further treatment cost is discussed separately.
                            </p>
                        </div>
                    )}

                    {/* STEP 4: Payment */}
                    {step === 4 && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3" role="group" aria-labelledby="payment-heading">
                                <h4 id="payment-heading" className="font-bold text-dark text-lg mb-5">Payment</h4>

                                {isClinicVisit && (
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-dark mb-3">How would you like to pay?</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => update("paymentType", "cash")}
                                                aria-pressed={form.paymentType === "cash"}
                                                className={`text-left p-4 rounded-2xl border transition-all ${form.paymentType === "cash"
                                                    ? "border-primaryLight ring-2 ring-primaryLight bg-primaryLight/5"
                                                    : "border-primary/10 hover:border-primary/30"
                                                    }`}
                                            >
                                                <p className="font-bold text-dark text-sm"><span aria-hidden="true">💵</span> Pay at Clinic</p>
                                                <p className="text-dark/75 text-xs mt-1">Cash on arrival</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => update("paymentType", "advance")}
                                                aria-pressed={form.paymentType === "advance"}
                                                className={`text-left p-4 rounded-2xl border transition-all ${form.paymentType === "advance"
                                                    ? "border-primaryLight ring-2 ring-primaryLight bg-primaryLight/5"
                                                    : "border-primary/10 hover:border-primary/30"
                                                    }`}
                                            >
                                                <p className="font-bold text-dark text-sm"><span aria-hidden="true">💳</span> Pay Advance</p>
                                                <p className="text-dark/75 text-xs mt-1">Secure your slot now</p>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!isClinicVisit && (
                                    <p className="text-sm text-dark/80 mb-6">
                                        Advance payment is required to confirm {form.appointmentType.toLowerCase()} appointments.
                                    </p>
                                )}

                                {isPayingNow && (
                                    <>
                                        <p className="text-sm font-semibold text-dark mb-3" id="payment-method-heading">Select Payment Method</p>
                                        <div className="grid grid-cols-3 gap-3 mb-6" role="group" aria-labelledby="payment-method-heading">
                                            {paymentMethods.map((m) => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    onClick={() => update("paymentMethod", m.id)}
                                                    aria-pressed={form.paymentMethod === m.id}
                                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all ${form.paymentMethod === m.id
                                                        ? "border-primaryLight ring-2 ring-primaryLight bg-primaryLight/5"
                                                        : "border-primary/10 hover:border-primary/30"
                                                        }`}
                                                >
                                                    <span className="text-xl" aria-hidden="true">{m.icon}</span>
                                                    <span className="text-center text-dark">{m.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Transfer Instructions */}
                                        {form.paymentMethod && (
                                            <div className="bg-primarySoft/40 border border-primary/10 rounded-2xl p-5 mb-5">
                                                <p className="text-sm font-bold text-dark mb-3">
                                                    Transfer Rs. {consultationFee.toLocaleString()} to:
                                                </p>
                                                <div className="space-y-1 text-sm">
                                                    {paymentInstructions[form.paymentMethod].lines.map((line) => (
                                                        <p key={line.key} className="text-dark/75">
                                                            {line.key}: <span className="font-semibold text-dark">{line.value}</span>
                                                        </p>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-dark/60 mt-3">
                                                    {paymentNote}
                                                </p>
                                            </div>
                                        )}

                                        {/* Transaction Reference Input */}
                                        {form.paymentMethod && (
                                            <div>
                                                <label htmlFor="transactionRef" className="block text-sm font-semibold text-dark mb-2">
                                                    Transaction ID / Reference Number
                                                </label>
                                                <input
                                                    id="transactionRef"
                                                    type="text"
                                                    value={form.transactionRef}
                                                    onChange={(e) => update("transactionRef", e.target.value)}
                                                    className="w-full border border-primary/15 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primaryLight/40"
                                                    placeholder="e.g. TXN123456789"
                                                    aria-describedby="transaction-ref-hint"
                                                />
                                                <p id="transaction-ref-hint" className="text-xs text-dark/60 mt-2">
                                                    This helps us verify your payment quickly. Your booking will be confirmed once verified.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Booking Summary Sidebar */}
                            <div className="lg:col-span-2">
                                <div className="bg-primarySoft/40 border border-primary/10 rounded-2xl p-6" aria-label="Booking summary">
                                    <p className="font-bold text-dark mb-4">Booking Info</p>
                                    <div className="space-y-2 text-sm mb-4">
                                        <p className="text-dark/75">Service</p>
                                        <p className="font-semibold text-dark">{displayServiceName}</p>
                                        <p className="text-xs text-dark/70">Exact charges confirmed at the clinic</p>
                                    </div>
                                    <div className="space-y-2 text-sm mb-4">
                                        <p className="text-dark/75">Appointment Type</p>
                                        <p className="font-semibold text-dark">{form.appointmentType}</p>
                                    </div>
                                    <div className="space-y-2 text-sm mb-4">
                                        <p className="text-dark/75">Date & Time</p>
                                        <p className="font-semibold text-dark">{form.dateLabel}, {form.timeSlot}</p>
                                    </div>
                                    <div className="border-t border-primary/10 pt-4 mt-4 flex items-center justify-between">
                                        <span className="font-bold text-dark">Consultation Fee</span>
                                        <span className="font-bold text-primary text-lg">
                                            Rs. {consultationFee.toLocaleString()}
                                        </span>
                                    </div>
                                    {isClinicVisit && form.paymentType === "cash" && (
                                        <p className="text-xs text-dark/75 mt-3">Payable in cash at the clinic.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Confirmation */}
                    {step === 5 && confirmedBooking && (
                        <div className="text-center py-8 max-w-md mx-auto" role="status">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl" aria-hidden="true">✅</span>
                            </div>
                            <h4 className="font-extrabold text-dark text-2xl mb-2">Booking Confirmed!</h4>
                            <p className="text-dark/70 text-sm mb-8">
                                Details sent to <span className="font-semibold text-dark">{form.email}</span>
                            </p>

                            {/* Single unified card */}
                            <div className="bg-primarySoft/30 border border-primary/10 rounded-2xl px-6 py-6 text-left mb-6">
                                <div className="flex items-center justify-between pb-4 mb-4 border-b border-primary/10">
                                    <span className="text-xs uppercase tracking-wide text-dark/60 font-semibold">Booking number</span>
                                    <span className="font-mono font-bold text-primary text-base">{confirmedBooking.bookingNumber}</span>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-dark/60">Service</span>
                                        <span className="font-semibold text-dark text-right">{displayServiceName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-dark/60">Type</span>
                                        <span className="font-semibold text-dark text-right">{form.appointmentType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-dark/60">Date & time</span>
                                        <span className="font-semibold text-dark text-right">{form.dateLabel}, {form.timeSlot}</span>
                                    </div>
                                </div>

                                <div className="border-t border-primary/10 mt-4 pt-4 flex items-center justify-between">
                                    <span className="font-bold text-dark text-sm">Consultation fee</span>
                                    <span className="font-bold text-primary text-lg text-right">
                                        Rs. {consultationFee.toLocaleString()}
                                        {form.paymentType === "cash" && (
                                            <span className="block text-xs font-normal text-dark/60">Cash at clinic</span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {isPayingNow && form.paymentType !== "cash" && (
                                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-left">
                                    <span aria-hidden="true">⏳</span> Your payment is under verification. You'll receive a confirmation on WhatsApp/Email once verified.
                                </p>
                            )}

                            {!isClinicVisit && (
                                <p className="text-sm text-dark/70 mb-8">
                                    Our team will reach out on WhatsApp at{" "}
                                    <span className="font-semibold text-dark">{form.timeSlot}</span> on{" "}
                                    <span className="font-semibold text-dark">{form.dateLabel}</span>. Questions? Message us at{" "}
                                    <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`} className="font-semibold text-primary underline">
                                        {content?.whatsapp || content?.phone || "+92-300-1234567"}
                                    </a>
                                </p>
                            )}

                            <a
                                href="/"
                                className="inline-flex items-center gap-2 bg-primaryLight text-white font-semibold px-6 py-3 rounded-full hover:bg-primary transition"
                            >
                                Back to Home
                            </a>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm mt-4 font-medium" role="alert">{error}</p>
                    )}

                    {/* Navigation Buttons */}
                    {step < 5 && (
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-primary/10">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full hover:bg-dark/80 transition"
                            >
                                <span aria-hidden="true">←</span> Back
                            </button>

                            {step < 4 ? (
                                <button type="button" onClick={next} disabled={!canProceed()} className={primaryBtnClasses}>
                                    Next <span aria-hidden="true">→</span>
                                </button>
                            ) : (
                                <button type="button" onClick={handleSubmit} disabled={!canProceed() || loading} className={primaryBtnClasses}>
                                    {loading ? "Booking..." : isPayingNow ? "Submit Booking" : "Confirm Booking"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}