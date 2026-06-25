import { getBlogPosts, getBlogCategories } from "@/lib/supabase/queries";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getBlogCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const { posts } = await getBlogPosts(slug);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Journal", url: "/blog" },
          { name: category.name, url: "/blog/category/" + slug },
        ]}
      />

      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-800">{category.name}</h1>
          {category.description && <p className="mt-2 text-neutral-500">{category.description}</p>}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <BlogGrid posts={posts} />
          </div>
          <aside className="mt-8 lg:mt-0">
            <BlogSidebar categories={categories} activeCategory={slug} />
          </aside>
        </div>
      </div>
    </>
  );
}
