import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative bg-neutral-900 min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
      <Image
        src="/images/hero-banner.jpg"
        alt="Enzyme Skincare"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/50 to-transparent" />
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Activate Your Skin&apos;s Natural Renewal
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 leading-relaxed max-w-lg">
            Enzyme-powered skincare backed by science. Dermatologist tested, cruelty-free formulas
            that work with your skin, not against it.
          </p>
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              Shop Best Sellers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}