// src/app/blog/[slug]/page.jsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "@/data/blogData";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Dr. Ahsan Malik`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return notFound();

  return (
    <section className="bg-light py-20 px-6 relative overflow-hidden">
      <div className="absolute top-12 left-6 text-primary/5 text-7xl font-bold select-none pointer-events-none">
        ✨
      </div>

      <div className="max-w-5xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-xs font-bold text-accent hover:text-primary transition-colors mb-8 gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-3 h-3 rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          Back to Blog
        </Link>

        <div className="inline-flex items-center bg-white text-primary font-bold px-5 py-2 rounded-full text-xs uppercase tracking-widest mb-4 shadow-md">
          {post.icon} {post.category}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">
          {post.title}
        </h1>

        <p className="text-dark/60 text-sm mb-8">
          {post.date} · {post.readTime}
        </p>

        <div className="relative w-full h-[320px] md:h-[420px] rounded-[2rem] overflow-hidden mb-10 shadow-xl">
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes="(max-w-3xl) 100vw"
            className="object-cover"
            priority
          />
        </div>

        <article className="space-y-8 mb-16">
          {post.content.map((block) => (
            <div key={block.heading}>
              <h2 className="text-xl font-extrabold text-primary mb-2">
                {block.heading}
              </h2>
              <p className="text-dark/80 leading-relaxed">{block.body}</p>
            </div>
          ))}
        </article>

        <div className="bg-primarySoft rounded-[2rem] p-8 text-center">
          <h3 className="text-xl font-extrabold text-primary mb-2">
            Ready to talk to Dr. Ahsan Malik about {post.category.toLowerCase()}?
          </h3>
          <p className="text-dark/70 text-sm mb-6">
            Book a consultation and get a treatment plan built around your
            skin.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center bg-accent hover:bg-accentDark text-white font-bold px-6 py-3 rounded-full text-sm transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}