"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "compact" | "emblem-only";
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = "full",
  showTagline = true,
  className = "",
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group select-none ${className}`}
      aria-label="GleamNest.in Home"
    >
      {/* 1. Concentric Gold Monogram Emblem (GN) */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
        {/* Double Gold Concentric Ring Border */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C5A059] shadow-sm transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-[2.5px] rounded-full border border-[#D8BC79]/60" />
        
        {/* Subtle Warm Ivory Inner Fill */}
        <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F3EADB]" />

        {/* Monogram Monolith SVG with Leaves on 'G' and Star on 'N' */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-7 h-7 text-[#1C1917] overflow-visible"
          fill="currentColor"
        >
          {/* Decorative Sparkle Star Top Right of 'N' */}
          <path
            d="M 68 20 Q 68 25 73 25 Q 68 25 68 30 Q 68 25 63 25 Q 68 25 68 20 Z"
            fill="#C5A059"
          />
          <circle cx="68" cy="25" r="1.5" fill="#D8BC79" />

          {/* Letter G (Classic Luxury Serif) */}
          <text
            x="32"
            y="65"
            fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
            fontSize="46"
            fontWeight="600"
            textAnchor="middle"
            fill="#1C1917"
            letterSpacing="-1"
          >
            G
          </text>

          {/* Leaf vine detailing wrapping the G */}
          <path
            d="M 18 52 C 16 46, 20 42, 22 40 C 23 44, 21 49, 18 52 Z"
            fill="#C5A059"
          />
          <path
            d="M 23 41 C 26 38, 29 39, 30 42 C 28 43, 25 43, 23 41 Z"
            fill="#8F7842"
          />

          {/* Letter N (Overlapping Gold/Charcoal Serif) */}
          <text
            x="64"
            y="65"
            fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
            fontSize="46"
            fontWeight="600"
            textAnchor="middle"
            fill="#1C1917"
            letterSpacing="-1"
          >
            N
          </text>
        </svg>
      </div>

      {/* 2. Brand Wordmark & Cursive Tagline */}
      {variant !== "emblem-only" && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-baseline tracking-wider">
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.08em] text-[#1C1917] group-hover:text-black transition-colors">
              GleamNest
            </span>
            <span className="font-editorial text-base sm:text-lg font-semibold tracking-wider text-[#C5A059] ml-0.5">
              .in
            </span>
          </div>

          {showTagline && (
            <span className="font-script text-xs sm:text-[13px] text-[#C5A059] tracking-normal mt-0.5 whitespace-nowrap">
              The place where elegance and sparkle come together.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
