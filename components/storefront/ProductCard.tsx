"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/store";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, calculateDiscountPercent, getProductPrices } from "@/lib/utils";
import { Heart, Eye, ShoppingBag, Star, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist)(product.id);
  const openQuickView = useCartStore((s) => s.openQuickView);

  const { regularPrice, salePrice, effectivePrice, discountPercent } = getProductPrices(
    product,
    selectedCurrency
  );

  const isOutOfStock = !product.inStock || product.stockCount <= 0;
  const isVeryFewLeft = !isOutOfStock && product.stockCount <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const price = product.salePrice || product.price;
  const displayImage =
    Array.isArray(product.images) && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : typeof product.images === "string" && (product.images as string).trim()
      ? (product.images as string).trim()
      : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="group relative flex flex-col bg-card rounded-xl border border-border/70 overflow-hidden hover:shadow-lg transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50">
      {/* Product Image - Clean Framed Aspect Ratio (Fits Entire Jewelry Piece) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] dark:bg-stone-900/40 p-2 sm:p-2.5 flex items-center justify-center">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative flex items-center justify-center">
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            className={`w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
              isOutOfStock ? "opacity-60 grayscale-[35%]" : ""
            }`}
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {/* Out of Stock & Low Stock Badges */}
          {isOutOfStock ? (
            <span className="bg-neutral-900/95 text-stone-100 border border-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider backdrop-blur-sm">
              Out of Stock
            </span>
          ) : isVeryFewLeft ? (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Only {product.stockCount} Left!
            </span>
          ) : null}

          {discountPercent > 0 && !isOutOfStock && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && !isOutOfStock && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && !isOutOfStock && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Floating Actions (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistToggle}
            aria-label="Save to Wishlist"
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all ${
              isInWishlist
                ? "bg-destructive text-destructive-foreground"
                : "bg-white/90 text-foreground hover:bg-white hover:text-destructive"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleQuickView}
            aria-label="Quick View"
            className="w-7 h-7 rounded-full bg-white/90 text-foreground hover:bg-white hover:text-primary flex items-center justify-center shadow-md backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 sm:translate-x-1 group-hover:translate-x-0"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Add To Cart Button (Desktop Hover) */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-1.5 px-2.5 text-[11px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed border border-border"
            >
              <span>Out of Stock</span>
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={`w-full py-1.5 px-2.5 text-[11px] font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-all active:scale-95 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-foreground/95 hover:bg-foreground text-background"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Compact Product Details */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground mb-1">
            <span className="capitalize truncate max-w-[100px]">{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 font-medium text-foreground text-[10px]">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1" title={product.title}>
              {product.title}
            </h3>
          </Link>

          {/* Stock Urgency Indicator */}
          {isOutOfStock ? (
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              Out of Stock
            </p>
          ) : isVeryFewLeft ? (
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Only {product.stockCount} left!
            </p>
          ) : null}
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-2 mt-1.5 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {formatPrice(effectivePrice, selectedCurrency)}
            </span>
            {salePrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatPrice(regularPrice, selectedCurrency)}
              </span>
            )}
          </div>

          {/* Mobile only add button with instant feedback */}
          {isOutOfStock ? (
            <span className="sm:hidden px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider bg-stone-200 dark:bg-stone-800 text-stone-500">
              Sold Out
            </span>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={`sm:hidden min-w-[32px] min-h-[32px] p-1.5 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              aria-label="Add to cart"
              title="Add to shopping bag"
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
