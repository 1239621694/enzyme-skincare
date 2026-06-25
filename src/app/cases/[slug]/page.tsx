import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/supabase/queries";
import { BeforeAfterSlider } from "@/components/cases/BeforeAfterSlider";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Button } from "@/components/ui/Button";

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600;

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const cs = await getCaseStudyBySlug(slug);
    return {
      title: cs.title + " - Case Study | Enzyme Skincare",
      description: cs.description ?? "",
    };
  } catch {
    return { title: "Case Study Not Found" };
  }
}

export default async function CaseStudyPage({ params }: CasePageProps) {
  const { slug } = await params;
  let cs: any;
  try {
    cs = await getCaseStudyBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Case Studies", url: "/cases" },
          { name: cs.title, url: "/cases/" + cs.slug },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {cs.beforeImage && cs.afterImage ? (
          <div className="max-w-2xl mx-auto mb-10">
            <BeforeAfterSlider
              beforeImage={cs.beforeImage}
              afterImage={cs.afterImage}
              aspectRatio="aspect-[4/3]"
            />
          </div>
        ) : null}

        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800">{cs.title}</h1>
          {cs.clientName && <p className="mt-2 text-lg text-neutral-500">{cs.clientName}</p>}
          <div className="flex flex-wrap gap-3 mt-4">
            {(cs.skinConcern ?? []).map((c: string) => (
              <span key={c} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">{c}</span>
            ))}
            {cs.treatmentDuration && (
              <span className="bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">{cs.treatmentDuration}</span>
            )}
          </div>
          {cs.description && <p className="mt-6 text-neutral-600 leading-relaxed">{cs.description}</p>}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/products"><Button size="lg">Shop These Products</Button></Link>
            <Link href="/book-consultation"><Button size="lg" variant="outline">Book a Similar Treatment</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
}