import Image from 'next/image';

export default function ServicesSectionHorizontal() {
  const services = [
    {
      id: 1,
      title: "Acne Treatment",
      desc: "Expert diagnosis and treatment for all types of acne and deep scars.",
      img: "/service1.webp",
      icon: "🩺",
      slug: "acne-treatment-guide",
    },
    {
      id: 2,
      title: "Anti Aging Care",
      img: "/service2.webp",
      desc: "Advanced therapies to restore youthfulness and boost collagen production.",
      icon: "✨",
      slug: "anti-aging-collagen-care",
    },
    {
      id: 3,
      title: "Cosmetic Procedure",
      img: "/service3.webp",
      desc: "Safe chemical peels, hydrafacials, and clinical skin rejuvenation.",
      icon: "⚡",
      slug: "cosmetic-procedures-explained",
    },
    {
      id: 4,
      title: "Laser Therapy",
      img: "/service4.webp",
      desc: "Premium permanent hair reduction and precision laser treatments.",
      icon: "💇‍♀️",
      slug: "laser-therapy-hair-and-resurfacing",
    },
  ];

  return (
   
    <section className="bg-light py-20 px-6 relative overflow-hidden">
      <div className="absolute top-12 left-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">✨</div>
      <div className="absolute bottom-12 right-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">✨</div>

      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center bg-white text-primary font-bold px-6 py-2 rounded-full text-s uppercase tracking-widest mb-4 shadow-md">
          ✨ Services
        </div>

        {/* Section Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-16 tracking-tight">
          Our <span className="text-accent  underline decoration-accent/50">Dermatology</span> Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const cornerClass = isEven 
              ? "rounded-tr-[3.5rem] rounded-bl-[2.5rem] rounded-tl-2xl rounded-br-2xl" 
              : "rounded-tl-[3.5rem] rounded-br-[2.5rem] rounded-tr-2xl rounded-bl-2xl";
            
            const badgePosition = isEven ? "-top-1 -right-1 rounded-bl-[2rem]" : "-top-1 -left-1 rounded-br-[2rem]";

            return (
              <div 
                key={service.id} 
                className="group bg-white border border-gray-100 rounded-[2rem] p-4 shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`relative w-full h-[250px] overflow-hidden mb-5 ${cornerClass}`}>
                  <Image 
                    src={service.img} 
                    alt={service.title} 
                    fill
                    sizes="(max-w-7xl) 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className={`absolute w-14 h-14 bg-dark text-white flex items-center justify-center text-xl shadow-md border-b-2 border-white/10 ${badgePosition}`}>
                    {service.icon}
                  </div>
                </div>

                {/* Text Block */}
                <div className="text-left px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-black  mb-2 group-hover:text-accent transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-medium text-dark/70 leading-relaxed mb-4">
                      {service.desc}
                    </p>
                  </div>

                  <a 
                    href={`/blog/${service.slug}`}
                    className="inline-flex items-center text-xs font-bold text-accent group-hover:text-primary transition-colors mt-auto gap-1"
                  >
                    Read More 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
