import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative bg-neutral-900 min-h-[50vh] md:min-h-[60vh] overflow-hidden">
      <Image
        src="/images/hero-banner.jpg"
        alt="Enzyme Skincare"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
    </section>
  );
}