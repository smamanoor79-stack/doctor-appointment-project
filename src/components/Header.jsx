"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href.split("#")[0]) && href !== "/";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold group focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded">
          <span className="text-primary group-hover:text-primaryDark transition">
            Dr. Ahsan
          </span>{" "}
          <span className="text-accent group-hover:text-accentDark transition">
            Malik
          </span>
        </a>

        {/* Nav links - desktop */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-dark font-medium">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="hover:text-primary focus-visible:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Book Appointment button - desktop */}
        <a
          href="/book"
          className="hidden md:inline-block bg-accent text-white font-semibold px-5 py-2.5 rounded-full hover:bg-accentDark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark transition"
        >
          Book Appointment
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-6 h-6 text-dark"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="md:hidden px-6 pb-4 flex flex-col gap-4"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="bg-accent text-white font-semibold px-5 py-2.5 rounded-full text-center hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark transition"
          >
            Book Appointment
          </a>
        </nav>
      )}
    </header>
  );
}