"use client";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold group">
          <span className="text-primary group-hover:text-primaryDark transition">
            Dr. Ahsan
          </span>{" "}
          <span className="text-accent group-hover:text-accentDark transition">
            Malik
          </span>
        </a>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-8 text-dark font-medium">
          <a href="/" className="hover:text-primary transition">
            Home
          </a>
          <a href="#about" className="hover:text-primary transition">
            About
          </a>
          <a href="/services" className="hover:text-primary transition">
            Services
          </a>
          <a href="/blog" className="hover:text-primary transition">
            Blog
          </a>
          <a href="/contact" className="hover:text-primary transition">
            Contact
          </a>
        </nav>

        {/* Book Appointment button - desktop */}
        <a
          href="/book"
          className="hidden md:inline-block bg-accent text-white font-semibold px-5 py-2.5 rounded-full hover:bg-accentDark hover:text-white transition"
        >
          Book Appointment
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
          <a
            href="/book"
            className="bg-accent text-white font-semibold px-5 py-2.5 rounded-full text-center hover:bg-accentDark hover:text-primary transition"
          >
            Book Appointment
          </a>
        </div>
      )}
    </header>
  );
}