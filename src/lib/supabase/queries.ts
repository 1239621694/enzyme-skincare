import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ── Products ──

export interface ProductFilters {
  category?: string;
  skinConcern?: string;
  badge?: string;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  offset?: number;
  search?: string;
}

export async function getProducts(filters?: ProductFilters) {
  const where: Prisma.ProductWhereInput = { isActive: true };
  const orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  if (filters?.category) where.category = filters.category;
  if (filters?.badge) where.badge = filters.badge;
  if (filters?.skinConcern) where.skinConcerns = { has: filters.skinConcern };
  if (filters?.priceMin !== undefined) where.price = { gte: filters.priceMin };
  if (filters?.priceMax !== undefined) {
    where.price = { ...(where.price as any), lte: filters.priceMax };
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { tagline: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const limit = filters?.limit ?? 50;
  const offset = filters?.offset ?? 0;

  const [products, count] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: limit, skip: offset }),
    prisma.product.count({ where }),
  ]);

  return { products, count };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) throw new Error("Product not found");
  return product;
}

export async function getRelatedProducts(productId: string, category: string) {
  return prisma.product.findMany({
    where: { category, id: { not: productId }, isActive: true },
    take: 4,
  });
}

export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tagline: { contains: query, mode: "insensitive" } },
        { ingredients: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 20,
  });
}

// ── Reviews ──

export async function getReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId: productId, isApproved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReview(data: {
  productId: string;
  userName: string;
  rating: number;
  title?: string;
  body?: string;
  skinType?: string;
}) {
  return prisma.review.create({
    data: {
      productId: data.productId,
      userName: data.userName,
      rating: data.rating,
      title: data.title,
      body: data.body,
      skinType: data.skinType,
      isApproved: false,
      verifiedPurchase: false,
    },
  });
}

// ── Case Studies ──

export async function getCaseStudies() {
  const cases = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
    include: { productsUsed: { include: { product: true } } },
  });
  return cases.map((c) => ({
    ...c,
    products_used: c.productsUsed.map((pu) => pu.product),
  }));
}

export async function getCaseStudyBySlug(slug: string) {
  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
    include: { productsUsed: { include: { product: true } } },
  });
  if (!caseStudy) throw new Error("Case study not found");
  return { ...caseStudy, products_used: caseStudy.productsUsed.map((pu) => pu.product) };
}

// ── Blog ──

export async function getBlogCategories() {
  return prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
}

export async function getBlogPosts(categorySlug?: string, page = 1, limit = 12) {
  const where: Prisma.BlogPostWhereInput = { isPublished: true };
  if (categorySlug) where.categorySlug = categorySlug;

  const [posts, count] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, count };
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) throw new Error("Blog post not found");
  return post;
}

// ── Contact / Subscribers ──

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return prisma.contactMessage.create({ data });
}

export async function subscribeEmail(email: string) {
  return prisma.subscriber.upsert({
    where: { email },
    update: { isActive: true },
    create: { email },
  });
}

// ── Consultations ──

export async function createConsultation(data: {
  name: string;
  email: string;
  phone?: string;
  consultation_type?: string;
  skin_type?: string;
  skin_concerns: string[];
  allergies?: string;
  notes?: string;
}) {
  return prisma.consultation.create({ data });
}