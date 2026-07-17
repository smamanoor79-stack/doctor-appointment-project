import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-primary overflow-hidden">
      <span aria-hidden="true" className="hidden md:block absolute top-24 left-16 text-2xl opacity-20 select-none">
        ✨
      </span>
      <span aria-hidden="true" className="hidden md:block absolute top-52 left-8 text-xl opacity-15 select-none">
        ✨
      </span>
      <span aria-hidden="true" className="hidden md:block absolute bottom-40 left-24 text-2xl opacity-15 select-none">
        ✨
      </span>
      <span aria-hidden="true" className="hidden md:block absolute top-16 right-[420px] text-xl opacity-20 select-none">
        ✨
      </span>
      <span aria-hidden="true" className="hidden md:block absolute bottom-24 right-[380px] text-lg opacity-15 select-none">
        ✨
      </span>

      <div className="max-w-7xl mx-auto px-6 relative z-20 min-h-[700px] md:min-h-[750px] flex items-center pt-16 pb-16 md:pt-0 md:pb-16">
        <div className="max-w-xl text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 drop-shadow-sm">
            Healthy{" "}
            <span className="text-accent italic">Skin,</span>{" "}
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-full align-middle -translate-y-2 shadow-md text-2xl md:text-3xl"
            >
              🧴
            </span>
            <br />
            Our Top Priority
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
            Expert dermatological care for all skin, hair, and nail concerns.
            From acne treatment to advanced skin rejuvenation, we help you
            look and feel your best.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/book"
              className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-7 py-3.5 rounded-full hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition text-lg"
            >
              Book Appointment
            </a>

            <a
              href="/services"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition text-lg"
            >
              View All Services
            </a>
          </div>
        </div>
      </div>

      {/* Decorative blob behind doctor image */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute right-0 top-0 w-[560px] h-[560px] lg:w-[640px] lg:h-[640px] bg-accent/25 rounded-full blur-3xl z-0"
      ></div>

      <div className="hidden md:block absolute bottom-0 right-0 lg:right-4 h-full z-10">
        <Image
          src="/banner-doctor.webp"
          alt="Smiling dermatologist in a white coat, ready to provide skin care consultations"
          width={640}
          height={750}
          priority
          className="h-full w-auto object-contain object-bottom"
        />
      </div>

      <div
        aria-hidden="true"
        className="hidden md:flex absolute bottom-6 left-6 w-20 h-20 lg:w-24 lg:h-24 bg-white/95 rounded-2xl items-center justify-center shadow-lg z-20 text-4xl lg:text-5xl rotate-[-8deg]"
      >
        🧴
      </div>
    </section>
  );
}