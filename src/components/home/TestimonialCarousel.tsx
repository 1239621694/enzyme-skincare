"use client";

import { useState, useEffect, useCallback } from "react";
import { Stars } from "@/components/ui/Stars";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "I have struggled with acne for years. After 8 weeks of using the Enzyme Repair Serum, my skin has never looked better. The redness is gone and my texture is smooth.",
    name: "Jessica M.",
    location: "New York, USA",
    rating: 5,
  },
  {
    quote:
      "The Enzyme Cleansing Balm is the only cleanser that does not strip my sensitive skin. I can actually wash my face without feeling tight and dry afterward.",
    name: "Amara K.",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "At 52, I have tried everything. This enzyme-based routine brought back the glow I thought I had lost forever. My friends keep asking what I have been doing.",
    name: "Margaret L.",
    location: "San Francisco, USA",
    rating: 5,
  },
  {
    quote:
      "I was skeptical about enzyme skincare, but the science convinced me to try. After one month, my dark spots are visibly fading. I am a believer now.",
    name: "David R.",
    location: "Austin, USA",
    rating: 4,
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