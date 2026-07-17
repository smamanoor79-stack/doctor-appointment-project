import Image from 'next/image';

export default function BookingProcessSection() {
  const steps = [
    {
      id: 1,
      title: "Choose Your Service",
      desc: "Select the dermatology treatment you need — skin consultation, acne treatment, or hair care.",
      img: "/booking1.webp",
      alt: "Patient browsing available dermatology services to choose the right treatment",
    },
    {
      id: 2,
      title: "Pick Date & Time",
      desc: "Choose your preferred appointment date and time that fits your schedule.",
      img: "/booking2.webp",
      alt: "Calendar interface for selecting a convenient appointment date and time",
    },
    {
      id: 3,
      title: "Enter Details",
      desc: "Fill in your basic information and describe your skin concern for a better consultation.",
      img: "/booking3.webp",
      alt: "Patient filling in personal details and skin concern for the appointment form",
    },
    {
      id: 4,
      title: "Confirm Your Booking",
      desc: "Review your details and confirm your appointment. Get instant confirmation and visit the clinic.",
      img: "/booking4.webp",
      alt: "Confirmation screen showing a successfully booked dermatology appointment",
    },
  ];

  return (
    <section className="bg-primarySoft py-20 px-6 relative overflow-hidden" aria-labelledby="booking-process-heading">
      <div className="absolute top-16 left-10 text-primary/10 text-7xl font-bold select-none pointer-events-none" aria-hidden="true">
        &#10024;
      </div>
      <div className="absolute bottom-16 right-10 text-primary/10 text-7xl font-bold select-none pointer-events-none" aria-hidden="true">
        &#10024;
      </div>

      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-flex items-center bg-white text-primary font-extrabold px-6 py-2 rounded-full text-sm uppercase tracking-widest mb-4 shadow-sm">
          <span aria-hidden="true">&#10024;</span>&nbsp;Booking Process
        </div>

        <h2 id="booking-process-heading" className="text-4xl md:text-5xl font-extrabold text-primary mb-5 tracking-tight">
          How Booking <span className="text-accent">Works</span> For You
        </h2>

        <p className="text-base md:text-lg text-dark/80 max-w-2xl mx-auto leading-relaxed">
          Booking an appointment with Dr. Ahsan Malik&apos;s Clinic is simple — just four easy
          steps stand between you and healthier, more confident skin.
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0 m-0">
          {steps.map((step) => (
            <li key={step.id} className="flex flex-col items-center">
              {/* Step number */}
              <div
                className="w-12 h-12 rounded-full bg-accent text-white font-extrabold text-lg flex items-center justify-center shadow-md mb-3 z-10"
                aria-hidden="true"
              >
                {step.id}
              </div>

              <div className="w-px h-6 border-l-2 border-dashed border-primary/30 mb-3" aria-hidden="true"></div>

              {/* Card */}
              <div className="bg-white rounded-3xl p-5 shadow-xl w-full flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300">
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-5 relative">
                  <Image
                    src={step.img}
                    alt={step.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <h3 className="text-lg font-extrabold text-primary hover:text-accent mb-2">
                  <span className="sr-only">Step {step.id}: </span>
                  {step.title}
                </h3>
                <p className="text-sm text-dark/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="text-center mt-16 relative z-10">
        <a
          href="/book"
          className="inline-flex items-center gap-2 bg-accent text-white font-bold px-8 py-4 rounded-full hover:bg-accentDark transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Book Your Appointment
        </a>
      </div>
    </section>
  );
}