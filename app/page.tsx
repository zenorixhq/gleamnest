"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { storeConfig } from "@/config/store.config";
import { categories } from "@/data/mockData";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/storefront/ProductCard";
import { HeroEditorial } from "@/components/storefront/HeroEditorial";
import { AboutUsSection } from "@/components/storefront/AboutUsSection";
import { BrandValueBadges } from "@/components/storefront/BrandValueBadges";
import { InstagramReelSection } from "@/components/storefront/InstagramReelSection";
import { CustomerReviewsWithVideos } from "@/components/storefront/CustomerReviewsWithVideos";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "featured">("bestsellers");

  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "bestsellers") return p.isBestSeller;
    if (activeTab === "new") return p.isNewArrival;
    return p.featured;
  });

  return (
    <div className="w-full bg-[#FAF7F2] overflow-x-hidden">
      {/* 1. Hero Section (Enclosed within entire screen window, full scroll) */}
      <HeroEditorial />

      {/* 2. About Us Section (Enclosed within entire screen window, full scroll) */}
      <AboutUsSection />

      {/* 3. Five Signature Brand Badges & WhatsApp Direct Contact Banner */}
      <BrandValueBadges />

      {/* 4. Shop by Category Grid */}
      <section className="w-full py-16 sm:py-24 border-t border-[#EADBBE]/60 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] mt-1 tracking-wide">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-[#8F7234] hover:text-[#1C1917] flex items-center gap-1 group transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#EADBBE] shadow-sm bg-[#FFFDF9]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] text-[#EADBBE] font-medium tracking-wider uppercase">
                  {cat.productCount} Items
                </span>
                <h3 className="font-editorial text-lg font-semibold tracking-wide text-white group-hover:text-[#F3DFB0] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5 font-light">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* 5. Tabbed Product Showcase (4 items per row, 3 rows = 12 items) */}
      <section className="w-full py-16 sm:py-24 border-t border-[#EADBBE]/60 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBBE] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Catalog</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] mt-1 tracking-wide">
              Featured Pieces
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 p-1 bg-[#F0E6D2] rounded-xl self-start sm:self-auto border border-[#EADBBE]">
            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "bestsellers"
                  ? "bg-white text-[#1C1917] shadow-sm"
                  : "text-[#6C6354] hover:text-[#1C1917]"
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "new"
                  ? "bg-white text-[#1C1917] shadow-sm"
                  : "text-[#6C6354] hover:text-[#1C1917]"
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "featured"
                  ? "bg-white text-[#1C1917] shadow-sm"
                  : "text-[#6C6354] hover:text-[#1C1917]"
              }`}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Product Cards Grid: 4 items in a row, 3 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filteredProducts.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-sm"
          >
            <span>Discover Full Catalog ({products.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        </div>
      </section>

      {/* 6. Instagram Account Display (Matching Image 3 - Follow The House) */}
      <InstagramReelSection />

      {/* 7. Customer Testimonials & Influencer Video Reels (Matching Image 3 + Video Side) */}
      <CustomerReviewsWithVideos />
    </div>
  );
}
