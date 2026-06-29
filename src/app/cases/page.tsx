"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ALL_CASES, getCasesByConcern } from "@/lib/cases";
import { Modal } from "@/components/ui/Modal";
import type { CaseData } from "@/lib/cases";

const FILTERS = [
  { value: "all", label: "All Results" },
  { value: "acne", label: "Acne" },
  { value: "aging", label: "Aging" },
  { value: "pigmentation", label: "Pigmentation" },
  { value: "dryness", label: "Dryness" },
];

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const filtered = getCasesByConcern(activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-3">Before &amp; After Results</h1>
        <p className="text-neutral-500 max-w-2xl mx-auto">
          Real transformations from real clients. Each result showcases the power of enzyme-powered skincare.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={"px-5 py-2 rounded-full text-sm font-medium transition-colors " + (activeFilter === f.value ? "bg-primary-600 text-white" : "bg-white text-neutral-600 border border-neutral-300 hover:border-primary-400")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((cs) => (
          <div key={cs.slug} className="group cursor-pointer" onClick={() => setSelectedCase(cs)}>
            {/* Before/After images side by side */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 flex">
              <div className="relative w-1/2 overflow-hidden">
                <Image src={cs.beforeImage} alt={"Before - " + cs.title} fill className="object-cover" sizes="25vw" />
                <span className="absolute top-2 left-2 bg-white/90 text-neutral-800 text-[10px] font-bold px-1.5 py-0.5 rounded">BEFORE</span>
              </div>
              <div className="relative w-1/2 overflow-hidden border-l border-white/30">
                <Image src={cs.afterImage} alt={"After - " + cs.title} fill className="object-cover" sizes="25vw" />
                <span className="absolute top-2 left-2 bg-primary-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AFTER</span>
              </div>
            </div>
            {/* Info */}
            <div className="mt-2">
              <p className="text-xs font-medium text-neutral-800 line-clamp-1">{cs.title}</p>
              {cs.treatmentDuration && <p className="text-xs text-neutral-400">{cs.treatmentDuration}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for zoomed view */}
      <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={selectedCase?.title ?? ""}>
        {selectedCase && (
          <div>
            <div className="flex gap-2 mb-4">
              <div className="relative w-1/2 aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100">
                <Image src={selectedCase.beforeImage} alt="Before" fill className="object-cover" sizes="50vw" />
                <span className="absolute top-2 left-2 bg-white/90 text-neutral-800 text-xs font-bold px-2 py-0.5 rounded">BEFORE</span>
              </div>
              <div className="relative w-1/2 aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100">
                <Image src={selectedCase.afterImage} alt="After" fill className="object-cover" sizes="50vw" />
                <span className="absolute top-2 left-2 bg-primary-600/90 text-white text-xs font-bold px-2 py-0.5 rounded">AFTER</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-1">{selectedCase.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCase.skinConcern.map((c) => (<span key={c} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{c}</span>))}
              <span className="text-xs bg-accent-50 text-accent-700 px-2 py-0.5 rounded-full">{selectedCase.treatmentDuration}</span>
            </div>
            <Link href={"/cases/" + selectedCase.slug} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View Full Details &rarr;</Link>
          </div>
        )}
      </Modal>
    </div>
  );
}