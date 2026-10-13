"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroEditorial() {
  const categoryLinks = [
    { name: "RINGS", href: "/products?category=rings" },
    { name: "BANGLES & BRACELETS", href: "/products?category=bracelets" },
    { name: "CHAINS & NECKLACES", href: "/products?category=necklaces" },
    { name: "EARRINGS", href: "/products?category=earrings" },
    { name: "ANKLETS", href: "/products?category=anklets" },
  ];

  return (
    <section className="relative w-full min-h-[calc(100svh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FAF6EF] text-[#1C1917] overflow-hidden select-none border-b border-[#E7DECB]/80">
      {/* Subtle Warm Champagne Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#F4E8D1]/50 via-[#FAF4E6]/30 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container - Fills the Full Screen Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between pt-4 pb-4 sm:pt-6 sm:pb-6 relative z-10">
        
        {/* 1. Top Area: Brand Script Tagline & Celéstique Serif Title Banner */}
        <div className="space-y-2 sm:space-y-3">
          <div className="text-center">
            <p className="font-script text-xl sm:text-2xl md:text-3xl text-[#C5A059] tracking-wide">
              The place where elegance and sparkle come together.
            </p>
          </div>

          <div className="text-center relative pb-4 sm:pb-6 border-b border-[#D8CBB6]/60">
            <h1 className="font-editorial text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[7vw] font-normal tracking-[0.05em] uppercase leading-none text-[#1C1917] flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
              <span>G</span>
              <span>L</span>
              <span>E</span>
              <span className="inline-flex items-center justify-center relative">
                A
                <span className="absolute -top-1 sm:-top-2 text-xs sm:text-base text-[#C5A059]">✦</span>
              </span>
              <span>M</span>
              <span>N</span>
              <span>E</span>
              <span>S</span>
              <span>T</span>
            </h1>

            {/* Subtitle placed on top right below headline (Desktop & Tablet) */}
            <div className="hidden md:block absolute right-0 bottom-2 text-right max-w-xs">
              <p className="font-editorial text-xs lg:text-sm uppercase tracking-[0.2em] text-[#8C7A5E] leading-relaxed font-medium">
                A CELESTIAL TOUCH <br />
                FOR TIMELESS MOMENTS
              </p>
            </div>
          </div>
        </div>

        {/* 2. Middle Area: Left Info + Centerpiece Transparent Necklace + Right Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center py-4 sm:py-6">
          {/* Left Column: Collection Kicker & CTAs */}
          <div className="md:col-span-4 order-2 md:order-1 space-y-4 text-left">
            <div>
              <span className="font-editorial text-xl sm:text-2xl font-medium tracking-wide uppercase text-[#8C7A5E] block">
                COLLECTION
              </span>
              <span className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wider text-[#1C1917] block -mt-1">
                2025
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed max-w-sm font-light">
              Exquisite waterproof & anti-tarnish jewelry crafted in surgical-grade 316L stainless steel with 18K gold vacuum PVD plating. Designed to never fade, rust, or lose its sparkle.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#C5A059] text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md hover:scale-105 active:scale-95 group"
              >
                <span>DISCOVER ALL</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="https://wa.me/916238920442"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C5A059] text-[#7A602B] hover:bg-[#C5A059]/10 text-xs font-medium tracking-wide transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>WhatsApp Order</span>
              </Link>
            </div>
          </div>

          {/* Center Column: Transparent Gold Necklace Centerpiece */}
          <div className="md:col-span-4 order-1 md:order-2 flex justify-center items-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] max-h-[46vh] flex items-center justify-center">
              {/* Soft Warm Champagne Ambient Glow behind the transparent necklace */}
              <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-[#EED39E]/45 via-[#FCECC9]/30 to-transparent blur-2xl pointer-events-none" />

              {/* High-Resolution Transparent Background Gold Necklace */}
              <img
                src="/images/hero-necklace.png"
                alt="GleamNest 18K Gold Plated Waterproof Necklace"
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_25px_rgba(184,142,56,0.22)] transition-transform duration-700 hover:scale-105 filter hover:brightness-105"
              />
            </div>
          </div>

          {/* Right Column: Category Navigation Menu with Dividers */}
          <div className="md:col-span-4 order-3 space-y-1 text-right">
            {/* Mobile Subtitle Display */}
            <div className="md:hidden pb-3 text-left border-b border-[#D8CBB6]/50">
              <p className="font-editorial text-xs uppercase tracking-[0.2em] text-[#8C7A5E] font-medium">
                A Celestial Touch for Timeless Moments
              </p>
            </div>

            {categoryLinks.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex items-center justify-between py-2 sm:py-2.5 border-b border-[#E0D4C0] hover:border-[#C5A059] transition-colors"
              >
                <span className="font-editorial text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#3C3428] group-hover:text-[#C5A059] transition-colors">
                  {cat.name}
                </span>
                <span className="text-[#8C7A5E] group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all text-xs">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Bottom Area: Subtle Scroll Prompt to Enclosed About Us Section */}
        <div className="pt-2 sm:pt-4 pb-1 flex justify-center items-center">
          <a
            href="#about-us"
            className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8C7A5E] hover:text-[#1C1917] transition-colors group"
          >
            <span>Scroll for About Us</span>
            <span className="group-hover:translate-y-1 transition-transform">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
