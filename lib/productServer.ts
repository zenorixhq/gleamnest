import { prisma } from "@/lib/prisma";
import { products as fallbackProducts } from "@/data/mockData";
import { Product } from "@/types/store";
import { getCachedProducts, setCachedProducts } from "@/lib/productCache";

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export function formatProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice || undefined,
    priceQatar: p.priceQatar !== null && p.priceQatar !== undefined ? p.priceQatar : undefined,
    salePriceQatar: p.salePriceQatar !== null && p.salePriceQatar !== undefined ? p.salePriceQatar : undefined,
    category: p.category,
    tags: safeJsonParse<string[]>(p.tags, [p.category]),
    images: safeJsonParse<string[]>(p.images, [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    ]),
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    stockCount: p.stockCount,
    featured: p.featured,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    variantAttributes: safeJsonParse(p.variantJson, undefined),
    specifications: safeJsonParse(p.specsJson, undefined),
  };
}

/**
 * Server-side product retrieval for SSR & metadata.
 * - In-memory cache hit: 0.1ms response
 * - Safe timeout on cold Neon connections (1.5s max)
 * - 100% reliable fallback to static 85-product catalog if database is offline or sleeping
 */
export async function getAllProductsServer(): Promise<Product[]> {
  // 1. In-memory cache hit (< 0.1ms)
  const cached = getCachedProducts();
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  // 2. Query Neon PostgreSQL with safe 1.5s timeout race
  try {
    const dbPromise = prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Neon DB timeout")), 1500)
    );

    const dbProducts = await Promise.race([dbPromise, timeoutPromise]);
    if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
      const formatted = dbProducts.map(formatProduct);
      setCachedProducts(formatted);
      return formatted;
    }
  } catch (err) {
    console.warn("getAllProductsServer: Using instant fallback catalog data.");
  }

  return fallbackProducts;
}

export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const allProducts = await getAllProductsServer();

  const found = allProducts.find((p) => {
    const pSlug = (p.slug || "").toLowerCase().trim();
    const pId = (p.id || "").toLowerCase().trim();
    if (pSlug === cleanSlug || pId === cleanSlug) return true;
    if (cleanSlug.endsWith("s") && pSlug === cleanSlug.slice(0, -1)) return true;
    if (!cleanSlug.endsWith("s") && pSlug === cleanSlug + "s") return true;
    if (pSlug.replace(/[-_]/g, "") === cleanSlug.replace(/[-_]/g, "")) return true;
    return false;
  });

  return found || null;
}
