import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "About Enzyme Therapy | Enzyme Skincare",
  description:
    "Learn what enzyme therapy is, understand the temporary plasmatic effect, and discover how long a personalised enzyme treatment programme may take.",
};

const sections = [
  {
    question: "What Is Enzyme Therapy?",
    answer: [
      "Enzyme Therapy is a professional skin treatment designed to support the skin's natural renewal processes rather than focusing only on temporary surface-level changes.",
      "The treatment is intended to encourage healthy circulation, oxygen delivery and lymphatic movement, helping create a more supportive environment for normal skin function. It may also assist with the removal of surface buildup and help the skin appear smoother, clearer and more balanced.",
      "Depending on the individual treatment plan, Enzyme Therapy may be used to support concerns such as congestion, uneven-looking skin tone, dullness, visible pores, blemish-prone skin and early signs of ageing.",
    ],
  },
  {
    question: "What Is the Plasmatic Effect?",
    answer: [
      "During some enzyme-based facial treatments, a temporary network-like pattern may become visible across the skin. This appearance is commonly referred to as the Plasmatic Effect.",
      "It can occur when circulation near the surface of the skin becomes more noticeable during treatment. Fine vascular patterns may temporarily appear around areas such as the cheeks, forehead, neck or upper chest.",
      "The visible pattern usually fades naturally after the treatment, often within approximately 15 to 30 minutes, although the duration may vary between individuals.",
    ],
  },
  {
    question: "How Long Does Enzyme Therapy Take to Work?",
    answer: [
      "The treatment timeline depends on the client's skin condition, goals, lifestyle, home-care routine and response to treatment.",
      "Some clients may notice that their skin feels smoother or appears more refreshed after the first session. More visible and lasting changes generally require a consistent treatment plan completed over several weeks or months.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "About", url: "/about" }]} />

      {/* ── Hero ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-primary-600 tracking-[0.2em] uppercase mb-4">
              ABOUT
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight mb-6">
              Understanding Enzyme Therapy
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl">
              Learn how enzyme-based skin treatments support healthy skin function, why temporary vascular patterns may appear during treatment, and how treatment frequency is determined.
            </p>
          </div>
        </div>
      </section>

      {/* ── Content Sections ── */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-20 md:space-y-28">
            {sections.map((item, index) => (
              <div
                key={index}
                className="opacity-0 animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
              >
                <h2 className="font-heading text-[clamp(2rem,5vw,3.75rem)] font-bold text-neutral-800 leading-tight mb-8 md:mb-10">
                  {item.question}
                </h2>
                <div className="space-y-5 max-w-prose">
                  {item.answer.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-neutral-600 leading-[1.8] text-base md:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {index < sections.length - 1 && (
                  <hr className="mt-16 md:mt-20 border-neutral-200/60" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── fadeInUp animation ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 700ms ease both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeInUp {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
