"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "compact" | "emblem-only";
  showTagline?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export function BrandLogo({
  variant = "full",
  showTagline = true,
  className = "",
  theme = "light",
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      aria-label="GleamNest.in Home"
    >
      {/* 1. Official GN Monogram Emblem */}
      <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
        <img
          src="/images/logo-mark.png"
          alt="GleamNest Emblem"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 2. Official Brand Wordmark & Tagline */}
      {variant !== "emblem-only" && (
        <div className="flex flex-col text-left justify-center">
          <img
            src="/images/logo-text.png"
            alt="GleamNest.in"
            className={`h-5 sm:h-6 md:h-6.5 w-auto object-contain object-left transition-all ${
              theme === "dark" ? "brightness-0 invert opacity-95" : ""
            }`}
          />
          {showTagline && (
            <span
              className={`font-script text-[9.5px] sm:text-xs md:text-[13px] tracking-normal mt-0.5 truncate max-w-[210px] sm:max-w-none ${
                theme === "dark" ? "text-[#EADBBE]" : "text-[#C5A059]"
              }`}
            >
              The place where elegance and sparkle come together.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
