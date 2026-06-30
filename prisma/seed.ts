import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  
  // Create admin user if not exists
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: "admin@enzymeskincare.com" } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: { email: "admin@enzymeskincare.com", name: "管理员", passwordHash: "admin123", role: "admin" },
    });
    console.log("Admin user created: admin@enzymeskincare.com / admin123");
  }

  console.log("Seeding database...");

  // ── Products ──
  const cleanser = await prisma.product.upsert({
    where: { slug: "enzyme-cleansing-balm" },
    update: {},
    create: {
      slug: "enzyme-cleansing-balm",
      name: "Enzyme Cleansing Balm",
      tagline: "Gentle daily cleanse that respects your skin barrier",
      description:
        "A nutrient-rich cleansing balm infused with papaya enzymes to gently dissolve impurities, makeup, and excess oil without stripping the skin. Suitable for all skin types, including sensitive and acne-prone.",
      ingredients:
        "Papain (Papaya Enzyme), Moringa Oil, Vitamin E, Jojoba Esters, Green Tea Extract, Aloe Vera",
      howToUse:
        "Scoop a small amount and massage onto dry skin. Add water to emulsify, then rinse thoroughly. Use morning and evening.",
      price: 42.0,
      comparePrice: 48.0,
      category: "cleansers",
      skinConcerns: ["acne", "aging", "pigmentation"],
      badge: "best-seller",
      rating: 4.8,
      reviewsCount: 124,
      size: "100ml / 3.4 fl oz",
      images: [
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800",
      ],
      isActive: true,
    },
  });

  const serum = await prisma.product.upsert({
    where: { slug: "enzyme-repair-serum" },
    update: {},
    create: {
      slug: "enzyme-repair-serum",
      name: "Enzyme Repair Serum",
      tagline: "Advanced enzymatic renewal for radiant, youthful skin",
      description:
        "A concentrated serum powered by bromelain and pumpkin enzymes to accelerate cellular turnover, reduce hyperpigmentation, and improve skin texture. Clinically tested for visible results within 28 days.",
      ingredients:
        "Bromelain (Pineapple Enzyme), Pumpkin Enzyme, Hyaluronic Acid, Niacinamide, Peptide Complex, Vitamin C",
      howToUse:
        "Apply 3-4 drops to clean, damp skin. Gently press into face and neck. Follow with moisturizer. Use AM and PM.",
      price: 78.0,
      comparePrice: null,
      category: "serums",
      skinConcerns: ["aging", "pigmentation"],
      badge: "new",
      rating: 4.6,
      reviewsCount: 89,
      size: "30ml / 1.0 fl oz",
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
        "https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800",
      ],
      isActive: true,
    },
  });

  const moisturizer = await prisma.product.upsert({
    where: { slug: "enzyme-barrier-moisturizer" },
    update: {},
    create: {
      slug: "enzyme-barrier-moisturizer",
      name: "Enzyme Barrier Moisturizer",
      tagline: "Deep hydration that strengthens your skin's natural defenses",
      description:
        "A rich, velvety moisturizer that combines enzyme technology with ceramides to reinforce the skin barrier while providing lasting hydration. The result is softer, smoother, and more resilient skin.",
      ingredients:
        "Lactobacillus Ferment, Ceramides NP/AP/EOP, Squalane, Shea Butter, Oat Extract, Panthenol",
      howToUse:
        "After serum, apply a pea-sized amount to face and neck in upward strokes. Use AM and PM.",
      price: 58.0,
      comparePrice: 65.0,
      category: "moisturizers",
      skinConcerns: ["aging", "acne"],
      badge: null,
      rating: 4.7,
      reviewsCount: 156,
      size: "50ml / 1.7 fl oz",
      images: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800",
      ],
      isActive: true,
    },
  });

  // ── Blog Categories ──
  const skincareScience = await prisma.blogCategory.upsert({
    where: { slug: "skincare-science" },
    update: {},
    create: {
      slug: "skincare-science",
      name: "Skincare Science",
      description: "Deep dives into the science behind enzyme skincare",
    },
  });

  const routines = await prisma.blogCategory.upsert({
    where: { slug: "routines" },
    update: {},
    create: {
      slug: "routines",
      name: "Routines & Tips",
      description: "Daily skincare routines and expert tips",
    },
  });

  const ingredients = await prisma.blogCategory.upsert({
    where: { slug: "ingredients" },
    update: {},
    create: {
      slug: "ingredients",
      name: "Ingredients Decoded",
      description: "Understanding what goes into your skincare products",
    },
  });

  // ── Blog Posts ──
  await prisma.blogPost.upsert({
    where: { slug: "what-are-enzymes-in-skincare" },
    update: {},
    create: {
      slug: "what-are-enzymes-in-skincare",
      title: "What Are Enzymes in Skincare? A Complete Guide",
      excerpt:
        "Enzymes are the gentle giants of exfoliation. Learn how they work differently from acids and why they are ideal for sensitive skin.",
      content:
        "Enzymes are proteins that speed up chemical reactions. In skincare, proteolytic enzymes break down the keratin protein that holds dead skin cells together, allowing them to be gently sloughed away...",
      coverImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
      categorySlug: "skincare-science",
      tags: ["enzymes", "exfoliation", "skincare-science"],
      authorName: "Dr. Sarah Chen",
      readTime: 8,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "morning-routine-for-glowy-skin" },
    update: {},
    create: {
      slug: "morning-routine-for-glowy-skin",
      title: "The Perfect Morning Routine for Glowy, Healthy Skin",
      excerpt:
        "Start your day right with this 5-step enzyme-powered morning skincare routine designed for all skin types.",
      content:
        "A great morning routine sets the tone for your skin all day. Here is our recommended enzyme-powered morning routine...",
      coverImage: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800",
      categorySlug: "routines",
      tags: ["morning-routine", "glow", "tips"],
      authorName: "Enzyme Team",
      readTime: 5,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "hyaluronic-acid-vs-enzymes" },
    update: {},
    create: {
      slug: "hyaluronic-acid-vs-enzymes",
      title: "Hyaluronic Acid vs. Enzymes: Do You Need Both?",
      excerpt:
        "Two powerhouse ingredients, different jobs. Here is why your skin needs both for optimal health.",
      content:
        "Hyaluronic acid and enzymes serve different but complementary roles in skincare. While HA hydrates, enzymes exfoliate and renew...",
      coverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      categorySlug: "ingredients",
      tags: ["hyaluronic-acid", "enzymes", "ingredients"],
      authorName: "Dr. Sarah Chen",
      readTime: 6,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // ── Case Studies ──
  await prisma.caseStudy.upsert({
    where: { slug: "acne-recovery-8-weeks" },
    update: {},
    create: {
      slug: "acne-recovery-8-weeks",
      title: "Acne Recovery: From Breakouts to Clear Skin in 8 Weeks",
      clientName: "Jessica M.",
      skinConcern: ["acne"],
      treatmentDuration: "8 weeks",
      description:
        "Jessica struggled with persistent cystic acne for years. After switching to an enzyme-based routine, her skin showed remarkable improvement in texture and clarity within 8 weeks.",
      beforeImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
      afterImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
    },
  });

  await prisma.caseStudy.upsert({
    where: { slug: "hyperpigmentation-journey" },
    update: {},
    create: {
      slug: "hyperpigmentation-journey",
      title: "Fading Hyperpigmentation: A 12-Week Journey",
      clientName: "Amara K.",
      skinConcern: ["pigmentation"],
      treatmentDuration: "12 weeks",
      description:
        "Amara dealt with post-inflammatory hyperpigmentation from previous breakouts. Our enzyme repair serum combined with consistent use of the cleansing balm helped fade dark spots significantly.",
      beforeImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800",
      afterImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800",
    },
  });

  await prisma.caseStudy.upsert({
    where: { slug: "aging-skin-transformation" },
    update: {},
    create: {
      slug: "aging-skin-transformation",
      title: "Reversing Visible Signs of Aging at 52",
      clientName: "Margaret L.",
      skinConcern: ["aging"],
      treatmentDuration: "16 weeks",
      description:
        "Margaret noticed fine lines, loss of firmness, and dullness. After 16 weeks of our enzyme-powered regimen, her skin regained elasticity and a natural radiance.",
      beforeImage: "https://images.unsplash.com/photo-1615460549969-36fa19521c4d?w=800",
      afterImage: "https://images.unsplash.com/photo-1615460549969-36fa19521c4d?w=800",
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });