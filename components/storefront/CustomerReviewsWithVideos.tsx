"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Volume2, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, X } from "lucide-react";

interface Review {
  id: number;
  quote: string;
  author: string;
  location: string;
  piece: string;
}

interface VideoReel {
  id: number;
  influencer: string;
  handle: string;
  title: string;
  videoUrl: string;
  poster: string;
  views: string;
  productTitle: string;
  productSlug: string;
  productPrice: number;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    quote:
      "Every piece feels like a whisper of the old couture houses. The gold finish is beyond reproach, and zero tarnish after 2 months of daily wear.",
    author: "Isabella M.",
    location: "Kochi, Kerala",
    piece: "Statement Ring & Clover Bangle",
  },
  {
    id: 2,
    quote:
      "My solitaire arrived in a velvet box that already felt like an heirloom. The stone is extraordinary, and the WhatsApp ordering was so personal.",
    author: "Camille R.",
    location: "Kannur, Kerala",
    piece: "White Stone Charm Chain",
  },
  {
    id: 3,
    quote:
      "The atelier answered every question personally on WhatsApp. Rare, and quite lovely. Fast 2-day delivery across South India.",
    author: "Sofia A.",
    location: "Bengaluru, Karnataka",
    piece: "Clover Bracelet - Gold",
  },
  {
    id: 4,
    quote:
      "I was skeptical about waterproof claims at this price point, but I've showered and swum in this necklace for weeks without a hint of fading.",
    author: "Meera K.",
    location: "Mumbai, Maharashtra",
    piece: "Simple Pearl Chain",
  },
];

const defaultVideoReels: VideoReel[] = [
  {
    id: 1,
    influencer: "Ananya Sanil",
    handle: "@ananya.styling",
    title: "100% Waterproof Shower Test 💧",
    poster: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=700",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-jewelry-in-front-of-a-mirror-42407-large.mp4",
    views: "18.4K views",
    productTitle: "Clover Bracelet - Gold",
    productSlug: "clover-bracelet-gold",
    productPrice: 150,
  },
  {
    id: 2,
    influencer: "Devika Menon",
    handle: "@devika_curates",
    title: "Unboxing & Daily Stack Review ✨",
    poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=700",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-showing-a-gold-ring-42409-large.mp4",
    views: "24.1K views",
    productTitle: "Statement Ring",
    productSlug: "statement-ring",
    productPrice: 140,
  },
];

export function CustomerReviewsWithVideos() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [videoReels, setVideoReels] = useState<VideoReel[]>(defaultVideoReels);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoReel | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
        if (Array.isArray(data.videoReels)) {
          setVideoReels(data.videoReels);
        }
      })
      .catch((e) => console.error("Could not fetch reviews:", e));
  }, []);


  const nextReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-t border-[#EADBBE]/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header (Matching Image 3) */}
        <div className="text-center space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
            IN THEIR WORDS
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#1C1917]">
            From our customers
          </h2>
        </div>

        {/* Dual Showcase: Video Reels on Left + Review Quotes on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Side: Client & Influencer Video Reels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Influencer & Client Reels</span>
              </span>
              <span className="text-[11px] text-stone-500">Real wear tests</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {videoReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => setSelectedVideo(reel)}
                  className="group relative aspect-[9/15] rounded-xl overflow-hidden bg-stone-900 shadow-md cursor-pointer border border-stone-300/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
                >
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 flex flex-col justify-between p-3 text-white">
                    {/* Top Views Badge */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full font-medium">
                        {reel.views}
                      </span>
                      <Volume2 className="w-3.5 h-3.5 text-white/80" />
                    </div>

                    {/* Center Animated Play Button */}
                    <div className="self-center w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-white transition-all duration-300">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>

                    {/* Bottom Details */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-white line-clamp-1 leading-snug">
                        {reel.title}
                      </p>
                      <p className="text-[10px] text-white/80 font-medium">
                        {reel.handle}
                      </p>
                      <span className="inline-block text-[9px] text-amber-300 font-semibold bg-white/10 px-1.5 py-0.5 rounded">
                        {reel.productTitle}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Editorial Customer Reviews Carousel (Matching Image 3) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {reviews.slice(activeReviewIdx, activeReviewIdx + 2).concat(
                reviews.slice(0, Math.max(0, activeReviewIdx + 2 - reviews.length))
              ).slice(0, 2).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F0] border-l-2 border-stone-400/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm min-h-[220px]"
                >
                  <div className="space-y-4">
                    {/* Teal Circular Quote Badge (Matching Image 3) */}
                    <div className="w-7 h-7 rounded-full bg-[#114E45] text-white flex items-center justify-center text-sm font-serif font-black">
                      “
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200/80 space-y-0.5">
                    <p className="text-xs font-semibold text-stone-900">{item.author}</p>
                    <p className="text-[11px] text-stone-500 font-light">{item.location}</p>
                    <p className="text-[10px] text-amber-700 font-medium pt-1">
                      Verified Piece: {item.piece}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dark Teal/Green Circular Arrow Buttons (Matching Image 3) */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <button
                onClick={prevReview}
                aria-label="Previous customer review"
                className="w-10 h-10 rounded-full bg-[#114E45] hover:bg-[#0c3831] text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextReview}
                aria-label="Next customer review"
                className="w-10 h-10 rounded-full bg-[#114E45] hover:bg-[#0c3831] text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-500 pl-2">
                Showing reviews {activeReviewIdx + 1}-{Math.min(activeReviewIdx + 2, reviews.length)} of {reviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[9/16] w-full bg-black relative flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{selectedVideo.productTitle}</p>
                <p className="text-[11px] text-stone-400">{selectedVideo.handle} • ₹{selectedVideo.productPrice}</p>
              </div>

              <Link
                href={`/products/${selectedVideo.productSlug}`}
                onClick={() => setSelectedVideo(null)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                View Piece
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
