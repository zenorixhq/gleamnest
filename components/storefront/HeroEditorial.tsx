"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full h-[calc(100svh-4rem)] sm:h-[calc(100vh-4.5rem)] min-h-[620px] max-h-[980px] bg-[#E6E4DF] text-[#181513] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Background Editorial Model Photography on Left */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <img
          src="/images/hero-model-editorial.jpg"
          alt="GleamNest Fine Jewelry Editorial - Model wearing pear diamond ring"
          className="w-full h-full object-cover object-[18%_center] sm:object-[22%_center] lg:object-[25%_center] xl:object-[30%_center] opacity-95"
        />

        {/* Desktop Smooth Horizontal Fade into Background */}
        <div className="hidden lg:block absolute inset-y-0 left-[38%] xl:left-[42%] w-[28%] bg-gradient-to-r from-transparent via-[#E6E4DF]/60 to-[#E6E4DF]" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[42%] bg-[#E6E4DF]" />

        {/* Mobile/Tablet Soft Legibility Layer */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-r from-transparent via-[#E6E4DF]/50 to-[#E6E4DF]/90" />
      </div>

      {/* 2. Top-Right Brand Philosophy & CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 flex justify-end">
        <div className="space-y-1.5 text-right max-w-xs sm:max-w-sm">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-[#7A746B] block">
            {storeConfig.meta.name || "GLEAMNEST"}
          </span>
          <p className="text-xs sm:text-sm text-[#4A453E] font-light leading-snug">
            Made for skin, not display. <br />
            Made to order. Worn every day.
          </p>
          <div className="pt-0.5">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#181513] hover:text-primary transition-colors group"
            >
              <span>Explore collection</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Center Signature Editorial Headline */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 my-auto">
        <div className="max-w-5xl">
          {/* Line 1: NOT FOR SOMEDAY */}
          <div className="flex items-baseline gap-3 sm:gap-6 flex-wrap">
            <span className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] font-normal tracking-tight text-[#181513] uppercase leading-[0.92]">
              NOT FOR
            </span>
            <span className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] font-light tracking-wide uppercase text-[#8F8880]/60 font-outline-editorial leading-[0.92]">
              SOMEDAY
            </span>
          </div>

          {/* Line 2: MADE TO LIVE IN (Indented to start under SOMEDAY) */}
          <div className="pl-6 sm:pl-20 md:pl-32 lg:pl-48 xl:pl-56 mt-0.5 sm:mt-1">
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] font-normal tracking-tight text-[#181513] uppercase leading-[0.92]">
              MADE TO LIVE IN
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
        <div className="w-full bg-white rounded-t-[1.75rem] sm:rounded-t-[2.25rem] md:rounded-t-[2.75rem] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border-t border-[#EAE6DE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Left: 3-line lower-case motto */}
            <div className="text-[10px] sm:text-[11px] text-[#8C857D] font-normal lowercase leading-tight text-center sm:text-left">
              <div>made to order.</div>
              <div>fitted in person.</div>
              <div>worn every day after.</div>
            </div>

            {/* Center: Scroll button */}
            <a
              href="#about-us"
              className="flex flex-col items-center justify-center text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#7A736A] hover:text-[#181513] transition-colors group cursor-pointer"
            >
              <span className="text-xs group-hover:translate-y-0.5 transition-transform">↓</span>
              <span className="font-semibold tracking-[0.2em]">SCROLL</span>
            </a>

            {/* Right: Category navigation links */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm lowercase">
              <Link
                href="/products?category=rings"
                className="text-[#181513] font-semibold border-b-2 border-[#181513] pb-0.5 transition-colors"
              >
                rings
              </Link>
              <Link
                href="/products?category=earrings"
                className="text-[#7A736A] hover:text-[#181513] hover:border-b-2 hover:border-[#7A736A] pb-0.5 transition-all"
              >
                earrings
              </Link>
              <Link
                href="/products?category=necklaces"
                className="text-[#7A736A] hover:text-[#181513] hover:border-b-2 hover:border-[#7A736A] pb-0.5 transition-all"
              >
                necklaces
              </Link>
              <Link
                href="/products?category=bracelets"
                className="text-[#7A736A] hover:text-[#181513] hover:border-b-2 hover:border-[#7A736A] pb-0.5 transition-all"
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
