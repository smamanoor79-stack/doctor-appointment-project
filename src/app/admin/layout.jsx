"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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

      <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 px-4 sticky top-0 h-screen overflow-y-auto" style={{ background: token.forest }}>
        <div>
          <div className="px-2 mb-8">
            <p className="font-display font-semibold text-xl text-white leading-tight">
              Dr. Ahsan <span style={{ color: token.coral }}>Malik</span>
            </p>
            <p className="text-[11px] tracking-wide uppercase mt-1 font-semibold" style={{ color: "#B9CBBF" }}>
              Clinic Dashboard
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ icon: Icon, label, href }) => {
              const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left"
                  style={{
                    background: isActive ? token.coral : "transparent",
                    color: isActive ? token.forest : "#EAF0EC",
                    fontWeight: isActive ? 700 : 600,
                  }}
                >
                  <Icon size={17} strokeWidth={2} />
                  {label}
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
      </aside>

      {/* Page content renders here */}
      <div className="flex-1">{children}</div>
    </div>
  );
}