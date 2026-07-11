"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

const galleryImages = [
  { src: "/images/before-after/before-after-01.jpg", alt: "Before and after enzyme therapy skin progress result 01", label: "Client Result 01" },
  { src: "/images/before-after/before-after-02.jpg", alt: "Before and after enzyme therapy skin progress result 02", label: "Client Result 02" },
  { src: "/images/before-after/before-after-03.jpg", alt: "Before and after enzyme therapy skin progress result 03", label: "Client Result 03" },
  { src: "/images/before-after/before-after-04.jpg", alt: "Before and after enzyme therapy skin progress result 04", label: "Client Result 04" },
  { src: "/images/before-after/before-after-05.jpg", alt: "Before and after enzyme therapy skin progress result 05", label: "Client Result 05" },
  { src: "/images/before-after/before-after-06.jpg", alt: "Before and after enzyme therapy skin progress result 06", label: "Client Result 06" },
  { src: "/images/before-after/before-after-07.jpg", alt: "Before and after enzyme therapy skin progress result 07", label: "Client Result 07" },
  { src: "/images/before-after/before-after-08.jpg", alt: "Before and after enzyme therapy skin progress result 08", label: "Client Result 08" },
  { src: "/images/before-after/before-after-09.jpg", alt: "Before and after enzyme therapy skin progress result 09", label: "Client Result 09" },
  { src: "/images/before-after/before-after-10.jpg", alt: "Before and after enzyme therapy skin progress result 10", label: "Client Result 10" },
  { src: "/images/before-after/before-after-11.jpg", alt: "Before and after enzyme therapy skin progress result 11", label: "Client Result 11" },
];

export default function CasesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightboxOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox]);

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Before & After", url: "/cases" }]} />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-primary-600 tracking-[0.2em] uppercase mb-4">
              BEFORE / AFTER
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-800 leading-tight mb-5">
              Real Skin. Real Progress.
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed mb-2">
              Explore real client progress documented before and after a personalised enzyme treatment programme.
            </p>
            <p className="text-sm text-neutral-400">
              Individual results vary depending on skin condition, treatment frequency, lifestyle and home care.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(index); }}
                aria-label={`Open enlarged view of ${img.label}`}
              >
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={1200}
                    height={1200}
                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-sm font-medium text-neutral-800">{img.label}</p>
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                    Results shown are individual and may not represent the experience of every client.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-14 md:py-18 bg-neutral-50/80 border-t border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-800 mb-5">
              A Note About Results
            </h2>
            <p className="text-neutral-500 leading-relaxed max-w-prose">
              Every client&apos;s skin is different. Treatment plans, timelines and outcomes vary according to skin condition, lifestyle, consistency and professional recommendations. Images are provided for educational and illustrative purposes only and do not guarantee identical results.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox / Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-800 hover:bg-white transition-colors shadow-md"
              aria-label="Close lightbox"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={galleryImages[activeIndex].src}
              alt={galleryImages[activeIndex].alt}
              width={1600}
              height={1600}
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
