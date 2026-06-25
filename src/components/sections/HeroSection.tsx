import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
            Activate Your Skin&apos;s Natural Renewal
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-100 leading-relaxed max-w-lg">
            Enzyme-powered skincare backed by science. Dermatologist tested, cruelty-free formulas
            that work with your skin, not against it.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary" className="px-10 py-4 text-lg">
                Shop Best Sellers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}