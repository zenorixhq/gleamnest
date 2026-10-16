"use client";

import Link from "next/link";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full h-[calc(100svh-6.25rem)] sm:h-[calc(100vh-6.5rem)] min-h-0 sm:min-h-[540px] max-h-[920px] bg-[#1C1917] lg:bg-gradient-to-r lg:from-[#F7EEDD] lg:via-[#F5EAD6] lg:to-[#E9D9C1] text-[#1C1917] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Mobile 9:16 Editorial Model Background (Full Portrait, Jewelry and Face in Full View) */}
      <div className="lg:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/hero-model-mobile.jpg"
          alt="GleamNest Fine Jewelry Editorial - Model wearing layered gold necklace and eternity rings"
          className="w-full h-full object-cover object-[center_top]"
        />
        {/* Subtle Luxury Gradient Overlay for Crisp White Typography Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
      </div>

      {/* 2. Desktop Editorial Model Image (From Uploaded Image 1 on Warm Studio Canvas) */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-[54%] xl:w-[50%] pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/images/hero-model-light-bg.jpg"
          alt="GleamNest Fine Jewelry - Model wearing layered gold necklace and gemstone eternity rings"
          className="w-full h-full object-cover object-[34%_bottom] scale-105 -translate-y-10"
        />
        {/* Soft edge blend into right studio backdrop on desktop */}
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-[#F5EAD6]" />
      </div>

      {/* 3. Top-Right Brand Philosophy */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 flex justify-end animate-fade-in">
        <div className="space-y-1 text-right max-w-xs sm:max-w-sm">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-white/95 lg:text-[#5C5349] block drop-shadow-sm">
            {storeConfig.meta.name || "GLEAMNEST"}
          </span>
          <p className="text-xs sm:text-sm text-white/90 lg:text-[#383129] font-normal leading-snug drop-shadow-sm">
            Fine jewelry for the skin, not the vault. <br />
            18K gold finish. Worn every day.
          </p>
        </div>
      </div>

      {/* 4. Right-Aligned Hero Editorial Headline (Clear of Model's Face, Crisp White & Larger on Mobile) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto flex justify-end animate-slide-up">
        <div className="w-full lg:w-[48%] xl:w-[46%] text-right lg:text-left pl-0 lg:pl-6">
          <h1 className="font-editorial text-[3rem] xs:text-[3.35rem] sm:text-5xl md:text-6xl lg:text-[3.8vw] xl:text-[4.5rem] font-normal tracking-tight text-white lg:text-[#1C1917] leading-[1.02] sm:leading-[1.05] drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] lg:drop-shadow-none">
            <span>Forever in style.</span> <br />
            <span className="font-editorial italic font-light text-white/95 lg:text-[#4A4036]">Just like you.</span>
          </h1>
        </div>
      </div>

      {/* 4. Bottom Right Floating Product Cards & Bottom White Dock */}
      <div className="relative z-10 w-full">
        {/* Floating Cards (Desktop/Tablet only, hidden on mobile for clean full-portrait view) */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 justify-end">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar max-w-full">
            {/* Card 1: Rings · Eternity Stack */}
            <Link
              href="/products?category=rings"
              className="relative w-36 sm:w-48 md:w-56 h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/40 group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src="/images/hero-card-rings.jpg"
                alt="18K Gold & Emerald Eternity Rings - GleamNest"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] sm:text-xs font-serif tracking-wide text-white/95">
                  Rings · Eternity Stack
                </span>
                <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                  <span className="text-white/80 font-light italic">emerald & gold bands</span>
                  <span className="text-white/95 font-medium group-hover:translate-x-0.5 transition-transform">
                    See more →
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Necklace · 18K Pendant */}
            <Link
              href="/products?category=necklaces"
              className="relative w-36 sm:w-48 md:w-56 h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/40 group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src="/images/hero-card-necklace.jpg"
                alt="18K Gold Bamboo Pendant Layered Necklace - GleamNest"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] sm:text-xs font-serif tracking-wide text-white/95">
                  Necklace · 18K Pendant
                </span>
                <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                  <span className="text-white/80 font-light italic">layered, close to skin</span>
                  <span className="text-white/95 font-medium group-hover:translate-x-0.5 transition-transform">
                    See more →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 5. Bottom White Curved Dock / Floating Bar (Slim single-row with categories fully visible on screen) */}
        <div className="w-full bg-white rounded-t-2xl sm:rounded-t-[2.25rem] md:rounded-t-[2.75rem] shadow-[0_-6px_24px_rgba(0,0,0,0.03)] border-t border-[#E3D7C5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 md:py-3.5 flex flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Left: Scroll indicator button */}
            <a
              href="#about-us"
              className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#7A7269] hover:text-[#1C1917] transition-colors group cursor-pointer"
            >
              <span className="text-xs group-hover:translate-y-0.5 transition-transform animate-float-gentle inline-block">↓</span>
              <span className="font-semibold tracking-[0.18em]">SCROLL</span>
            </a>

            {/* Right: Category navigation links */}
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm lowercase">
              <Link
                href="/products?category=rings"
                className="text-[#1C1917] font-semibold border-b-2 border-[#1C1917] pb-0.5 transition-colors"
              >
                rings
              </Link>
              <Link
                href="/products?category=earrings"
                className="text-[#7A7269] hover:text-[#1C1917] hover:border-b-2 hover:border-[#7A7269] pb-0.5 transition-all"
              >
                earrings
              </Link>
              <Link
                href="/products?category=necklaces"
                className="text-[#7A7269] hover:text-[#1C1917] hover:border-b-2 hover:border-[#7A7269] pb-0.5 transition-all"
              >
                necklaces
              </Link>
              <Link
                href="/products?category=bracelets"
                className="text-[#7A7269] hover:text-[#1C1917] hover:border-b-2 hover:border-[#7A7269] pb-0.5 transition-all"
              >
                bracelets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
