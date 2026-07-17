"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="bg-light py-20 px-6 relative overflow-hidden">
      
      {/* ─── DECORATIVE BACKGROUND ELEMENTS ─── */}
      {/* Top Left Sparkle */}
      <div className="absolute top-12 left-[8%] text-accent/20 animate-pulse hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
          <path d="M19 8.5L18.5 11L18 8.5L15.5 8L18 7.5L18.5 5L19 7.5L21.5 8L19 8.5Z" />
        </svg>
      </div>

      {/* Bottom Right Sparkle Group */}
      <div className="absolute bottom-10 right-[6%] text-primary/15 hidden lg:block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
        </svg>
      </div>

      {/* Lotion Bottle Badge - matches hero section */}
      <div className="hidden md:flex absolute bottom-8 left-[6%] w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl items-center justify-center shadow-lg text-3xl lg:text-4xl rotate-[-8deg] z-20">
        🧴
      </div>

      {/* ─── MAIN CARD CONTAINER ─── */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-14 lg:p-16 shadow-sm border border-primarySoft/30 flex flex-col lg:flex-row items-center justify-between gap-10 relative">
        
        {/* Card Internal Decorative Element (Right Side Floating Sparks) */}
        <div className="absolute right-6 top-6 text-accent/10 hidden sm:block">
          <svg width="68" height="68" viewBox="0 0 68 68" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 0L24.5 16.5L41 19L24.5 21.5L22 38L19.5 21.5L3 19L19.5 16.5L22 0Z" />
            <path d="M52 36L53.5 46.5L64 48L53.5 49.5L52 60L50.5 49.5L40 48L50.5 46.5L52 36Z" />
          </svg>
        </div>

        {/* LEFT SIDE: Content */}
        <div className="text-center lg:text-left max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-primary font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-4 border border-primarySoft/50">
            ✨ Stay Updated
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-4">
            Subscribe Our <span className="text-accent">Newsletter</span>
          </h2>
          <p className="text-dark/60 text-sm md:text-base leading-relaxed">
            Join our community to receive weekly expert skincare tips, exclusive treatment offers, and professional updates directly in your inbox.
          </p>
        </div>

        {/* RIGHT SIDE: Input Form */}
        <div className="w-full max-w-md relative z-10">
          <form 
            onSubmit={handleSubscribe} 
            className="relative flex items-center bg-primarySoft/30 p-2 rounded-full border border-primarySoft/50 focus-within:ring-2 focus-within:ring-accent/40 focus-within:bg-white transition-all duration-300 shadow-inner"
          >
            <input
              type="email"
              required
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent pl-5 pr-16 py-3.5 text-dark placeholder-dark/40 font-medium text-sm md:text-base outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-accentDark transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6.75 6.75-6.75 6.75M4.5 12h15" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}