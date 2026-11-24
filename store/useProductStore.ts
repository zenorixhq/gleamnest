import { create } from "zustand";
import { Product } from "@/types/store";
import { products as fallbackProducts } from "@/data/mockData";

const STORAGE_KEY = "noomis_catalog_live_v17";

// Auto-purge obsolete and legacy catalog cache keys from previous versions
if (typeof window !== "undefined") {
  try {
    for (let i = 1; i <= 16; i++) {
      localStorage.removeItem(`noomis_catalog_live_v${i}`);
      sessionStorage.removeItem(`noomis_catalog_live_v${i}`);
      localStorage.removeItem(`noomis_products_catalog_v${i}`);
      sessionStorage.removeItem(`noomis_products_catalog_v${i}`);
    }
  } catch (e) {}
}

function getInitialProducts(): { products: Product[]; hasLoaded: boolean } {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 100) {
          const isStale = parsed.some(
            (p: any) =>
              p.slug === "imperial-emerald-cuban-pendant" ||
              p.title === "Statement Ring" ||
              p.slug === "statement-ring" ||
              p.title === "Imperial Emerald & Gold Cuban Pendant" ||
              p.slug === "r1" ||
              p.title === "R1" ||
              p.id === "cmwkem55i0000l00843c62qpz"
          );
          if (!isStale) {
            return { products: parsed, hasLoaded: true };
          }
        }
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }
  return { products: fallbackProducts, hasLoaded: true };
}

function persistProducts(prods: Product[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prods));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prods));
    } catch (e) {}
  }
}

interface ProductStore {
  products: Product[];
  signatureCoutureIds: string[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;

  // Actions
  fetchProducts: (forceFresh?: boolean) => Promise<void>;
  fetchSignatureCouture: () => Promise<string[]>;
  setSignatureCoutureIds: (ids: string[]) => Promise<boolean>;
  toggleSignatureCoutureProduct: (productId: string) => Promise<boolean>;
  addProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (id: string, updateData: any) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
}

const initial = getInitialProducts();
let lastCatalogFetchTime = 0;
const CLIENT_FETCH_COOLDOWN = 60 * 1000; // 60s cooldown prevents redundant origin calls on navigation

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initial.products,
  signatureCoutureIds: [],
  isLoading: false,
  hasLoaded: true,
  error: null,

  fetchProducts: async (forceFresh = false) => {
    try {
      // In client session: if already loaded catalog, throttle background re-fetches to save origin bandwidth
      if (
        !forceFresh &&
        get().products.length >= 50 &&
        Date.now() - lastCatalogFetchTime < CLIENT_FETCH_COOLDOWN
      ) {
        return;
      }
      lastCatalogFetchTime = Date.now();

      const currentProducts = get().products;
      if (!currentProducts || currentProducts.length === 0) {
        set({ isLoading: true });
      }

      // Storefront traffic uses standard Edge CDN caching; admin forces fresh DB
      const url = forceFresh ? `/api/products?t=${Date.now()}&fresh=true` : "/api/products";
      const res = await fetch(url, forceFresh ? { cache: "no-store" } : undefined);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Protect against accidental downgrade: if incoming data is suspiciously small (< 50) and current catalog is full, preserve current state
        const currentCount = get().products?.length || 0;
        if (!forceFresh && currentCount > 50 && data.length < 50) {
          console.warn(`Preserving larger catalog (${currentCount} > ${data.length})`);
          set({ hasLoaded: true, isLoading: false });
          return;
        }
        set({ products: data, hasLoaded: true, isLoading: false, error: null });
        persistProducts(data);
      } else {
        set({ hasLoaded: true, isLoading: false });
      }
    } catch (err: any) {
      console.warn("fetchProducts note, maintaining catalog:", err.message);
      set({ hasLoaded: true, isLoading: false });
    }
  },

  fetchSignatureCouture: async () => {
    try {
      const res = await fetch("/api/signature-couture");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.productIds)) {
          set({ signatureCoutureIds: data.productIds });
          return data.productIds;
        }
      }
    } catch (e) {
      console.warn("Error fetching signature couture:", e);
    }
    return get().signatureCoutureIds;
  },

  setSignatureCoutureIds: async (ids: string[]) => {
    try {
      set({ signatureCoutureIds: ids });
      const res = await fetch("/api/signature-couture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: ids }),
      });
      if (res.ok) {
        const idSet = new Set(ids);
        const updated = get().products.map((p) => ({
          ...p,
          inSignatureCouture: idSet.has(p.id) || idSet.has(p.slug),
        }));
        set({ products: updated });
        persistProducts(updated);
        return true;
      }
    } catch (e) {
      console.error("setSignatureCoutureIds error:", e);
    }
    return false;
  },

  toggleSignatureCoutureProduct: async (productId: string) => {
    const current = get().signatureCoutureIds;
    const exists = current.includes(productId);
    const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
    return get().setSignatureCoutureIds(next);
  },

  addProduct: async (productData: any) => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create product");
      }

      const createdProduct = await res.json();
      const updatedProducts = [
        createdProduct,
        ...get().products.filter((p) => p.id !== createdProduct.id && p.slug !== createdProduct.slug),
      ];
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      // If createdProduct has inSignatureCouture, add to signature list
      if (productData.inSignatureCouture && createdProduct.id) {
        const currentSig = get().signatureCoutureIds;
        if (!currentSig.includes(createdProduct.id)) {
          get().setSignatureCoutureIds([createdProduct.id, ...currentSig]);
        }
      }

      return createdProduct;
    } catch (err: any) {
      console.error("addProduct error:", err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id: string, updateData: any) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update product");
      }

      const updated = await res.json();
      const updatedProducts = get().products.map((p) => (p.id === id ? { ...p, ...updated } : p));
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return updated;
    } catch (err: any) {
      console.error("updateProduct error:", err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      const updatedProducts = get().products.filter((p) => p.id !== id);
      const updatedSig = get().signatureCoutureIds.filter((sigId) => sigId !== id);
      set({ products: updatedProducts, signatureCoutureIds: updatedSig, isLoading: false });
      persistProducts(updatedProducts);

      return true;
    } catch (err: any) {
      console.error("deleteProduct error:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  getProductBySlug: (slug: string) => {
    if (!slug) return undefined;
    const decoded = decodeURIComponent(slug).trim().toLowerCase();
    return get().products.find(
      (p) =>
        (p.slug && p.slug.trim().toLowerCase() === decoded) ||
        (p.id && p.id.trim().toLowerCase() === decoded) ||
        (p.title && p.title.trim().toLowerCase() === decoded)
    );
  },
}));
