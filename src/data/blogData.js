
export const blogPosts = [
  {
    slug: "acne-treatment-guide",
    serviceId: 1,
    title: "Acne Treatment: What Actually Works",
    excerpt:
      "Breaking down the real causes of acne and deep scarring, and the clinical treatments that consistently deliver results.",
    img: "/service1.jpg",
    icon: "🩺",
    category: "Acne Treatment",
    date: "June 18, 2026",
    readTime: "5 min read",
    content: [
      {
        heading: "Why acne isn't just a teenage problem",
        body: "Hormonal shifts, stress, diet, and genetics all play a role in adult acne, which is why a one-size-fits-all skincare routine rarely works. A proper diagnosis starts with identifying which of these factors is driving your specific breakouts.",
      },
      {
        heading: "Treating active breakouts vs. old scars",
        body: "Active acne responds well to topical retinoids, targeted antibiotics, and in-office extractions. Deep scarring, on the other hand, usually needs a different approach entirely — microneedling, chemical peels, or laser resurfacing to rebuild collagen in the affected areas.",
      },
      {
        heading: "What to expect at your first visit",
        body: "Dr. Ahsan Malik begins every acne consultation with a full skin assessment before recommending a plan, since the right treatment depends heavily on your skin type, severity, and how long the condition has been present.",
      },
    ],
  },
  {
    slug: "anti-aging-collagen-care",
    serviceId: 2,
    title: "Anti-Aging Care: Restoring Collagen the Right Way",
    excerpt:
      "A look at how modern anti-aging therapies rebuild collagen and restore youthful skin without unnecessary downtime.",
    img: "/service2.jpg",
    icon: "✨",
    category: "Anti Aging Care",
    date: "June 22, 2026",
    readTime: "4 min read",
    content: [
      {
        heading: "Collagen loss starts earlier than you think",
        body: "Natural collagen production begins slowing in your mid-20s, which is why fine lines and loss of elasticity can appear well before your 30s. Early, gentle intervention is often more effective than aggressive treatment later on.",
      },
      {
        heading: "Where injectables actually help",
        body: "Not every anti-aging concern needs an injectable. Some patients benefit more from collagen-stimulating treatments like microneedling or radiofrequency, while others see faster results from targeted filler or neuromodulator treatments.",
      },
      {
        heading: "Building a routine that lasts",
        body: "The best anti-aging results come from combining in-clinic treatments with a consistent at-home routine — something Dr. Ahsan Malik's clinic maps out for every patient after their first assessment.",
      },
    ],
  },
  {
    slug: "cosmetic-procedures-explained",
    serviceId: 3,
    title: "Cosmetic Procedures: Peels, Hydrafacials, and What's Right for You",
    excerpt:
      "Chemical peels and hydrafacials are often confused. Here's how each one works and which skin concerns they're best suited for.",
    img: "/service3.jpg",
    icon: "⚡",
    category: "Cosmetic Procedure",
    date: "June 27, 2026",
    readTime: "4 min read",
    content: [
      {
        heading: "Chemical peels: more than an exfoliant",
        body: "Chemical peels work at different depths depending on the acid used and its concentration, making them useful for anything from mild dullness to stubborn pigmentation and acne scarring.",
      },
      {
        heading: "Hydrafacials for instant, low-downtime glow",
        body: "Unlike peels, hydrafacials cleanse, extract, and hydrate in a single session with virtually no recovery time, which makes them a popular choice before an event or as a regular maintenance treatment.",
      },
      {
        heading: "Choosing between the two",
        body: "The right choice depends on your skin goals and how much downtime you can accommodate — a distinction the clinic walks through with every patient before booking a procedure.",
      },
    ],
  },
  {
    slug: "laser-therapy-hair-and-resurfacing",
    serviceId: 4,
    title: "Laser Therapy: Hair Reduction and Skin Resurfacing",
    excerpt:
      "How laser technology delivers long-term hair reduction and smoother skin, and what results you can realistically expect.",
    img: "/service4.jpg",
    icon: "💇‍♀️",
    category: "Laser Therapy",
    date: "July 2, 2026",
    readTime: "5 min read",
    content: [
      {
        heading: "How laser hair reduction actually works",
        body: "Laser energy targets the pigment in hair follicles, damaging them enough to slow future growth. Because hair grows in cycles, most patients need multiple sessions spaced weeks apart for lasting reduction.",
      },
      {
        heading: "Resurfacing for texture, tone, and scarring",
        body: "Laser resurfacing treatments work below the surface to encourage new collagen, making them effective for acne scarring, sun damage, and uneven skin texture.",
      },
      {
        heading: "Safety comes first",
        body: "Laser settings need to be calibrated to your skin type to avoid pigmentation issues, which is why Dr. Ahsan Malik's clinic uses a personalized protocol for every laser patient rather than a fixed setting.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostByServiceId(serviceId) {
  return blogPosts.find((post) => post.serviceId === serviceId);
}
