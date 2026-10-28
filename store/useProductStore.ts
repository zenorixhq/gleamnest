import { create } from "zustand";
import { Product } from "@/types/store";

// Automatically liberate browser localStorage quota from legacy bloated product cache
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("gleamnest_products_catalog");
  } catch (e) {
    // Ignore if localStorage unavailable
  }
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (id: string, updateData: any) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
}

const getInitialCachedProducts = (): Product[] => {
  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem("gleamnest_cached_products");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return [];
};

const initialCached = getInitialCachedProducts();

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initialCached,
  isLoading: false,
  hasLoaded: initialCached.length > 0,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        set({ products: data, hasLoaded: true, isLoading: false });
        try {
          sessionStorage.setItem("gleamnest_cached_products", JSON.stringify(data));
        } catch (e) {}
      } else {
        set({ hasLoaded: true, isLoading: false });
      }
    } catch (err: any) {
      console.error("fetchProducts error:", err);
      set({ error: err.message, isLoading: false, hasLoaded: true });
    }
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
      // Prepend newly created product to state
      set((state) => {
        const nextProducts = [createdProduct, ...state.products.filter((p) => p.id !== createdProduct.id)];
        try {
          sessionStorage.setItem("gleamnest_cached_products", JSON.stringify(nextProducts));
        } catch (e) {}
        return { products: nextProducts, isLoading: false };
      });

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
      set((state) => {
        const nextProducts = state.products.map((p) => (p.id === id ? { ...p, ...updated } : p));
        try {
          sessionStorage.setItem("gleamnest_cached_products", JSON.stringify(nextProducts));
        } catch (e) {}
        return { products: nextProducts, isLoading: false };
      });

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

      set((state) => {
        const nextProducts = state.products.filter((p) => p.id !== id);
        try {
          sessionStorage.setItem("gleamnest_cached_products", JSON.stringify(nextProducts));
        } catch (e) {}
        return { products: nextProducts, isLoading: false };
      });

      return true;
    } catch (err: any) {
      console.error("deleteProduct error:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  getProductBySlug: (slug: string) => {
    return get().products.find((p) => p.slug === slug);
  },
}));
