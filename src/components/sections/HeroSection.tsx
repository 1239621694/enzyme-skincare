import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.jpg"
          alt="Enzyme Skincare — Activate Your Skin's Natural Renewal"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/70 via-neutral-900/40 to-transparent" />
      </div>
      <div className="relative container mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance text-white">
            Activate Your Skin&apos;s Natural Renewal
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 leading-relaxed max-w-lg">
            Enzyme-powered skincare backed by science. Dermatologist tested, cruelty-free formulas
            that work with your skin, not against it.
          </p>
          <div className="mt-8 flex justify-start">
            <Link href="/products">
              <Button size="lg" className="px-10 py-4 text-lg bg-white text-neutral-900 hover:bg-neutral-100">
                Shop Best Sellers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}