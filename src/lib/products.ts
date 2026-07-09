export interface ProductData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
  howToUse: string;
  price: number;
  comparePrice: number | null;
  category: "CLEANSER" | "SERUM" | "MOISTURIZER" | "SUNSCREEN" | "MASK" | "SET" | "BODY" | "TREATMENT" | "SPRAY";
  skinConcerns: ("ACNE" | "AGING" | "PIGMENTATION" | "SENSITIVITY" | "DRYNESS")[];
  badge: "BEST_SELLER" | "NEW" | "SALE" | null;
  rating: number;
  reviewsCount: number;
  size: string;
  images: string[];
  isActive: boolean;
  sortOrder: number;
  variants: { id: string; name: string; size: string; price: number; sku: string; stock: number }[];
}

export const ALL_PRODUCTS: ProductData[] = [
  {
    id: "1", slug: "active-protease-anti-wrinkle-kit",
    name: "Active Protease Anti-Wrinkle Kit",
    tagline: "Professional enzyme brush treatment for skin rejuvenation",
    description: "Restore the look of smoother, brighter, and healthier-looking skin with a professional enzyme treatment designed for home skincare routines.\n\nProfessional Enzyme Care, Inspired by Clinical Treatments. Unlike traditional exfoliating products, this enzyme treatment is activated by mixing the enzyme lotion with the enzyme powder immediately before use, creating a fresh formula for every application. The included silicone brush helps distribute the product evenly across the skin while providing a comfortable massage experience.\n\nWhy You'll Love It:\n• Helps improve the appearance of dull skin\n• Supports smoother-looking skin texture\n• Helps soften the appearance of fine lines\n• Leaves skin feeling refreshed and revitalized\n• Supports a brighter-looking complexion\n• Suitable for regular professional skincare routines\n\nKey Ingredients: Papain (Protease) - A natural enzyme extracted from papaya. Superoxide Dismutase (SOD) - A powerful antioxidant. Niacinamide - Helps improve uneven skin tone and supports the skin barrier.\n\nWhat's Inside: Each order includes 2 Complete Treatment Kits. Each kit contains Active Protease Lotion (10g), Active Protease Powder (5g), Silicone Application Brush.\n\nRecommended Frequency: Use once a week during the initial care period. Once your skin reaches a visibly improved and balanced condition, the treatment can be reduced to once every two weeks for maintenance.\n\nSuitable For: Dull appearance, Uneven skin texture, Dryness, Lack of radiance, Early visible signs of aging.",
    ingredients: "Papain (Protease), Superoxide Dismutase (SOD), Niacinamide",
    howToUse: "1. Cleanse your face. 2. Mix one bottle of lotion with one bottle of powder. 3. Apply evenly with the silicone brush. 4. Leave on for 10-20 minutes. 5. Rinse thoroughly. Apply a medical-grade recovery mask or a hydrating sheet mask immediately after the treatment. Avoid masks containing exfoliating acids or other intensive active ingredients.\n\nFor a complete post-treatment skincare routine, we recommend pairing with BELOYAN Copper Peptide Repair Freeze-Dried Powder and BELOYAN Rose Brightening Fermented Mask. These products are designed to complement the enzyme treatment and help maintain skin hydration and comfort after use.",
    price: 78, comparePrice: 98, category: "TREATMENT",
    skinConcerns: ["AGING", "DRYNESS"], badge: "NEW",
    rating: 4.9, reviewsCount: 568, size: "2 Kits (10g + 5g each) / 1 Month Supply",
    images: ["/images/protease/main.png", "/images/protease/inside.png", "/images/protease/banner.png", "/images/protease/ingredients.png"],
    isActive: true, sortOrder: 1,
    variants: [{ id: "v12", name: "1 Month Supply", size: "2 Kits", price: 78, sku: "APK-001", stock: 50 }],
  },
  {
    id: "2", slug: "dna-sodium-firming-v-face-spray",
    name: "DNA Sodium Instant Firming V-Face Spray",
    tagline: "Ultra-fine mist with instant firming, 4-week skin renewal",
    description: "Reveal a Firmer, Younger-Looking Contour in Seconds. Aging begins when skin gradually loses collagen, elasticity, and moisture, causing visible signs of sagging, fine lines, and loss of facial definition. Starting from your mid-20s, proactive firming care can help maintain a smoother, tighter-looking complexion. Powered by DNA Sodium active technology, BELOYAN Instant Firming Anti-Wrinkle Spray delivers ultra-fine active molecules that absorb quickly into the skin, helping improve hydration, firmness, and the appearance of facial contours. Your daily defense against visible aging for a lifted, refreshed, youthful-looking V-face.\n\n4-Week Skin Firming Journey:\n• 10 Seconds - Instant Firming Effect: Experience an immediate sensation of tighter, smoother, more elastic-looking skin.\n• 7 Days - Smoother Fine Lines: Deep hydration helps improve skin plumpness and reduce the appearance of dryness-related fine lines.\n• 14 Days - Revitalize Aging Skin: Helps support skin renewal and collagen-supporting processes.\n• 28 Days - Defined V-Face Contour: Skin appears firmer, smoother, and more sculpted with enhanced facial definition.\n\nAdvanced Micro-Active Absorption Technology delivers ultra-fine active molecules that penetrate quickly and evenly, delivering lightweight hydration without a heavy or sticky feeling. Suitable for daily anti-aging care, comfortable before and after makeup.",
    ingredients: "DNA Sodium, Hyaluronic Acid, Acetyl Hexapeptide-8, Glycerin, Panthenol, Aloe Vera",
    howToUse: "Daily Skincare: Mist evenly onto clean skin after cleansing. Gently pat until absorbed. Before Makeup: Use before foundation to create a hydrated, smoother-looking base. After Makeup: Lightly mist over makeup for a refreshed, radiant finish. Night Repair: Apply before bedtime as part of your evening anti-aging routine. Intensive Care: Can be combined with professional skincare treatments or beauty programs to enhance hydration and firming care.",
    price: 48, comparePrice: null, category: "SPRAY",
    skinConcerns: ["AGING", "DRYNESS"], badge: "NEW",
    rating: 4.7, reviewsCount: 342, size: "80ml / 2.7 fl oz",
    images: ["/images/firming-spray/main.png", "/images/firming-spray/intro.png", "/images/firming-spray/effect.png", "/images/firming-spray/compare1.png", "/images/firming-spray/compare2.png", "/images/firming-spray/tech.png", "/images/firming-spray/aging.png"],
    isActive: true, sortOrder: 2,
    variants: [{ id: "v13", name: "Standard", size: "80ml / 2.7 fl oz", price: 48, sku: "DFS-080", stock: 60 }],
  },
  {
    id: "3", slug: "rose-brightening-fermented-mask",
    name: "Rose Brightening Fermented Mask",
    tagline: "Fermented rose mask for radiant, dewy skin",
    description: "A fermented rose mask that brightens and revitalizes dull-looking skin. Fermentation process unlocks concentrated antioxidants and nutrients. Helps improve uneven tone and delivers deep hydration for a radiant, dewy complexion.",
    ingredients: "Rosa Damascena Flower Extract, Fermented Yeast Extract, Niacinamide, Hyaluronic Acid, Vitamin C, Squalane, Ceramide NP",
    howToUse: "After cleansing, apply an even layer to face (avoid eye area). Leave on for 15-20 minutes. Rinse with lukewarm water. Use 2-3 times per week.",
    price: 38, comparePrice: 48, category: "MASK",
    skinConcerns: ["DRYNESS", "PIGMENTATION"], badge: "NEW",
    rating: 4.8, reviewsCount: 215, size: "100g / 3.53 oz",
    images: ["/images/rose-mask/main.png", "/images/rose-mask/detail1.png", "/images/rose-mask/detail2.png", "/images/rose-mask/detail3.png", "/images/rose-mask/detail4.png", "/images/rose-mask/detail5.png", "/images/rose-mask/detail6.png", "/images/rose-mask/detail7.png", "/images/rose-mask/detail8.png", "/images/rose-mask/detail9.png", "/images/rose-mask/detail10.png", "/images/rose-mask/detail11.jpg"],
    isActive: true, sortOrder: 3,
    variants: [{ id: "v14", name: "Standard", size: "100g / 3.53 oz", price: 38, sku: "RBF-100", stock: 40 }],
  },
];

export function getProductBySlug(slug: string): ProductData | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug && p.isActive);
}

export function getAllSlugs(): string[] {
  return ALL_PRODUCTS.filter((p) => p.isActive).map((p) => p.slug);
}

export function getProductsByCategory(category: ProductData["category"]): ProductData[] {
  return ALL_PRODUCTS.filter((p) => p.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProductsBySkinConcern(concern: ProductData["skinConcerns"][number]): ProductData[] {
  return ALL_PRODUCTS.filter((p) => p.skinConcerns.includes(concern)).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getRelatedProducts(slug: string, limit = 4): ProductData[] {
  const product = getProductBySlug(slug);
  if (!product) return [];
  return ALL_PRODUCTS.filter((p) => p.slug !== slug && (p.category === product.category || p.skinConcerns.some((s) => product.skinConcerns.includes(s)))).slice(0, limit);
}

export function formatPrice(price: number): string {
  return "$" + price.toFixed(2);
}