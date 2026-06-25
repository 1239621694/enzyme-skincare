import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string | null;
    authorName: string | null;
    readTime: number | null;
    publishedAt: Date | string | null;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-neutral-200 overflow-hidden bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-300">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 z-10 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400">
          {formattedDate && <span>{formattedDate}</span>}
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>
      </div>
    </Link>
  );
}