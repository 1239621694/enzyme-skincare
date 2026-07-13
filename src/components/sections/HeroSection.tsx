import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#1a1a1a]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/images/hero-banner-clean.png')" }}
      />

      {/* Overlay — pointer-events: none so it doesn't block clicks */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/50 md:via-black/20 md:to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[720px] container mx-auto px-6 md:pl-[4%] flex items-center">
        <div className="w-full md:w-[48%] max-w-[900px] pt-16 md:pt-0">
          <h1 className="font-heading text-[clamp(2.5rem,4.2vw,4.75rem)] leading-[1.12] font-bold text-[#d8c49d]" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}>
            <span className="block whitespace-nowrap">Bring the Enzyme</span>
            <span className="block whitespace-nowrap">Facial Experience Home</span>
          </h1>
          <p className="text-[#d1d8c9] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed max-w-[600px] mt-6 mb-10" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            Mix, apply and enjoy a professional-inspired<br />
            enzyme skincare ritual&mdash;on your time,<br />
            in your own space.
          </p>
          <Link
            href="/products"
            className="relative z-20 inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-full bg-[#d2b985] text-white hover:bg-[#c4a872] hover:-translate-y-0.5 transition-all duration-200 shadow-lg cursor-pointer"
          >
            Shop Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
