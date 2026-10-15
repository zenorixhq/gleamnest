"use client";

import { Instagram } from "lucide-react";

export function InstagramReelSection() {
  const instaPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=700",
      caption: "Floral notes & waterproof 18K gold hoops.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700",
      caption: "Our signature oval pendant on pure linen.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=700",
      caption: "Statement rings crafted for effortless daily styling.",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=700",
      caption: "Golden hour glow with the classic eternity band.",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=700",
      caption: "Contemporary cascade drop earrings in 18K PVD finish.",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=700",
      caption: "Double layered chain stack. Shower & workout safe.",
    },
  ];

  return (
    <section className="w-full bg-[#FAF7F2] pt-14 pb-4 overflow-hidden border-t border-[#EADBBE]/80">
      {/* 1. Header: FOLLOW THE HOUSE & Large Serif Handle */}
      <div className="text-center space-y-2 mb-10 px-4">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
          FOLLOW THE HOUSE
        </span>

        <a
          href="https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1C1917] hover:text-[#C5A059] transition-colors"
        >
          @gleamnest.in
        </a>
      </div>

      {/* 2. Full-Width Seamless 6-Photo Ribbon (Matching Image 3) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 sm:gap-2 px-1 sm:px-2">
        {instaPosts.map((post) => (
          <a
            key={post.id}
            href="https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[3/4] sm:aspect-[2/3] overflow-hidden bg-stone-200 block"
          >
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Instagram Hover Overlay */}
            <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
              <Instagram className="w-5 h-5 ml-auto text-white/90" />
              <p className="text-[11px] font-light line-clamp-2 leading-relaxed text-white/95">
                {post.caption}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
