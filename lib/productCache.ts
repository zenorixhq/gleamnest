// In-memory cache for product catalog to eliminate cold Neon PostgreSQL query latency
let memoryCachedProducts: any[] | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function getCachedProducts(): any[] | null {
  if (memoryCachedProducts && Date.now() - lastCacheTimestamp < CACHE_TTL_MS) {
    return memoryCachedProducts;
  }
  return null;
}

export function setCachedProducts(products: any[]) {
  memoryCachedProducts = products;
  lastCacheTimestamp = Date.now();
}

export function invalidateProductsCache() {
  memoryCachedProducts = null;
  lastCacheTimestamp = 0;
}
