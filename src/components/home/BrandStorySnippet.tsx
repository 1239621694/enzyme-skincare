import Link from "next/link";

export function BrandStorySnippet() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
            Professional Enzyme Care, Now at Home
          </h2>
          <p className="text-neutral-500 text-lg mb-10 max-w-2xl mx-auto">
            Premium skincare treatments formulated for your personal skincare ritual.
          </p>
          <div className="space-y-5 text-left text-neutral-600 leading-relaxed text-[1.125rem] md:text-[1.188rem]">
            <p>
              In the past, experiencing professional enzyme treatments meant visiting a skincare clinic. However, the high cost and time commitment made it difficult for many people to maintain this routine consistently.
            </p>
            <p>
              Now, we&apos;re bringing professional enzyme care into your home, allowing more people to enjoy a convenient and personalized enzyme skincare experience in their own space.
            </p>
            <p>
              From skincare clinics to home care, this is more than just bringing a treatment home &mdash; it&apos;s about making enzyme care more accessible and transforming a professional treatment into a long-term skincare ritual.
            </p>
            <p className="font-semibold text-neutral-800">
              Professional enzyme care should not feel out of reach. Now, professional-level enzyme care can become part of your everyday routine.
            </p>
          </div>
          <div className="mt-10">
            <Link href="/about" className="inline-flex items-center px-8 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
