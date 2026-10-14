"use client";

import Link from "next/link";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full h-[calc(100svh-5.5rem)] sm:h-[calc(100vh-6.5rem)] min-h-[580px] max-h-[920px] bg-[#CBBFB1] text-[#1C1917] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Left Editorial Model Image (From Uploaded Image 1 on Warm Studio Canvas) */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[48%] xl:w-[46%] h-full pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/images/hero-model-light-bg.jpg"
          alt="GleamNest Fine Jewelry - Model wearing layered gold necklace and gemstone eternity rings"
          className="w-full h-full object-cover object-[center_center]"
        />
        {/* Soft edge blend into right studio backdrop on desktop */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#CBBFB1]" />
        {/* Mobile soft contrast overlay */}
        <div className="lg:hidden absolute inset-0 bg-[#CBBFB1]/20 backdrop-blur-[0.5px]" />
      </div>

      {/* 2. Top-Right Brand Philosophy & Link */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-5 sm:pt-7 flex justify-end">
        <div className="space-y-1 text-right max-w-xs sm:max-w-sm">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-[#5C5349] block">
            {storeConfig.meta.name || "GLEAMNEST"}
          </span>
          <p className="text-xs sm:text-sm text-[#383129] font-normal leading-snug">
            Fine jewelry for the skin, not the vault. <br />
            18K gold finish. Worn every day.
          </p>
          <div className="pt-0.5">
            <Link
              href="https://wa.me/916238920442?text=Hello%20GleamNest!%20I%20would%20like%20to%20book%20a%20private%20fitting%20and%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:text-black transition-colors group"
            >
              <span>Book a fitting</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Center Signature Editorial Headline (Strictly 2 Lines) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 my-auto">
        <div className="max-w-5xl">
          {/* Line 1: NEVER SAVED FOR SOMEDAY (Strictly 1 line, nowrap) */}
          <div className="flex items-baseline gap-2.5 sm:gap-4 md:gap-5 whitespace-nowrap">
            <span className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-[4.6vw] xl:text-[5.6rem] font-normal tracking-tight text-[#1C1917] uppercase leading-[0.92]">
              NEVER SAVED
            </span>
            <span className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-[4.6vw] xl:text-[5.6rem] font-light tracking-wide uppercase text-[#948D85]/60 font-outline-editorial leading-[0.92]">
              FOR SOMEDAY
            </span>
          </div>

          {/* Line 2: CRAFTED TO LIVE IN (Indented towards the center, strictly 1 line, nowrap) */}
          <div className="pl-4 sm:pl-16 md:pl-28 lg:pl-36 xl:pl-44 mt-0.5 sm:mt-1 whitespace-nowrap">
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-[4.6vw] xl:text-[5.6rem] font-normal tracking-tight text-[#1C1917] uppercase leading-[0.92]">
              CRAFTED TO LIVE IN
            </h1>
          </div>
        </div>
      </div>

      {/* 4. Bottom Right Floating Product Cards & Bottom White Dock */}
      <div className="relative z-10 w-full">
        {/* Floating Cards (Bottom Right Quadrant) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-3 sm:pb-4 flex justify-end">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar max-w-full">
            {/* Card 1: Bracelet · Line */}
            <Link
              href="/products?category=bracelets"
              className="relative w-36 sm:w-48 md:w-56 h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/40 group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src="/images/hero-card-bracelet.png"
                alt="Bracelet Line - GleamNest"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] sm:text-xs font-serif tracking-wide text-white/95">
                  Bracelet · Line
                </span>
                <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                  <span className="text-white/80 font-light italic">many, worn as one</span>
                  <span className="text-white/95 font-medium group-hover:translate-x-0.5 transition-transform">
                    See more →
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Necklace · Rivière */}
            <Link
              href="/products?category=necklaces"
              className="relative w-36 sm:w-48 md:w-56 h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/40 group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src="/images/hero-card-necklace.png"
                alt="Necklace Rivière - GleamNest"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] sm:text-xs font-serif tracking-wide text-white/95">
                  Necklace · Rivière
                </span>
                <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                  <span className="text-white/80 font-light italic">a single stone, close to the skin</span>
                  <span className="text-white/95 font-medium group-hover:translate-x-0.5 transition-transform">
                    See more →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 5. Bottom White Curved Dock / Floating Bar */}
        <div className="w-full bg-white rounded-t-[1.75rem] sm:rounded-t-[2.25rem] md:rounded-t-[2.75rem] shadow-[0_-8px_30px_rgba(0,0,0,0.03)] border-t border-[#BDB1A4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Left: 3-line lower-case motto */}
            <div className="text-[10px] sm:text-[11px] text-[#8C847B] font-normal lowercase leading-tight text-center sm:text-left">
              <div>waterproof & anti-tarnish.</div>
              <div>surgical-grade 316L steel.</div>
              <div>worn every day after.</div>
            </div>

            {/* Center: Scroll button */}
            <a
              href="#about-us"
              className="flex flex-col items-center justify-center text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#7A7269] hover:text-[#1C1917] transition-colors group cursor-pointer"
            >
              <span className="text-xs group-hover:translate-y-0.5 transition-transform">↓</span>
              <span className="font-semibold tracking-[0.2em]">SCROLL</span>
            </a>

            {/* Right: Category navigation links */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm lowercase">
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
