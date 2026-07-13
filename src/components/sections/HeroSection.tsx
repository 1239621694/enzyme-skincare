import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[500px] lg:min-h-[750px] overflow-hidden bg-[#1a1a1a]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-banner-clean.png')" }}
      />

      {/* Mobile overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/50 md:via-black/20 md:to-transparent" />

      {/* Content */}
      <div className="relative h-full min-h-[80vh] md:min-h-[500px] lg:min-h-[750px] container mx-auto px-6 md:px-8 lg:px-12 flex items-center">
        <div className="w-full md:w-[45%] max-w-lg pt-16 md:pt-0">
          <h1 className="font-heading text-[clamp(2.2rem,6vw,3.8rem)] leading-tight font-bold text-[#d8c49d] mb-5" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            Bring the Enzyme<br />
            Facial Experience Home
          </h1>
          <p className="text-[#d1d8c9] text-[clamp(1rem,2vw,1.2rem)] leading-relaxed max-w-md mb-8" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            Mix, apply and enjoy a professional-inspired
            enzyme skincare ritual&mdash;on your time,
            in your own space.
          </p>
          <Link
            href="/collections/best-sellers"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-full bg-[#d2b985] text-white hover:bg-[#c4a872] hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
          >
            Shop Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}