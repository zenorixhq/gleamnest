"use client";

import Link from "next/link";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full h-[calc(100svh-6.25rem)] sm:h-[calc(100vh-6.5rem)] min-h-[500px] sm:min-h-[540px] max-h-[660px] md:max-h-[700px] lg:max-h-[780px] xl:max-h-[840px] bg-[#1C1917] md:bg-gradient-to-r md:from-[#F7EEDD] md:via-[#F5EAD6] md:to-[#E9D9C1] text-[#1C1917] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Mobile 9:16 Editorial Model Background (Full Portrait, Hand & Jewelry Centered) */}
      <div className="md:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/hero-model-mobile.jpg"
          alt="GleamNest Fine Jewelry Editorial - Model wearing layered gold necklace and eternity rings"
          className="w-full h-full object-cover object-[center_55%]"
        />
        {/* Subtle Luxury Gradient Overlay for Crisp White Typography Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
      </div>

      {/* 2. Desktop & Tablet Editorial Model Image (Warm Studio Canvas, Hand & Rings Perfectly Centered) */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-[55%] lg:w-[52%] xl:w-[48%] pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/images/hero-model-light-bg.jpg"
          alt="GleamNest Fine Jewelry - Model wearing layered gold necklace and gemstone eternity rings"
          className="w-full h-full object-cover object-[32%_center]"
        />
        {/* Soft edge blend into right studio backdrop on desktop */}
        <div className="absolute inset-y-0 right-0 w-28 md:w-36 lg:w-44 bg-gradient-to-r from-transparent to-[#F5EAD6]" />
      </div>

      {/* 3. Top-Right Brand Philosophy */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-6 lg:pt-8 flex justify-end animate-fade-in">
        <div className="space-y-1 text-right max-w-xs sm:max-w-sm">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-white/95 md:text-[#5C5349] block drop-shadow-sm md:drop-shadow-none">
            {storeConfig.meta.name || "GLEAMNEST"}
          </span>
          <p className="text-xs sm:text-sm text-white/90 md:text-[#383129] font-normal leading-snug drop-shadow-sm md:drop-shadow-none">
            Fine jewelry for the skin, not the vault. <br />
            Waterproof & anti-tarnish. Worn every day.
          </p>
        </div>
      </div>

      {/* 4. Right-Aligned Hero Editorial Headline (Clear of Model's Face, Luxury Editorial Font) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto flex justify-end animate-slide-up">
        <div className="w-full md:w-[48%] xl:w-[46%] text-right md:text-left pl-0 md:pl-6">
          <h1 className="font-editorial text-[2.75rem] xs:text-[3.25rem] sm:text-5xl md:text-5xl lg:text-[3.6vw] xl:text-[4.25rem] font-normal tracking-tight text-white md:text-[#1C1917] leading-[1.04] sm:leading-[1.05] drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] md:drop-shadow-none">
            <span>Forever in style.</span> <br />
            <span className="font-editorial italic font-light text-white/95 md:text-[#4A4036]">Just like you.</span>
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
                alt="Emerald Eternity Rings - GleamNest"
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

            {/* Card 2: Necklace · Pendant */}
            <Link
              href="/products?category=necklaces-and-chains"
              className="relative w-36 sm:w-48 md:w-56 h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/40 group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src="/images/hero-card-necklace.jpg"
                alt="Bamboo Pendant Layered Necklace - GleamNest"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] sm:text-xs font-serif tracking-wide text-white/95">
                  Necklace · Pendant
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

        {/* 5. Bottom Curved Dock / Floating Bar (Spacious luxury chip navigation on phone, minimalist underline on desktop) */}
        <div className="w-full bg-white rounded-t-2xl sm:rounded-t-[2.25rem] md:rounded-t-[2.75rem] shadow-[0_-6px_24px_rgba(0,0,0,0.03)] border-t border-[#E3D7C5]">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Left: Scroll indicator button */}
            <a
              href="#about-us"
              className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8F7234] bg-[#FAF5EB] sm:bg-transparent px-2.5 py-1.5 sm:p-0 rounded-full sm:rounded-none border border-[#EADBBE] sm:border-0 transition-colors group cursor-pointer"
              title="Scroll to About Us"
            >
              <span className="text-xs group-hover:translate-y-0.5 transition-transform animate-float-gentle inline-block">↓</span>
              <span className="hidden xs:inline sm:inline">SCROLL</span>
            </a>

            {/* Right: Category navigation links (Right-aligned to balance with SCROLL on the left) */}
            <div className="flex items-center justify-start sm:justify-end gap-2.5 sm:gap-6 md:gap-8 text-xs sm:text-sm overflow-x-auto no-scrollbar py-1 whitespace-nowrap scroll-smooth ml-auto min-w-0">
              <Link
                href="/products?category=rings"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#1C1917] text-white sm:bg-transparent sm:text-[#1C1917] sm:border-b-2 sm:border-[#1C1917] font-medium sm:font-semibold text-xs sm:text-sm transition-all shadow-xs"
              >
                rings
              </Link>
              <Link
                href="/products?category=earrings"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#FAF7F2] text-stone-700 border border-[#EADBBE]/80 sm:bg-transparent sm:border-0 sm:border-b-2 sm:border-transparent sm:text-[#7A7269] hover:text-[#1C1917] sm:hover:border-[#7A7269] font-medium sm:font-normal text-xs sm:text-sm transition-all"
              >
                earrings
              </Link>
              <Link
                href="/products?category=necklaces-and-chains"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#FAF7F2] text-stone-700 border border-[#EADBBE]/80 sm:bg-transparent sm:border-0 sm:border-b-2 sm:border-transparent sm:text-[#7A7269] hover:text-[#1C1917] sm:hover:border-[#7A7269] font-medium sm:font-normal text-xs sm:text-sm transition-all"
              >
                necklaces & chains
              </Link>
              <Link
                href="/products?category=bracelets"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#FAF7F2] text-stone-700 border border-[#EADBBE]/80 sm:bg-transparent sm:border-0 sm:border-b-2 sm:border-transparent sm:text-[#7A7269] hover:text-[#1C1917] sm:hover:border-[#7A7269] font-medium sm:font-normal text-xs sm:text-sm transition-all"
              >
                bracelets
              </Link>
              <Link
                href="/products?category=bangles-kada"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#FAF7F2] text-stone-700 border border-[#EADBBE]/80 sm:bg-transparent sm:border-0 sm:border-b-2 sm:border-transparent sm:text-[#7A7269] hover:text-[#1C1917] sm:hover:border-[#7A7269] font-medium sm:font-normal text-xs sm:text-sm transition-all"
              >
                bangles kada
              </Link>
              <Link
                href="/products?category=anklets"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#FAF7F2] text-stone-700 border border-[#EADBBE]/80 sm:bg-transparent sm:border-0 sm:border-b-2 sm:border-transparent sm:text-[#7A7269] hover:text-[#1C1917] sm:hover:border-[#7A7269] font-medium sm:font-normal text-xs sm:text-sm transition-all"
              >
                anklets
              </Link>
              <Link
                href="/products?category=new-arrivals"
                className="shrink-0 px-3 py-1.5 sm:px-0 sm:py-0.5 rounded-full sm:rounded-none bg-[#FAF5EB] text-[#8F7234] border border-[#EADBBE] sm:bg-transparent sm:border-0 sm:border-b-2 sm:border-transparent hover:text-[#1C1917] sm:hover:border-[#8F7234] font-medium text-xs sm:text-sm transition-all flex items-center gap-1"
              >
                <span>✦ new arrivals</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
