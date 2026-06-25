import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/supabase/queries";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Button } from "@/components/ui/Button";

interface BlogArticleProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600;

export async function generateMetadata({ params }: BlogArticleProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    return {
      title: post.title + " — Enzyme Skincare Blog",
      description: post.excerpt ?? "",
      openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : {},
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Journal", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
          {post.category && (
            <span className="text-primary-600 font-medium">{post.category}</span>
          )}
          {formattedDate && <span>{formattedDate}</span>}
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-3 text-lg text-neutral-500 leading-relaxed">{post.excerpt}</p>
        )}

        {post.coverImage && (
          <div className="relative aspect-video mt-6 rounded-xl overflow-hidden bg-neutral-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {post.authorName && (
          <div className="flex items-center gap-3 mt-4 text-sm">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-neutral-800">{post.authorName}</p>
              <p className="text-neutral-400">Author</p>
            </div>
          </div>
        )}

        <div className="mt-8 prose prose-neutral max-w-none">
          <div className="text-neutral-600 leading-relaxed space-y-4">
            {post.content?.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-neutral-800">
            Ready to Transform Your Skin?
          </h2>
          <p className="mt-2 text-neutral-600">
            Discover our enzyme-powered skincare collection.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button>Shop Products</Button>
            </Link>
            <Link href="/book-consultation">
              <Button variant="outline">Book a Consultation</Button>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
