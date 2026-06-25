import Link from "next/link";

export function BrandStorySnippet() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-neutral-800">
            Science Meets Nature
          </h2>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            Enzyme Skincare was born from a simple belief: your skin already knows how to heal itself.
            Our formulas use bio-active enzymes derived from plants to gently activate your skin&apos;s
            natural renewal process. No harsh chemicals, no empty promises, just science-backed
            skincare that delivers visible results.
          </p>
          <div className="mt-6">
            <Link
              href="/about"
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Learn More About Our Story &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}