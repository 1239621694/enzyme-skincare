import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string | null;
    authorName: string | null;
    readTime: number | null;
    publishedAt: Date | string | null;
  }>;
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}