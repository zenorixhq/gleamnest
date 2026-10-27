import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/store";

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

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      hasLoaded: false,
      error: null,

      fetchProducts: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
          if (Array.isArray(data)) {
            set({ products: data, hasLoaded: true, isLoading: false });
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
          set((state) => ({
            products: [createdProduct, ...state.products.filter((p) => p.id !== createdProduct.id)],
            isLoading: false,
          }));

          return createdProduct;
        } catch (err: any) {
          console.error("addProduct error:", err);
          set({ error: err.message, isLoading: false });
          return null;
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
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
            isLoading: false,
          }));

          return updated;
        } catch (err: any) {
          console.error("updateProduct error:", err);
          set({ error: err.message, isLoading: false });
          return null;
        }
      },

      deleteProduct: async (id: string) => {
        try {
          set({ isLoading: true });
          const res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete product");

          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            isLoading: false,
          }));

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
    }),
    {
      name: "gleamnest_products_catalog",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
    }
  )
);
