export interface CaseData {
  slug: string;
  title: string;
  clientName: string;
  skinConcern: string[];
  treatmentDuration: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

export const ALL_CASES: CaseData[] = [
  {
    slug: "acne-recovery-8-weeks",
    title: "3-Year Hormonal Acne — 8 Weeks",
    clientName: "Jessica M.",
    skinConcern: ["acne"],
    treatmentDuration: "8 weeks",
    description: "Persistent cystic acne along the jawline and cheeks cleared significantly after 8 weeks of enzyme-based treatment. Redness reduced, texture improved.",
    beforeImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
  },
  {
    slug: "hyperpigmentation-journey",
    title: "Melasma & Sun Damage — 12 Weeks",
    clientName: "Amara K.",
    skinConcern: ["pigmentation"],
    treatmentDuration: "12 weeks",
    description: "Post-inflammatory hyperpigmentation from sun exposure and previous breakouts faded noticeably after consistent enzyme serum application.",
    beforeImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=800&fit=crop",
  },
  {
    slug: "aging-skin-transformation",
    title: "Fine Lines & Loss of Firmness — 16 Weeks",
    clientName: "Margaret L.",
    skinConcern: ["aging"],
    treatmentDuration: "16 weeks",
    description: "Visible reduction in fine lines around eyes and mouth. Skin regained elasticity and natural radiance after 16 weeks of enzyme-powered regimen.",
    beforeImage: "https://images.unsplash.com/photo-1615460549969-36fa19521c4d?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1615460549969-36fa19521c4d?w=800&h=800&fit=crop",
  },
  {
    slug: "dryness-repair",
    title: "Chronic Dryness & Barrier Repair — 6 Weeks",
    clientName: "Emily R.",
    skinConcern: ["dryness"],
    treatmentDuration: "6 weeks",
    description: "Severe dryness and flakiness resolved after switching to enzyme barrier moisturizer. Skin feels hydrated and comfortable throughout the day.",
    beforeImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  },
  {
    slug: "acne-scar-texture",
    title: "Acne Scars & Texture — 10 Weeks",
    clientName: "David R.",
    skinConcern: ["acne", "pigmentation"],
    treatmentDuration: "10 weeks",
    description: "Ice pick acne scars softened and overall skin texture improved dramatically. Dark spots from old breakouts faded significantly.",
    beforeImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  },
  {
    slug: "aging-eye-area",
    title: "Eye Area Rejuvenation — 8 Weeks",
    clientName: "Sophia L.",
    skinConcern: ["aging"],
    treatmentDuration: "8 weeks",
    description: "Crow feet and under-eye fine lines visibly reduced. Eye area appears brighter and more youthful after targeted enzyme treatment.",
    beforeImage: "https://images.unsplash.com/photo-1615460549969-36fa19521c4d?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  },
  {
    slug: "pigmentation-pregnancy",
    title: "Pregnancy Melasma — 14 Weeks",
    clientName: "Olivia C.",
    skinConcern: ["pigmentation"],
    treatmentDuration: "14 weeks",
    description: "Pregnancy-induced melasma on forehead and cheeks faded considerably. Even skin tone restored with consistent enzyme serum use.",
    beforeImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
  },
  {
    slug: "acne-adult-onset",
    title: "Adult-Onset Acne — 8 Weeks",
    clientName: "Aisha W.",
    skinConcern: ["acne", "dryness"],
    treatmentDuration: "8 weeks",
    description: "Adult acne triggered by stress and hormonal changes cleared without drying out the skin. Enzyme treatment balanced oil production while maintaining hydration.",
    beforeImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=800&fit=crop",
  },
];

export function getCasesByConcern(concern: string): CaseData[] {
  if (concern === "all") return ALL_CASES;
  return ALL_CASES.filter((c) => c.skinConcern.includes(concern));
}