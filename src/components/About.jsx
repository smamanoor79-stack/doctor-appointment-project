"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState('mission');

  const tabContent = {
    mission: {
      title: "Our Mission",
      text: "Our mission is to provide exceptional, evidence-based dermatological care through personalized treatment plans. We are dedicated to restoring your skin's health and boosting your confidence using advanced, clinically proven medical technology.",
      bg: "bg-orange-50 border-l-4 border-accent text-dark"
    },
    vision: {
      title: "Our Vision",
      text: "To be the leading center of excellence in skin health, recognized for pioneering treatments, ethical practices, and an unwavering commitment to patient education and long-term skin wellness.",
      bg: "bg-white border-l-4 border-primary text-dark"
    }
  };

  return (
    <section id="about" className="bg-primarySoft py-20 px-6 overflow-hidden" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <div className="lg:col-span-5 flex justify-center relative">
          <div className="absolute inset-0 max-w-[400px] max-h-[400px] md:max-w-[450px] md:max-h-[450px] border-4 border-dashed border-accent/50 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" aria-hidden="true" />
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-primary/30 rounded-tl-[40px] pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-accent rounded-br-[40px] pointer-events-none" aria-hidden="true" />

          {/* Main Round Image Container */}
          <div className="w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border-8 border-white/90 shadow-xl relative z-10">
            <Image
              src="/aboutpic.webp"
              alt="Dermatologist examining a patient's skin during a consultation at Dr. Ahsan Malik's clinic"
              width={420}
              height={420}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Floating Play Video Badge */}
          <a
            href="https://www.youtube.com/watch?v=Fst8f4_o15Y"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch our clinic tour video (opens in a new tab)"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 z-20 bg-white p-2 rounded-full shadow-lg flex items-center gap-3 cursor-pointer hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 ml-1" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="pr-4 hidden md:block">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Watch Video</p>
              <p className="text-sm font-bold text-dark">Our Clinic Tour</p>
            </div>
          </a>
        </div>

        {/* Right Side: Content & Interactive Tabs */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center bg-white text-primary font-semibold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider w-fit mb-5 shadow-sm">
            <span aria-hidden="true">&#10024;</span>&nbsp;About Our Clinic
          </div>

          {/* Heading */}
          <h2 id="about-heading" className="text-4xl md:text-5xl font-extrabold text-primary leading-[1.15] mb-6">
            Our Journey of <span className="text-accentDark">Expert</span> Dermatological Care
          </h2>

          {/* Paragraph */}
          <p className="text-base md:text-lg text-dark/70 mb-8 leading-relaxed">
            At Dr. Ahsan Malik's Clinic, we blend medical expertise with cutting-edge technology to offer comprehensive skincare solutions. Whether addressing clinical concerns like acne and eczema, or advanced aesthetic rejuvenation, our team ensures your skin gets premium attention.
          </p>

          {/* Interactive Dynamic Tabs Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            <div
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className={`md:col-span-8 p-6 rounded-2xl transition-all duration-300 shadow-sm ${tabContent[activeTab].bg}`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span aria-hidden="true">{activeTab === 'mission' ? '\u{1F3AF}' : '\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F'}</span>
                {tabContent[activeTab].title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed opacity-90">
                {tabContent[activeTab].text}
              </p>
            </div>

            {/* Tab Toggles (Right side of grid) */}
            <div className="md:col-span-4 flex md:flex-col gap-3" role="tablist" aria-label="About us tabs">
              <button
                type="button"
                id="tab-mission"
                role="tab"
                aria-selected={activeTab === 'mission'}
                aria-controls="panel-mission"
                onClick={() => setActiveTab('mission')}
                className={`flex-1 py-4 px-5 rounded-xl font-bold text-sm md:text-base transition-all duration-200 text-center md:text-left bg-accent text-white shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  activeTab === 'mission'
                    ? 'shadow-accent/40 ring-2 ring-primary ring-offset-2 ring-offset-primarySoft'
                    : 'shadow-accent/20 opacity-80 hover:opacity-100'
                }`}
              >
                Our Mission
              </button>
              <button
                type="button"
                id="tab-vision"
                role="tab"
                aria-selected={activeTab === 'vision'}
                aria-controls="panel-vision"
                onClick={() => setActiveTab('vision')}
                className={`flex-1 py-4 px-5 rounded-xl font-bold text-sm md:text-base transition-all duration-200 text-center md:text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  activeTab === 'vision'
                    ? 'bg-white text-primary shadow-md shadow-black/30 ring-2 ring-accent'
                    : 'bg-white text-primary shadow-md shadow-black/10'
                }`}
              >
                Our Vision
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}