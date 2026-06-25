export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getBlogPosts, getBlogCategories } from "@/lib/supabase/queries";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Journal — Enzyme Skincare Blog",
  description:
    "Expert skincare tips, enzyme science insights, and routines for healthy, glowing skin.",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts } = await getBlogPosts(undefined, page);
  const categories = await getBlogCategories();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Journal", url: "/blog" },
        ]}
      />

      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800">
            Journal
          </h1>
          <p className="mt-2 text-neutral-500">
            Skincare science, tips, and stories from the Enzyme team.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <BlogGrid posts={posts} />
          </div>
          <aside className="mt-8 lg:mt-0">
            <BlogSidebar categories={categories} />
          </aside>
        </div>
      </div>
    </>
  );
}