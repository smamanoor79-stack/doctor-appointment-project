"use client";
import { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      q: "How do I know which skincare treatment is right for me?",
      a: "During your first consultation, Dr. Ahsan Malik will assess your skin type, concerns, and goals to recommend a personalized treatment plan that's right for you.",
    },
    {
      q: "Are skincare treatments safe for sensitive skin?",
      a: "Yes, all our treatments are tailored to your skin's sensitivity level. We always start with a patch test and adjust intensity to ensure comfort and safety.",
    },
    {
      q: "How many sessions are needed to see results?",
      a: "This varies by treatment and skin condition, but most patients start noticing visible improvement within 3 to 5 sessions, with full results building over time.",
    },
    {
      q: "Do I need a consultation before booking a treatment?",
      a: "We recommend an initial consultation so we can understand your skin concerns properly and design a treatment plan suited specifically to you.",
    },
    {
      q: "Are your skincare specialists certified professionals?",
      a: "Absolutely. Dr. Ahsan Malik is a board-certified dermatologist, and our entire team is trained and experienced in the latest dermatological techniques.",
    },
    {
      q: "Is there any downtime after skincare treatments?",
      a: "Most of our treatments have little to no downtime, so you can return to your daily routine right away. We'll always let you know beforehand if any aftercare is needed.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative bg-primarySoft py-20 px-6 overflow-hidden">

      <span aria-hidden="true" className="hidden md:block absolute top-20 left-10 text-2xl opacity-25 select-none">✨</span>
      <span aria-hidden="true" className="hidden md:block absolute top-48 left-28 text-xl opacity-15 select-none">✨</span>
      <span aria-hidden="true" className="hidden md:block absolute bottom-32 left-16 text-2xl opacity-15 select-none">✨</span>
      <span aria-hidden="true" className="hidden md:block absolute top-16 right-16 text-xl opacity-20 select-none">✨</span>
      <span aria-hidden="true" className="hidden md:block absolute bottom-40 right-24 text-lg opacity-15 select-none">✨</span>

      <div className="max-w-8xl mx-auto text-center mb-16 relative flex flex-col items-center">
        <div className="inline-flex items-center bg-white text-primary font-semibold px-4 py-1.5 rounded-full text-m uppercase tracking-wider w-fit mb-5 shadow-sm">
          <span aria-hidden="true">✨</span> FAQs
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Frequently Asked <span className="text-accent ">Questions</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

        {/* LEFT: Help card + contact box */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-5">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-dark mb-3">
              We&apos;re here to help with all your skincare concerns.
            </h3>
            <p className="text-sm text-dark/60 mb-6 leading-relaxed">
              Our team will respond quickly with the best advice for your skin.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition"
            >
              Contact Us
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>

          <div className="bg-primary rounded-3xl p-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-xs uppercase tracking-wider font-semibold mb-1">
                General Inquiries
              </p>
              <a
                href="mailto:info@drahsanmalik.com"
                className="text-white font-bold text-lg hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded transition-colors"
              >
                info@drahsanmalik.com
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Accordion FAQ list */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const panelId = `faq-panel-${index}`;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl px-6 py-5 shadow-sm transition-all duration-300 ${
                  isOpen ? "ring-2 ring-accent" : ""
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={questionId}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
                  >
                    <span className="font-bold text-dark text-base md:text-lg">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isOpen ? "bg-accent text-white" : "bg-teal-50 text-primary"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={questionId}
                  hidden={!isOpen}
                >
                  <p className="text-dark/70 text-sm md:text-base leading-relaxed mt-4">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}