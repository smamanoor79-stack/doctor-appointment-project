"use client";
import { useState } from "react";

function BeforeAfterCard({ beforeImg, afterImg, label }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="w-full">
      <div className="relative w-full h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-xl select-none group">
        <img
          src={afterImg}
          alt={`${label} - after`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeImg}
            alt={`${label} - before`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-white shadow-md pointer-events-none"
          style={{ left: `calc(${position}% - 1.5px)` }}
        />

        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-primary pointer-events-none z-20 transition-transform duration-200 group-hover:scale-110"
          style={{ left: `calc(${position}% - 22px)` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
          </svg>
        </div>

        {/* Invisible range input driving the drag */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-30"
          aria-label={`Before and after comparison slider for ${label}`}
        />

        {/* Labels */}
        <span className="absolute bottom-4 left-4 bg-dark/75 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 pointer-events-none">
          Before
        </span>
        <span className="absolute bottom-4 right-4 bg-accent text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 pointer-events-none">
          After
        </span>
      </div>

      <p className="text-center font-bold text-dark mt-4 text-lg">{label}</p>
    </div>
  );
}

export default function TransformationSection() {
  return (
    <section className="bg-light py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <div className="inline-flex items-center bg-white text-primary font-extrabold px-6 py-2 rounded-full text-sm uppercase tracking-widest mb-4 shadow-sm">
          ✨ Real Results
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-5 tracking-tight">
          Real Results,{" "}
          <span className="text-accent underline decoration-accent/50">
            Real Confidence
          </span>
        </h2>

        <p className="text-base md:text-lg text-dark/70 max-w-2xl mx-auto leading-relaxed">
          Drag the slider to see the difference for yourself. Every transformation
          reflects a personalized treatment plan built around your skin&apos;s unique needs.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <BeforeAfterCard
          beforeImg="/before1.jpeg"
          afterImg="/after1.jpeg"
          label="Acne Scar Treatment"
        />
        <BeforeAfterCard
          beforeImg="/before2.jpeg"
          afterImg="/after2.jpeg"
          label="Skin Rejuvenation"
        />
      </div>

    </section>
  );
}