"use client";

import { useState, useEffect, useCallback } from "react";
import { Stars } from "@/components/ui/Stars";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "My friend has been getting enzyme treatments at a skincare clinic, and her skin looked amazing. I always wanted to try it, but the clinic price was too high. I’ve been using this at-home enzyme treatment for 3 months, and it’s so easy! My skin looks smoother, brighter, and more radiant. I truly love the results! My friend even wants to try buying it here next time.",
    name: "Margaret L.",
    location: "San Francisco, USA",
    rating: 5,
  },
  {
    quote:
      "I use the Active Protease once a week, then follow it up with this additive-free Rose Brightening Fermented Mask. It instantly calms my skin after enzyme treatment and leaves my skin with a beautiful glass-like glow by the next morning. I’m honestly so surprised by the results!",
    name: "Margaret L.",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "I’ve struggled with acne for years, and I honestly didn’t expect such a big change. After 8 weeks of using the Active Protease Anti-Wrinkle Kit, my skin has never looked this good! So grateful I found this!",
    name: "Elena G.",
    location: "Madrid, Spain",
    rating: 5,
  },
  {
    quote:
      "I started with the Active Protease Anti-Wrinkle Kit and Rose Brightening Fermented Mask because my skin looked dull and I had many fine lines. After seeing how amazing they felt on my skin, I added the DNA Sodium Instant Firming V-Face Spray and Copper Peptide Repair Freeze-Dried Powder to my daily routine. These products completely changed my view of skincare. They are so unique and effective, and I’ve fallen in love with all of their products!",
    name: "Anna K.",
    location: "Munich, Germany",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="bg-primary-50 section-padding">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-neutral-800 text-center mb-10">
          What Our Customers Say
        </h2>

        <div
          className="max-w-2xl mx-auto text-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Stars rating={testimonials[active].rating} size="md" className="mx-auto" />
          <blockquote className="mt-4 text-lg text-neutral-700 leading-relaxed italic">
            &ldquo;{testimonials[active].quote}&rdquo;
          </blockquote>
          <p className="mt-4 font-semibold text-neutral-800">
            {testimonials[active].name}
          </p>
          <p className="text-sm text-neutral-500">{testimonials[active].location}</p>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  i === active
                    ? "bg-primary-600 w-6"
                    : "bg-primary-300 hover:bg-primary-400"
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}