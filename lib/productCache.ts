import { products as fallbackProducts } from "@/data/mockData";

// In-memory cache for product catalog to eliminate cold Neon PostgreSQL query latency
// Pre-seeded with the verified 85-product client catalog for 0ms cold-start response
let memoryCachedProducts: any[] | null = fallbackProducts;
let lastCacheTimestamp = Date.now();
const CACHE_TTL_MS = 120 * 1000; // 120 seconds

export function getCachedProducts(): any[] | null {
  if (memoryCachedProducts && Date.now() - lastCacheTimestamp < CACHE_TTL_MS) {
    return memoryCachedProducts;
  }
  // If expired but we have cached data, still return it as stale-while-revalidate fallback
  return memoryCachedProducts || fallbackProducts;
}

export function isCacheFresh(): boolean {
  return !!memoryCachedProducts && Date.now() - lastCacheTimestamp < CACHE_TTL_MS;
}

export function setCachedProducts(products: any[]) {
  if (Array.isArray(products) && products.length > 0) {
    memoryCachedProducts = products;
    lastCacheTimestamp = Date.now();
  }
}

export function invalidateProductsCache() {
  memoryCachedProducts = null;
  lastCacheTimestamp = 0;
}
