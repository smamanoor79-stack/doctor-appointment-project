"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Stethoscope,
  Wallet,
  FileText,
  Settings,
  MessageSquare,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const token = {
  forest: "#16302A",
  forestSoft: "#234339",
  cream: "#F7F4EE",
  coral: "#DD6B3E",
};

const navItems = [
  { icon: LayoutGrid, label: "Overview", href: "/admin" },
  { icon: CalendarDays, label: "Appointments", href: "/admin/appointments" },
  { icon: Users, label: "Patients", href: "/admin/patients" },
  { icon: Wallet, label: "Payments", href: "/admin/payments" },
  { icon: Stethoscope, label: "Services", href: "/admin/services" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: FileText, label: "Settings", href: "/admin/settings" },
];

const LAST_SEEN_KEY = "derma_last_seen_bookings_at";
const POLL_INTERVAL_MS = 30000;

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [newAppointmentsCount, setNewAppointmentsCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadUnseenCount() {
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem(LAST_SEEN_KEY) : null;
        const lastSeen = stored ? new Date(stored) : new Date(0);
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (cancelled || !data.success) return;
        const count = (data.bookings || []).filter(
          (b) => !b.archived && b.createdAt && new Date(b.createdAt) > lastSeen
        ).length;
        if (!cancelled) setNewAppointmentsCount(count);
      } catch {
        // Silent fail — badge just skips this refresh cycle.
      }
    }

    loadUnseenCount();
    const interval = setInterval(loadUnseenCount, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (err) {
      setLoggingOut(false);
    }
  }

  const sidebarContent = (
    <>
      <div>
        <div className="px-2 mb-8 flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-xl text-white leading-tight">
              Dr. Ahsan <span style={{ color: token.coral }}>Malik</span>
            </p>
            <p className="text-[11px] tracking-wide uppercase mt-1 font-semibold" style={{ color: "#B9CBBF" }}>
              Clinic Dashboard
            </p>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: token.forestSoft }}
          >
            <X size={16} color="#EAF0EC" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            const showBadge = href === "/admin/appointments" && newAppointmentsCount > 0;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left"
                style={{
                  background: isActive ? token.coral : "transparent",
                  color: isActive ? token.forest : "#EAF0EC",
                  fontWeight: isActive ? 700 : 600,
                }}
              >
                <Icon size={17} strokeWidth={2} />
                <span className="flex-1">{label}</span>
                {showBadge && (
                  <span
                    className="text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isActive ? token.forest : token.coral,
                      color: isActive ? token.coral : token.forest,
                    }}
                  >
                    {newAppointmentsCount > 9 ? "9+" : newAppointmentsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl p-4" style={{ background: token.forestSoft }}>
          <p className="text-xs leading-relaxed" style={{ color: "#C7D4CC" }}>
            Need to review pending payments?
          </p>
          <Link
            href="/admin/payments"
            onClick={() => setMobileNavOpen(false)}
            className="mt-3 text-xs font-semibold flex items-center gap-1"
            style={{ color: token.coral }}
          >
            Review queue <ChevronRight size={14} />
          </Link>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm text-black hover:text-white transition-all disabled:opacity-50 hover:brightness-95 active:scale-[0.98]"
          style={{ fontWeight: 700, background: token.coral }}
        >
          <LogOut size={16} strokeWidth={2.5} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: token.cream, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Mobile top bar with hamburger — only visible below md */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: token.forest }}
      >
        <p className="font-display font-semibold text-lg text-white leading-tight">
          Dr. Ahsan <span style={{ color: token.coral }}>Malik</span>
        </p>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: token.forestSoft }}
        >
          <Menu size={18} color="#EAF0EC" />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile slide-in drawer */}
      <aside
        className="md:hidden fixed top-0 left-0 z-50 w-64 h-screen flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out"
        style={{
          background: token.forest,
          transform: mobileNavOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar — unchanged, always visible from md up */}
      <aside
        className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 px-4 sticky top-0 h-screen overflow-y-auto"
        style={{ background: token.forest }}
      >
        {sidebarContent}
      </aside>

      {/* Page content renders here. Top padding on mobile clears the fixed top bar. */}
      <div className="flex-1 min-w-0 pt-14 md:pt-0">{children}</div>
    </div>
  );
}