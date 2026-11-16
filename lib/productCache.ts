// In-memory cache for live Neon PostgreSQL product catalog
// Kept in sync with live database queries and invalidated on product create/update/delete
let memoryCachedProducts: any[] | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 20 * 1000; // 20-second in-memory SWR cache to prevent database hammering

export function getCachedProducts(): any[] | null {
  if (memoryCachedProducts && Date.now() - lastCacheTimestamp < CACHE_TTL_MS) {
    return memoryCachedProducts;
  }
  return null;
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
