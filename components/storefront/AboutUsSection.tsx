"use client";

import Link from "next/link";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative w-full h-screen max-h-[100vh] lg:h-[100svh] min-h-[560px] flex flex-col justify-between py-2 sm:py-3 lg:py-4 bg-[#FAF6EF] text-[#1C1917] overflow-hidden border-b border-[#EADBBE]/80 select-none"
    >
      {/* Background Topographic Wave Contours (Matching Reference Image) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 800"
      >
        <path d="M-100,160 Q200,40 450,220 T900,80 T1200,260" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,200 Q200,80 450,260 T900,120 T1200,300" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,240 Q200,120 450,300 T900,160 T1200,340" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,280 Q200,160 450,340 T900,200 T1200,380" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,560 Q300,420 600,620 T1200,480" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,600 Q300,460 600,660 T1200,520" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,640 Q300,500 600,700 T1200,560" fill="none" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M-100,680 Q300,540 600,740 T1200,600" fill="none" stroke="#1C1917" strokeWidth="1.5" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-between relative z-10">
        
        {/* 1. Header: ABOUT US + Elegant Manifesto Paragraph */}
        <div className="text-center shrink-0 pt-1 pb-1 sm:pb-2 max-w-xl mx-auto space-y-1">
          <div className="relative inline-block">
            <span className="absolute -top-2.5 -left-5 text-[#C5A059] text-[10px] sm:text-xs">✦</span>
            <span className="absolute -bottom-1 -right-5 text-[#C5A059] text-[10px] sm:text-xs">✦</span>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.25em] uppercase text-[#1C1917]">
              ABOUT US
            </h2>
          </div>

          <p className="text-[11px] sm:text-xs text-[#5C5346] leading-relaxed font-light max-w-lg mx-auto px-2">
            GleamNest designs modern, everyday luxury jewellery pieces handcrafted from surgical-grade 316L stainless steel and 18K gold finish. We believe in timeless daily elegance.
          </p>
        </div>

        {/* 2. Main Two-Column Editorial Spread (Fills Remaining Screen Height Cleanly with ZERO Overflow) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-8 items-center flex-1 min-h-0 py-1 sm:py-2">
          
          {/* Left Column: Number 03 + Landscape Photo + Story + Oval Pill Button */}
          <div className="md:col-span-5 flex flex-col justify-center h-full space-y-2 sm:space-y-3">
            <div>
              <span className="font-editorial text-xs italic text-[#8F7842] block mb-1 tracking-wider">
                03
              </span>
              <div className="w-full max-w-[300px] sm:max-w-[330px] lg:max-w-[350px] aspect-[16/9] max-h-[22vh] rounded-sm overflow-hidden shadow-sm border border-[#E2D5BE] bg-[#F0E6D2]">
                <img
                  src="/images/about-model-landscape.jpg"
                  alt="GleamNest 18K Gold Waterproof Necklace & Ring Lifestyle Landscape"
                  className="w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 max-w-xs pt-0.5">
              <p className="text-[11px] sm:text-xs text-[#5C5346] leading-relaxed font-light">
                Our goal is to create products that are made for life. We encourage people to think about jewellery as part of their identity and legacy.
              </p>

              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs font-medium tracking-wide transition-all shadow-sm active:scale-95 group"
                >
                  <span>More Information</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Spacer Column */}
          <div className="hidden md:block md:col-span-1" />

          {/* Right Column: Number 04 + Portrait Photo (Strict 2:3 ratio, height constrained to viewport) */}
          <div className="md:col-span-6 flex flex-col justify-center items-center h-full">
            <div className="flex flex-col items-start max-h-[48vh] sm:max-h-[52vh] lg:max-h-[55vh] aspect-[2/3] w-auto">
              <span className="font-editorial text-xs italic text-[#8F7842] block mb-1 tracking-wider">
                04
              </span>
              <div className="w-full flex-1 aspect-[2/3] rounded-sm overflow-hidden shadow-md border border-[#E2D5BE] bg-[#F0E6D2]">
                <img
                  src="/images/about-model-portrait.jpg"
                  alt="GleamNest 18K Gold Fine Jewelry Portrait"
                  className="w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Subtle Accent Line */}
        <div className="shrink-0 pb-1 pt-0.5 flex justify-center">
          <div className="w-12 h-[1px] bg-[#C5A059]/40" />
        </div>
      </div>
    </section>
  );
}
