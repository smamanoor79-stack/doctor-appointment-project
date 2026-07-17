export default function TestimonialsSection() {
    const testimonials = [
        {
            id: 1,
            name: "Ayesha Khan",
            location: "Lahore, Pakistan",
            quote:
                "I saw real improvement in my skin after just a few sessions. The staff at Dr. Ahsan Malik's clinic were professional, warm, and genuinely cared about my results.",
            img: "/test1.jpg",
        },
        {
            id: 2,
            name: "Bilal Ahmed",
            location: "Karachi, Pakistan",
            quote:
                "The team helped me build a skincare routine that actually works for my skin type. I'm so grateful for how patient and knowledgeable everyone was.",
            img: "/test2.jpg",
        },
        {
            id: 3,
            name: "Sana Malik",
            location: "Islamabad, Pakistan",
            quote:
                "After years of struggling with acne, this clinic finally helped me find a solution. My skin is clearer and healthier than it's ever been. Thank you!",
            img: "/test3.jpg",
        },
    ];

    return (
        <section className="bg-light py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-20">
                <div className="inline-flex items-center bg-white text-primary font-extrabold px-6 py-2 rounded-full text-sm uppercase tracking-widest mb-4 shadow-md">
                    ✨ Testimonials
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight mb-3">
                    Words of <span className="text-accent">Appreciation</span>
                </h2>
                <p className="text-lg md:text-xl font-medium text-dark/50 tracking-tight">
                    from our Patients
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                {testimonials.map((t) => (
                    <div
                        key={t.id}
                        className="relative bg-white border border-primary/10 rounded-3xl pt-16 pb-8 px-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Avatar overlapping the top edge */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img
                                src={t.img}
                                alt={t.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Star rating */}
                        <div className="flex justify-center gap-1 mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-accent"
                                >
                                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
                                </svg>
                            ))}
                        </div>

                        <p className="text-sm md:text-base text-dark/70 leading-relaxed mb-6">
                            {t.quote}
                        </p>

                        <h4 className="text-lg font-extrabold text-dark">{t.name}</h4>
                        <p className="text-sm text-dark/50">{t.location}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}