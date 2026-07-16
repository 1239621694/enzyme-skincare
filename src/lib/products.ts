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
    name: "ACTIVE PROTEASE ANTI-WRINKLE SKIN REJUVENATION KIT",
    tagline: "Professional Enzyme Brush Treatment",
    description: "Restore the look of smoother, brighter, and healthier-looking skin with a professional enzyme treatment designed for home skincare routines.\n\nProfessional Enzyme Care, Inspired by Clinical Treatments. Unlike traditional exfoliating products, this enzyme treatment is activated by mixing the enzyme lotion with the enzyme powder immediately before use, creating a fresh formula for every application. The included silicone brush helps distribute the product evenly across the skin while providing a comfortable massage experience.\n\nWhy You'll Love It:\n• Helps improve the appearance of dull skin\n• Supports smoother-looking skin texture\n• Helps soften the appearance of fine lines\n• Leaves skin feeling refreshed and revitalized\n• Supports a brighter-looking complexion\n• Suitable for regular professional skincare routines\n\nKey Ingredients: Papain (Protease) - A natural enzyme extracted from papaya. Superoxide Dismutase (SOD) - A powerful antioxidant. Niacinamide - Helps improve uneven skin tone and supports the skin barrier.\n\nWhat's Inside: Each order includes 2 Complete Treatment Kits. Each kit contains Active Protease Lotion (10g), Active Protease Powder (5g), Silicone Application Brush.\n\nRecommended Frequency: Use once a week during the initial care period. Once your skin reaches a visibly improved and balanced condition, the treatment can be reduced to once every two weeks for maintenance.\n\nSuitable For: Dull appearance, Uneven skin texture, Dryness, Lack of radiance, Early visible signs of aging.",
    ingredients: "Papain (Protease), Superoxide Dismutase (SOD), Niacinamide",
    howToUse: "1. Cleanse your face. 2. Mix one bottle of lotion with one bottle of powder. 3. Apply evenly with the silicone brush. 4. Leave on for 10-20 minutes. 5. Rinse thoroughly. Apply a medical-grade recovery mask or a hydrating sheet mask immediately after the treatment. Avoid masks containing exfoliating acids or other intensive active ingredients.\n\nFor a complete post-treatment skincare routine, we recommend pairing with BELOYAN Copper Peptide Repair Freeze-Dried Powder and BELOYAN Rose Brightening Fermented Mask. These products are designed to complement the enzyme treatment and help maintain skin hydration and comfort after use.",
    price: 369, comparePrice: null, category: "TREATMENT",
    skinConcerns: ["AGING", "DRYNESS"], badge: "NEW",
    rating: 4.9, reviewsCount: 568, size: "2 Kits (10g + 5g each) / 1 Month Supply",
    images: ["/images/protease-page/hero.png", "/images/protease-page/problem.png", "/images/protease-page/technology.png", "/images/protease-page/ingredients.png", "/images/protease-page/showcase.png", "/images/protease-page/clinical.png", "/images/protease-page/howtouse.png"],
    isActive: true, sortOrder: 1,
    variants: [{ id: "v12", name: "1 Month Supply", size: "2 Kits", price: 369, sku: "APK-001", stock: 50 }],
  },
  {
    id: "2", slug: "dna-sodium-firming-v-face-spray",
    name: "BELOYAN DNA Sodium Instant Firming V-Face Spray",
    tagline: "Instant Lift · Long-Lasting Firmness · 4-Week Skin Renewal",
    description: "Reveal a Firmer, Younger-Looking Contour in Seconds. Aging begins when skin gradually loses collagen, elasticity, and moisture, causing visible signs of sagging, fine lines, and loss of facial definition. Starting from your mid-20s, proactive firming care can help maintain a smoother, tighter-looking complexion. Powered by DNA Sodium active technology, BELOYAN Instant Firming Anti-Wrinkle Spray delivers ultra-fine active molecules that absorb quickly into the skin, helping improve hydration, firmness, and the appearance of facial contours. Your daily defense against visible aging for a lifted, refreshed, youthful-looking V-face.\n\n4-Week Skin Firming Journey:\n• 10 Seconds - Instant Firming Effect: Experience an immediate sensation of tighter, smoother, more elastic-looking skin.\n• 7 Days - Smoother Fine Lines: Deep hydration helps improve skin plumpness and reduce the appearance of dryness-related fine lines.\n• 14 Days - Revitalize Aging Skin: Helps support skin renewal and collagen-supporting processes.\n• 28 Days - Defined V-Face Contour: Skin appears firmer, smoother, and more sculpted with enhanced facial definition.\n\nAdvanced Micro-Active Absorption Technology delivers ultra-fine active molecules that penetrate quickly and evenly, delivering lightweight hydration without a heavy or sticky feeling. Suitable for daily anti-aging care, comfortable before and after makeup.",
    ingredients: "DNA Sodium, Hyaluronic Acid, Acetyl Hexapeptide-8, Glycerin, Panthenol, Aloe Vera",
    howToUse: "Daily Skincare: Mist evenly onto clean skin after cleansing. Gently pat until absorbed. Before Makeup: Use before foundation to create a hydrated, smoother-looking base. After Makeup: Lightly mist over makeup for a refreshed, radiant finish. Night Repair: Apply before bedtime as part of your evening anti-aging routine. Intensive Care: Can be combined with professional skincare treatments or beauty programs to enhance hydration and firming care.",
    price: 69, comparePrice: null, category: "SPRAY",
    skinConcerns: ["AGING", "DRYNESS"], badge: "NEW",
    rating: 4.7, reviewsCount: 342, size: "80ml / 2.7 fl oz",
    images: ["/images/firming-spray-page/hero.png", "/images/firming-spray-page/problem.png", "/images/firming-spray-page/technology.png", "/images/firming-spray-page/clinical-results.png", "/images/firming-spray-page/transformation.png", "/images/firming-spray-page/before-after.png"],
    isActive: true, sortOrder: 2,
    variants: [{ id: "v13", name: "Standard", size: "80ml / 2.7 fl oz", price: 69, sku: "DFS-080", stock: 60 }],
  },
  {
    id: "3", slug: "rose-brightening-fermented-mask",
    name: "BELOYAN Rose Brightening Fermented Face Mask",
    tagline: "Plant Fermented Mask for Radiant, Dewy Skin",
    description: "A fermented rose mask that brightens and revitalizes dull-looking skin. Fermentation unlocks concentrated antioxidants and nutrients for a radiant, dewy complexion.\n\nSimplified Formula. 4 Key Benefits:\n1 Deep Hydration — Deeply moisturizes, improves dryness\n2 Brightening Effect — Brightens skin tone, improves dullness\n3 Barrier Repair — Repairs and strengthens skin barrier\n4 Gentle & Natural — Plant fermented formula suitable for sensitive skin\n\nRebuild Skin Hydration Barrier: Triple moisture repair from epidermis to deep layers, locking in moisture at every level. Outer lock: Plant oils form a protective film. Mid-layer: Ferment essence carries small-molecule moisture for penetration. Base layer: Rose flower water awakens skin moisture circulation.\n\nBiomembrane Radiance Technology: Uses natural plant fermentation to produce a bioactive membrane that forms a breathable protective layer on the skin surface, helping lock in moisture and active ingredients while giving the skin a naturally radiant glow.\n\nKey Ingredients:\n- Rosa Damascena Flower Extract: Rich in natural flower acids and vitamins, helps brighten skin tone.\n- Tremella & Camellia Ferment: Small-molecule fermented nutrition for deep penetration and nourishment.\n- Niacinamide: Improves uneven skin tone, enhances barrier function.\n- Hyaluronic Acid: Deeply hydrates and locks in moisture.\n\nPlant Fermented. Gentle Mask. No alcohol, no artificial colors, no mineral oil. Suitable for all skin types including sensitive skin.",
    ingredients: "Rosa Damascena Flower Extract, Tremella & Camellia Ferment, Niacinamide, Hyaluronic Acid, Vitamin C, Squalane, Ceramide NP, Glycerin, Jojoba Oil",
    howToUse: "Step 1: After cleansing, take an appropriate amount of mask.\nStep 2: Apply evenly to face (avoid eye area).\nStep 3: Leave on for 15-20 minutes.\nStep 4: Remove the mask and gently pat the remaining essence into your skin until fully absorbed. No rinsing required.\n\nRecommended frequency: 2-3 times per week.\n\nNet weight: 25 mL per sheet.\nShelf life: 3 years (unopened).\nStore in cool, dry place away from direct sunlight.",
    price: 79, comparePrice: null, category: "MASK",
    skinConcerns: ["DRYNESS", "PIGMENTATION"], badge: "NEW",
    rating: 4.8, reviewsCount: 215, size: "8 Sheets",
    images: ["/images/rose-mask/01-hero.png", "/images/rose-mask/02-skin-concerns.png", "/images/rose-mask/03-benefits.png", "/images/rose-mask/04-rose-ingredient.png", "/images/rose-mask/05-ferment-ingredient.png", "/images/rose-mask/06-biomembrane.png", "/images/rose-mask/07-mask-material.png", "/images/rose-mask/08-effectiveness.png", "/images/rose-mask/09-free-from.png", "/images/rose-mask/10-product-info.png", "/images/rose-mask/11-how-to-use.png", "/images/rose-mask/12-packaging.jpg"],
    isActive: true, sortOrder: 3,
    variants: [{ id: "v14", name: "Standard", size: "8 Sheets", price: 79, sku: "RBF-100", stock: 40 }],
  },
  {
    id: "4", slug: "blue-copper-peptide-freeze-dried-powder-set",
    name: "BELOYAN Blue Copper Peptide Repair & Anti-Wrinkle Freeze-Dried Powder Set",
    tagline: "Repair. Firm. Restore. — A professional two-part peptide freeze-dried treatment",
    description: "A professional two-part freeze-dried powder treatment powered by Blue Copper Peptide and advanced peptide technology to support barrier repair, firmness, hydration and smoother-looking skin.\n\nPowered by Copper Tripeptide-1 and an advanced CUPEP peptide delivery system, the formula activates fresh before use and absorbs quickly into skin with a lightweight blue essence texture.\n\nFresh Activation for Maximum Potency: Each treatment combines freeze-dried peptide powder with activating essence immediately before use, helping preserve ingredient freshness until the moment of application.\n\nExclusive CUPEP Peptide Delivery Technology helps Copper Peptides absorb quickly while supporting a smoother, more resilient, healthier-looking complexion.\n\nHero Ingredients:\n- Copper Tripeptide-1: Supports skin renewal and barrier care.\n- Oligopeptide-1: Helps maintain smoother-looking skin.\n- Acetyl Hexapeptide-8: Helps soften the appearance of expression lines.\n- Collagen: Supports hydration and skin comfort.\n- Beta-Glucan: Helps calm dry, stressed skin.\n- Gentian Root Extract: Helps soothe and refresh the skin.\n\nVisible Benefits With Continued Use: Barrier support, Skin comfort, Hydration, Healthy glow.\n\nClean Gentle Formula: Alcohol Free, Mineral Oil Free, Artificial Fragrance Free, Harsh Preservative Free.",
    ingredients: "Copper Tripeptide-1, Oligopeptide-1, Acetyl Hexapeptide-8, Collagen, Beta-Glucan, Gentian Root Extract, Serum Protein, Hyaluronic Acid",
    howToUse: "Step 1: Open one freeze-dried powder vial and one activating solution vial. Step 2: Pour the activating solution into the freeze-dried powder vial. Step 3: Shake gently until the powder is fully dissolved. Step 4: Apply the freshly mixed solution evenly to clean skin. Step 5: Gently pat or massage until fully absorbed. Step 6: Continue with moisturizer or a hydrating recovery mask if desired.",
    price: 149, comparePrice: null, category: "TREATMENT",
    skinConcerns: ["SENSITIVITY", "AGING", "DRYNESS"], badge: "NEW",
    rating: 4.8, reviewsCount: 178, size: "10 Sets/Box (60mg + 3ml each)",
    images: ["/images/copper-peptide-blue/01-Hero-main.png", "/images/copper-peptide-blue/02-Skin-concerns.png", "/images/copper-peptide-blue/03-Product-benefits.png", "/images/copper-peptide-blue/04-Fresh-Lock-Technology.png", "/images/copper-peptide-blue/05-Key-Ingredients.png", "/images/copper-peptide-blue/06-Ingredient-Functions.png", "/images/copper-peptide-blue/07-Dual-Bottle-System.png", "/images/copper-peptide-blue/08-Effectiveness-Results.png", "/images/copper-peptide-blue/09-Product-Details.png", "/images/copper-peptide-blue/10-Free-From-Formula.png", "/images/copper-peptide-blue/11-Patents-and-Quality.png"],
    isActive: true, sortOrder: 4,
    variants: [{ id: "v15", name: "Standard Box", size: "10 Sets", price: 149, sku: "CPR-010", stock: 35 }],
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