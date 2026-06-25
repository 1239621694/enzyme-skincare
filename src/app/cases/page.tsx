export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { getCaseStudies } from "@/lib/supabase/queries";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Before \\u0026 After Results — Enzyme Skincare Case Studies",
  description:
    "Real results from real people. Browse our case studies to see the transformative power of enzyme-based skincare.",
};

export default async function CasesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Case Studies", url: "/cases" },
        ]}
      />

      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800">
            Real Results
          </h1>
          <p className="mt-2 text-neutral-500">
            See the transformative power of enzyme-based skincare.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((cs: any) => (
            <Link
              key={cs.slug}
              href={`/cases/${cs.slug}`}
              className="group rounded-xl border border-neutral-200 overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] bg-neutral-100" />
              <div className="p-4">
                <h3 className="font-heading text-lg font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {cs.title}
                </h3>
                {cs.clientName && (
                  <p className="text-sm text-neutral-500 mt-1">{cs.clientName}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {(cs.skinConcern ?? []).map((concern: string) => (
                    <span
                      key={concern}
                      className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}