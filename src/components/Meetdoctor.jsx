export default function MeetDoctor() {
  return (
    <section className="relative -mt-px bg-light pt-28 pb-20 px-6 md:px-16 overflow-hidden">

      <div className="absolute top-10 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl z-0"></div>

     
      <span className="hidden md:block absolute top-20 left-10 text-2xl opacity-25 select-none">✨</span>
      <span className="hidden md:block absolute top-48 left-28 text-xl opacity-15 select-none">✨</span>
      <span className="hidden md:block absolute bottom-32 left-16 text-2xl opacity-15 select-none">✨</span>
      <span className="hidden md:block absolute top-16 right-16 text-xl opacity-20 select-none">✨</span>
      <span className="hidden md:block absolute bottom-40 right-24 text-lg opacity-15 select-none">✨</span>
      <span className="hidden md:block absolute top-1/2 right-6 text-2xl opacity-10 select-none">✨</span>

      <div className="hidden md:flex absolute top-24 right-[8%] w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl items-center justify-center shadow-lg text-3xl lg:text-4xl rotate-[8deg] z-10">
        🩺
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* eyebrow */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="inline-flex items-center bg-white text-primary font-semibold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider w-fit mb-5 shadow-sm">
            ✨ Get to Know Me
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-dark leading-tight">
            The Face Behind <span className="text-accent">Your Care</span>
          </h2>
        </div>

        {/* Doctor identity card */}
        <div className="relative bg-white rounded-4xl shadow-[0_20px_50px_rgba(26,77,66,0.1)] border border-primarySoft px-6 md:px-12 py-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-8 overflow-hidden">

          {/* subtle corner accent inside card */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl"></div>

          {/* photo with ring accent */}
          <div className="relative shrink-0">
            <div className="absolute -inset-2 rounded-full border-2 border-dashed border-accent/40"></div>
            <img
              src="/banner-doctor.svg"
              alt="Dr. Ahsan Malik"
              className="relative w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 bg-accent text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md">
              ⭐ 4.9
            </span>
          </div>

          {/* info */}
          <div className="relative text-center md:text-left flex-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-dark mb-1">
              Dr. Ahsan Malik
            </h3>
            <p className="text-primary font-semibold mb-3">Consultant Dermatologist</p>
            <p className="text-dark/60 text-sm flex items-center justify-center md:justify-start gap-1.5 mb-6">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0">
                <path d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z" stroke="#1A4D42" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="2.5" stroke="#1A4D42" strokeWidth="1.5" />
              </svg>
              Main Branch — Gulshan-e-Iqbal, Karachi
            </p>
            <p className="text-dark/60 leading-relaxed max-w-lg mb-6">
              A board-certified dermatologist with over 10 years of experience helping patients
              achieve healthier, more confident skin — with care that&apos;s personal, honest,
              and backed by science.
            </p>

            {/* CTA button - outline style, distinct from both accent and green cards */}
            <div className="flex justify-center md:justify-start">
              <a
                href="/book"
                className="inline-flex items-center gap-2 bg-light text-primary font-semibold px-6 py-3 rounded-full border-2 border-primary hover:bg-accent hover:text-white transition hover:border-accent text-sm md:text-base"
              >
                Meet Your Doctor
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* stats strip - gradient shaded cards */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12">
          <div className="relative overflow-hidden bg-linear-to-br from-primary to-primaryPale rounded-2xl py-6 px-4 text-center shadow-[0_10px_25px_rgba(26,77,66,0.25)] hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <span className="relative block text-2xl md:text-3xl font-extrabold text-white mb-1">10+</span>
            <span className="relative text-xs md:text-sm text-white/80">Years Experience</span>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-accent to-accentDark rounded-2xl py-6 px-4 text-center shadow-[0_10px_25px_rgba(232,146,124,0.3)] hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-xl"></div>
            <span className="relative block text-2xl md:text-3xl font-extrabold text-white mb-1">5000+</span>
            <span className="relative text-xs md:text-sm text-white/90">Patients Treated</span>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-primary to-primaryPale rounded-2xl py-6 px-4 text-center shadow-[0_10px_25px_rgba(26,77,66,0.25)] hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <span className="relative block text-2xl md:text-3xl font-extrabold text-white mb-1">MBBS</span>
            <span className="relative text-xs md:text-sm text-white/80">FCPS Dermatology</span>
          </div>
        </div>

        {/* CTA */}
       

      </div>
    </section>
  );
}