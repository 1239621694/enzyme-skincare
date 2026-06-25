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
  category: "CLEANSER" | "SERUM" | "MOISTURIZER" | "SUNSCREEN" | "MASK" | "SET" | "BODY";
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
    id: "1", slug: "gentle-amino-acid-cleanser",
    name: "Gentle Amino Acid Cleanser",
    tagline: "A gentle, non-stripping cleanser for all skin types",
    description: "Formulated with amino acid surfactants, this cleanser removes impurities without disrupting the skin barrier. The enzyme complex provides gentle exfoliation while maintaining your skin natural pH balance.",
    ingredients: "Water (Aqua), Sodium Cocoyl Glycinate, Glycerin, Papain (Papaya Enzyme), Bromelain, Aloe Barbadensis Leaf Juice, Camellia Sinensis Leaf Extract, Panthenol, Allantoin, Sodium Hyaluronate",
    howToUse: "AM/PM: Apply 1-2 pumps to damp skin. Massage gently for 30 seconds. Rinse thoroughly with lukewarm water. Follow with serum and moisturizer.",
    price: 32, comparePrice: null, category: "CLEANSER",
    skinConcerns: ["ACNE", "SENSITIVITY", "DRYNESS"], badge: "BEST_SELLER",
    rating: 4.9, reviewsCount: 1286, size: "120ml / 4.0 fl oz",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop","https://images.unsplash.com/photo-1556228720-195a718a39c7?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 1,
    variants: [{ id: "v1", name: "Standard", size: "120ml / 4.0 fl oz", price: 32, sku: "GAC-120", stock: 100 }],
  },
  {
    id: "2", slug: "enzyme-clarifying-serum",
    name: "Enzyme Clarifying Serum",
    tagline: "2% Salicylic Acid + Enzyme Complex for clear, smooth skin",
    description: "Our signature enzyme serum combines 2% salicylic acid with papaya and bromelain enzymes to clear pores, reduce breakouts, and refine texture without irritation.",
    ingredients: "Water (Aqua), Salicylic Acid (2%), Papain, Bromelain, Niacinamide, Zinc PCA, Glycerin, Hyaluronic Acid, Green Tea Extract, Licorice Root Extract",
    howToUse: "PM only: After cleansing, apply 2-3 drops to face, avoiding eye area. Start 3x/week, increase to nightly as tolerated. Always follow with moisturizer and SPF in the AM.",
    price: 42, comparePrice: 54, category: "SERUM",
    skinConcerns: ["ACNE", "PIGMENTATION"], badge: "SALE",
    rating: 4.8, reviewsCount: 2341, size: "30ml / 1.0 fl oz",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop","https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 2,
    variants: [{ id: "v2", name: "Standard", size: "30ml / 1.0 fl oz", price: 42, sku: "ECS-030", stock: 75 }],
  },
  {
    id: "3", slug: "hyaluronic-moisture-cream",
    name: "Hyaluronic Acid Moisture Cream",
    tagline: "Triple-weight Hyaluronic Acid for 72-hour hydration",
    description: "A rich yet fast-absorbing cream that delivers multi-depth hydration. Ceramides and peptides repair the barrier while hyaluronic acid plumps and smooths.",
    ingredients: "Water (Aqua), Sodium Hyaluronate, Ceramide NP, Ceramide AP, Ceramide EOP, Papain, Peptide Complex, Squalane, Shea Butter, Jojoba Oil",
    howToUse: "AM/PM: After serum, apply a pea-sized amount to face and neck. Gently press into skin until absorbed.",
    price: 46, comparePrice: null, category: "MOISTURIZER",
    skinConcerns: ["DRYNESS", "AGING", "SENSITIVITY"], badge: null,
    rating: 4.9, reviewsCount: 987, size: "50g / 1.76 oz",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800&h=800&fit=crop","https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 3,
    variants: [{ id: "v3", name: "Standard", size: "50g / 1.76 oz", price: 46, sku: "HMC-050", stock: 60 }],
  },
  {
    id: "4", slug: "enzyme-exfoliating-mask",
    name: "Enzyme Exfoliating Mask",
    tagline: "Fruit enzyme mask for instant glow and smooth texture",
    description: "A 10-minute treatment mask powered by papaya and pineapple enzymes that gently dissolve dead skin cells, unclog pores, and reveal brighter skin. Use weekly for a spa-grade facial at home.",
    ingredients: "Water (Aqua), Kaolin Clay, Papain, Bromelain, Glycerin, Aloe Barbadensis Leaf Juice, Green Tea Extract, Chamomile Extract, Allantoin, Vitamin E",
    howToUse: "1-2x per week: Apply an even layer to clean, dry skin. Leave on for 10 minutes. Rinse with lukewarm water. Follow with serum and moisturizer.",
    price: 38, comparePrice: null, category: "MASK",
    skinConcerns: ["ACNE", "PIGMENTATION", "DRYNESS"], badge: "NEW",
    rating: 4.7, reviewsCount: 456, size: "75ml / 2.5 fl oz",
    images: ["https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 4,
    variants: [{ id: "v4", name: "Standard", size: "75ml / 2.5 fl oz", price: 38, sku: "EEM-075", stock: 50 }],
  },
  {
    id: "5", slug: "brightening-vitamin-c-serum",
    name: "Brightening Vitamin C Serum",
    tagline: "15% L-Ascorbic Acid + Enzymes for radiant, even-toned skin",
    description: "A potent antioxidant serum combining 15% vitamin C with papaya enzymes to brighten dark spots, even skin tone, and protect against environmental damage.",
    ingredients: "Water (Aqua), L-Ascorbic Acid (15%), Papain, Ferulic Acid, Vitamin E, Glycerin, Hyaluronic Acid, Aloe Vera, Licorice Root Extract",
    howToUse: "AM: After cleansing, apply 3-4 drops to face and neck. Always follow with moisturizer and SPF 30+.",
    price: 48, comparePrice: 58, category: "SERUM",
    skinConcerns: ["PIGMENTATION", "AGING"], badge: "SALE",
    rating: 4.8, reviewsCount: 1823, size: "30ml / 1.0 fl oz",
    images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 5,
    variants: [{ id: "v5", name: "Standard", size: "30ml / 1.0 fl oz", price: 48, sku: "VCS-030", stock: 80 }],
  },
  {
    id: "6", slug: "renewal-night-cream",
    name: "Renewal Night Cream",
    tagline: "Overnight enzyme repair cream for cellular renewal",
    description: "A luxurious night cream that works while you sleep. Enzymes accelerate cell turnover, peptides boost collagen production, and shea butter deeply nourishes. Wake up to visibly plumper, smoother skin.",
    ingredients: "Water (Aqua), Shea Butter, Papain, Peptide Complex, Ceramide NP, Niacinamide, Squalane, Jojoba Oil, Rosehip Oil, Vitamin E",
    howToUse: "PM: As the final step of your evening routine, apply a generous layer to face and neck. Massage upward until absorbed.",
    price: 52, comparePrice: null, category: "MOISTURIZER",
    skinConcerns: ["AGING", "DRYNESS"], badge: null,
    rating: 4.9, reviewsCount: 756, size: "50g / 1.76 oz",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 6,
    variants: [{ id: "v6", name: "Standard", size: "50g / 1.76 oz", price: 52, sku: "RNC-050", stock: 40 }],
  },
  {
    id: "7", slug: "daily-defense-sunscreen-spf50",
    name: "Daily Defense Sunscreen SPF 50",
    tagline: "Lightweight mineral sunscreen with skin-nourishing enzymes",
    description: "A weightless, non-greasy mineral sunscreen providing broad-spectrum SPF 50 protection while enzymes brighten and smooth. No white cast, reef-safe, perfect under makeup.",
    ingredients: "Zinc Oxide (20%), Water (Aqua), Glycerin, Papain, Niacinamide, Squalane, Vitamin E, Green Tea Extract, Aloe Vera",
    howToUse: "AM: Apply liberally to face and neck 15 minutes before sun exposure. Reapply every 2 hours when outdoors.",
    price: 36, comparePrice: null, category: "SUNSCREEN",
    skinConcerns: ["AGING", "PIGMENTATION", "SENSITIVITY"], badge: "NEW",
    rating: 4.6, reviewsCount: 312, size: "50ml / 1.7 fl oz",
    images: ["https://images.unsplash.com/photo-1611080627725-ec5dbf11f460?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 7,
    variants: [{ id: "v7", name: "Standard", size: "50ml / 1.7 fl oz", price: 36, sku: "DDS-050", stock: 90 }],
  },
  {
    id: "8", slug: "starter-discovery-kit",
    name: "Starter Discovery Kit",
    tagline: "3 full-size bestsellers at an exclusive bundle price",
    description: "The perfect introduction to enzyme skincare. Includes Gentle Amino Acid Cleanser, Enzyme Clarifying Serum, and Hyaluronic Acid Moisture Cream. Save $20 vs buying individually.",
    ingredients: "See individual products. All dermatologist-tested, cruelty-free, free from parabens, sulfates, and artificial fragrance.",
    howToUse: "AM: Cleanse + Moisturizer + SPF. PM: Cleanse + Serum + Moisturizer. Full instructions included.",
    price: 100, comparePrice: 120, category: "SET",
    skinConcerns: ["ACNE", "DRYNESS", "AGING"], badge: "SALE",
    rating: 5.0, reviewsCount: 689, size: "3 Full-Size Products",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 8,
    variants: [{ id: "v8", name: "3-Piece Set", size: "Full Size", price: 100, sku: "SDK-001", stock: 30 }],
  },
  {
    id: "9", slug: "revitalizing-eye-cream",
    name: "Revitalizing Eye Cream",
    tagline: "Enzyme-powered eye treatment for dark circles and fine lines",
    description: "A targeted eye cream with gentle fruit enzymes, caffeine, and peptides to reduce puffiness, brighten dark circles, and smooth fine lines. Ophthalmologist-tested.",
    ingredients: "Water (Aqua), Glycerin, Caffeine, Papain, Peptide Complex, Hyaluronic Acid, Vitamin K, Arnica Extract, Cucumber Extract, Squalane",
    howToUse: "AM/PM: Using ring finger, gently tap a rice-grain amount around orbital bone. Avoid direct eye contact.",
    price: 44, comparePrice: null, category: "MOISTURIZER",
    skinConcerns: ["AGING", "DRYNESS"], badge: "NEW",
    rating: 4.7, reviewsCount: 234, size: "15ml / 0.5 fl oz",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 9,
    variants: [{ id: "v9", name: "Standard", size: "15ml / 0.5 fl oz", price: 44, sku: "REC-015", stock: 55 }],
  },
  {
    id: "10", slug: "clarifying-enzyme-toner",
    name: "Clarifying Enzyme Toner",
    tagline: "Gentle exfoliating toner with papaya enzymes",
    description: "An alcohol-free toner that balances pH while enzymes gently exfoliate. Witch hazel tightens pores and aloe soothes. The perfect prep step for serum absorption.",
    ingredients: "Water (Aqua), Witch Hazel, Papain, Aloe Barbadensis Leaf Juice, Glycerin, Niacinamide, Panthenol, Allantoin, Chamomile Extract",
    howToUse: "AM/PM: After cleansing, saturate a cotton pad and sweep across face and neck. Do not rinse. Follow with serum and moisturizer.",
    price: 28, comparePrice: null, category: "CLEANSER",
    skinConcerns: ["ACNE", "PIGMENTATION"], badge: null,
    rating: 4.5, reviewsCount: 178, size: "150ml / 5.0 fl oz",
    images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 10,
    variants: [{ id: "v10", name: "Standard", size: "150ml / 5.0 fl oz", price: 28, sku: "CET-150", stock: 70 }],
  },
  {
    id: "11", slug: "body-enzyme-treatment",
    name: "Body Enzyme Treatment",
    tagline: "Full-body enzyme exfoliation for smooth, radiant skin",
    description: "Bring enzyme therapy to your body. Rich treatment cream uses papaya and bromelain enzymes to smooth rough patches, reduce body acne, and restore radiance. Non-greasy formula.",
    ingredients: "Water (Aqua), Shea Butter, Papain, Bromelain, Lactic Acid, Glycerin, Coconut Oil, Aloe Vera, Vitamin E, Chamomile Extract",
    howToUse: "2-3x per week: After showering, apply to damp skin focusing on rough areas. Massage for 1-2 minutes. No rinse needed.",
    price: 34, comparePrice: null, category: "BODY",
    skinConcerns: ["DRYNESS", "ACNE"], badge: null,
    rating: 4.4, reviewsCount: 98, size: "200ml / 6.8 fl oz",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800&h=800&fit=crop"],
    isActive: true, sortOrder: 11,
    variants: [{ id: "v11", name: "Standard", size: "200ml / 6.8 fl oz", price: 34, sku: "BET-200", stock: 45 }],
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