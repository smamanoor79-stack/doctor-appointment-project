export default function WhyUs() {
  return (
    <section className="bg-primarySoft py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-14 md:gap-16">

        <div className="relative flex-shrink-0 w-full md:w-[42%] min-h-[420px] md:min-h-[560px]">
          {/* decorative dot */}
          <span className="absolute -top-2 right-[10%] w-3.5 h-3.5 rounded-full bg-accent"></span>

          <div className="absolute top-0 left-0 w-[78%] h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
            <img
              src="/whyus1.webp"
              alt="Dermatology clinic care"
              className="w-full h-full object-cover"
            />
          </div>

          {/* small overlapping image */}
          <div className="absolute bottom-0 right-0 w-[55%] h-[240px] md:h-[300px] rounded-2xl overflow-hidden border-4 md:border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
            <img
              src="/whyus2.webp"
              alt="Skin treatment closeup"
              className="w-full h-full object-cover"
            />
          </div>

          {/* experience badge */}
          <div className="absolute top-6 left-[60%] w-[150px] py-8 px-4 rounded-2xl bg-white text-center shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10">
            <span className="block text-4xl font-extrabold text-accent leading-none mb-2">
              10+
            </span>
            <span className="text-sm font-medium leading-tight tracking-wide text-primary">
              Years of<br />Experience
            </span>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 bg-white text-primary text-s font-semibold tracking-wide uppercase px-4 py-2 rounded-full mb-4 shadow-sm">
            ✨ Why Choose Us
          </span>

          <h2 className="text-3xl md:text-[42px] font-extrabold leading-tight text-primary mb-5">
            Trusted Care for{" "}
            <span className="text-accentDark">Healthy, Radiant Skin</span>
          </h2>

          <p className="text-base leading-relaxed text-dark/70 max-w-xl mb-8">
            Your skin deserves expert attention, honesty, and comfort. At Dr. Ahsan Malik&apos;s
            Clinic, we combine medical expertise with modern technology to give every patient a
            personalized path to healthier skin.
          </p>

          <div className="flex flex-col gap-3.5">
            {[
              "Board-Certified Dermatologist",
              "Advanced Laser & Skin Technology",
              "Personalized Treatment Plans",
              "Safe, Hygienic & Comfortable Clinic",
              "Honest, Patient-First Approach",
            ].map((point) => (
              <div
                key={point}
                className="flex items-center gap-4 bg-white border border-primary/10 px-5 py-4 rounded-2xl transition-all duration-300 hover:bg-accent/10 hover:border-accent hover:translate-x-1.5"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-[15.5px] font-semibold text-dark">{point}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}