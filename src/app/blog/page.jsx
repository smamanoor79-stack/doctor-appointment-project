// src/app/blog/page.jsx
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogData";

export const metadata = {
  title: "Blog | Dr. Ahsan Malik",
  description:
    "Skincare insights, treatment guides, and dermatology advice from Dr. Ahsan Malik's clinic.",
};

export default function BlogPage() {
  return (
    <section className="bg-light py-20 px-6 relative overflow-hidden">
      <div className="absolute top-12 left-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-12 right-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">
        ✨
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white text-primary font-bold px-6 py-2 rounded-full text-s uppercase tracking-widest mb-4 shadow-md">
            📝 Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            Skincare <span className="text-accent underline decoration-accent/50">Insights</span> &amp; Guides
          </h1>
          <p className="text-dark/70 max-w-2xl mx-auto text-base md:text-lg">
            Practical, doctor-written articles on acne, anti-aging, cosmetic
            procedures, and laser treatments — so you know what to expect
            before you book.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {blogPosts.map((post, index) => {
            const isEven = index % 2 === 0;
            const cornerClass = isEven
              ? "rounded-tr-[3.5rem] rounded-bl-[2.5rem] rounded-tl-2xl rounded-br-2xl"
              : "rounded-tl-[3.5rem] rounded-br-[2.5rem] rounded-tr-2xl rounded-bl-2xl";

            const badgePosition = isEven
              ? "-top-1 -right-1 rounded-bl-[2rem]"
              : "-top-1 -left-1 rounded-br-[2rem]";

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-100 rounded-[2rem] p-4 shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  className={`relative w-full h-[250px] overflow-hidden mb-5 ${cornerClass}`}
                >
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    sizes="(max-w-7xl) 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div
                    className={`absolute w-14 h-14 bg-dark text-white flex items-center justify-center text-xl shadow-md border-b-2 border-white/10 ${badgePosition}`}
                  >
                    {post.icon}
                  </div>
                </div>

                <div className="text-left px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-accent uppercase tracking-wide mb-2">
                      {post.category} · {post.readTime}
                    </p>
                    <h3 className="text-xl font-extrabold text-primary mb-2  transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-sm text-dark/70 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="inline-flex items-center text-xs font-bold text-accent group-hover:text-primary transition-colors mt-auto gap-1">
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}