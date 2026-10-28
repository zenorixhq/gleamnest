"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  MessageCircle,
  Maximize2,
  ShieldCheck,
  Heart,
} from "lucide-react";

export interface FeedbackScreenshot {
  id: string;
  title: string;
  customerName: string;
  location: string;
  piece?: string;
  imageUrl: string;
  caption?: string;
  date?: string;
}

export interface VideoReel {
  id: number | string;
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

import initialReviewData from "@/data/clientReviews.json";

const defaultVideoReels: VideoReel[] = (initialReviewData.videoReels || []) as VideoReel[];
const defaultScreenshots: FeedbackScreenshot[] = (initialReviewData.feedbackScreenshots || []) as FeedbackScreenshot[];

function AutoPlayingReelCard({
  reel,
  onClick,
}: {
  reel: VideoReel;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    video.play().catch(() => {});

    return () => {
      observer.disconnect();
    };
  }, [reel.videoUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isDirectVideo =
    reel.videoUrl &&
    (reel.videoUrl.includes(".mp4") ||
      reel.videoUrl.includes(".webm") ||
      reel.videoUrl.includes("blob.vercel-storage.com") ||
      reel.videoUrl.startsWith("/uploads/") ||
      reel.videoUrl.startsWith("data:video") ||
      reel.videoUrl.includes("assets.mixkit.co"));

  return (
    <div
      onClick={onClick}
      className="group relative aspect-[9/15] rounded-xl overflow-hidden bg-stone-900 shadow-md cursor-pointer border border-stone-300/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
    >
      {/* Autoplaying live video element */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={reel.poster}
          alt={reel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 flex flex-col justify-between p-3 text-white pointer-events-none">
        {/* Top Views & Sound Toggle */}
        <div className="flex items-center justify-between text-[10px] pointer-events-auto">
          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{reel.views}</span>
          </span>

          {isDirectVideo && (
            <button
              type="button"
              onClick={toggleSound}
              className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur flex items-center justify-center text-white transition-all shadow"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
            </button>
          )}
        </div>

        {/* Center Hover Action */}
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110">
          <Play className="w-4 h-4 fill-current ml-0.5 text-stone-900" />
        </div>

        {/* Bottom Details */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-white line-clamp-1 leading-snug drop-shadow-sm">
            {reel.title}
          </p>
          <p className="text-[10px] text-white/80 font-medium drop-shadow-sm">
            {reel.handle}
          </p>
          {reel.productTitle && (
            <span className="inline-block text-[9px] text-amber-300 font-semibold bg-white/10 px-1.5 py-0.5 rounded">
              {reel.productTitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerReviewsWithVideos() {
  const [videoReels, setVideoReels] = useState<VideoReel[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("gleamnest_cached_reels");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultVideoReels;
  });

  const [feedbackScreenshots, setFeedbackScreenshots] = useState<FeedbackScreenshot[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("gleamnest_cached_screenshots");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultScreenshots;
  });

  const [selectedVideo, setSelectedVideo] = useState<VideoReel | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<FeedbackScreenshot | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  // Fetch fresh data from API and cache in sessionStorage for 0ms subsequent loads
  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.videoReels) && data.videoReels.length > 0) {
          setVideoReels(data.videoReels);
          try {
            sessionStorage.setItem("gleamnest_cached_reels", JSON.stringify(data.videoReels));
          } catch {}
        }
        if (Array.isArray(data.feedbackScreenshots) && data.feedbackScreenshots.length > 0) {
          setFeedbackScreenshots(data.feedbackScreenshots);
          try {
            sessionStorage.setItem("gleamnest_cached_screenshots", JSON.stringify(data.feedbackScreenshots));
          } catch {}
        }
      })
      .catch((e) => console.error("Could not fetch reviews data:", e));
  }, []);

  // Update Left / Right Arrow states based on scroll position
  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Left arrow is disabled if scrollLeft is at or near 0
    setIsLeftDisabled(scrollLeft <= 6);
    // Right arrow is disabled when scrolled to the end
    setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth - 6);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    // Re-check after layout render
    const timer = setTimeout(updateScrollButtons, 100);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      clearTimeout(timer);
    };
  }, [feedbackScreenshots]);

  // Scroll 2 cards at a time (scrolls by container clientWidth)
  const scrollPrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedVideo || selectedScreenshot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedVideo, selectedScreenshot]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
        setSelectedScreenshot(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="w-full bg-[#FAF7F2] py-10 sm:py-12 md:py-14 border-t border-[#EADBBE]/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
            IN THEIR WORDS
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#1C1917]">
            From our customers
          </h2>
        </div>

        {/* Dual Showcase: Video Reels on Left + Verified Customer Feedback Screenshots on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
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
                <AutoPlayingReelCard
                  key={reel.id}
                  reel={reel}
                  onClick={() => setSelectedVideo(reel)}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Scrollable 2 Cards at a time Customer Feedback Screenshots */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
            {/* Header for Screenshots */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-700 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Client Feedback & Screenshots</span>
              </span>
              <span className="text-[11px] text-stone-500">Real WhatsApp & DM reviews</span>
            </div>

            {/* Scrollable Container (Shows exactly 2 cards at a time) */}
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {feedbackScreenshots.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedScreenshot(item)}
                  className="w-[calc(50%-6px)] sm:w-[calc(50%-8px)] min-w-[calc(50%-6px)] sm:min-w-[calc(50%-8px)] flex-shrink-0 snap-start rounded-xl sm:rounded-2xl bg-[#FFFDF9] border border-[#EADBBE] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between group"
                >
                  {/* WhatsApp-styled customer header */}
                  <div className="px-3 sm:px-4 py-2.5 bg-[#FAF5EB] border-b border-[#EADBBE]/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex-shrink-0 flex items-center justify-center">
                        <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      </div>
                      <div className="min-w-0 truncate">
                        <p className="text-xs font-bold text-[#1C1917] truncate leading-tight">
                          {item.customerName}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">{item.location}</p>
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0 flex items-center gap-0.5 sm:gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Screenshot Image Frame */}
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Customer feedback screenshot"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-stone-900 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Click to View</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Piece & Caption / Description if any */}
                  <div className="p-3 sm:p-3.5 bg-[#FFFDF9] space-y-1.5 border-t border-[#EADBBE]/50 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      {item.piece && (
                        <div className="inline-block px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FAF5EB] text-[#8F7234] text-[9px] sm:text-[10px] font-semibold truncate max-w-full">
                          Piece: {item.piece}
                        </div>
                      )}
                      {item.caption && (
                        <p className="text-[11px] sm:text-xs text-stone-700 italic font-light line-clamp-2 leading-relaxed">
                          &ldquo;{item.caption}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[9px] sm:text-[10px] text-stone-500 border-t border-stone-100">
                      <span className="truncate">{item.date || "Verified WhatsApp Order"}</span>
                      <span className="text-[#C5A059] font-medium flex items-center gap-0.5 flex-shrink-0">
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-rose-500" />
                        <span>Loved</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls (Left disabled at first, enables after scrolling, right disabled at end) */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={isLeftDisabled}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    isLeftDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-sm cursor-pointer"
                  }`}
                  aria-label="Previous screenshots"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={isRightDisabled}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    isRightDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-sm cursor-pointer"
                  }`}
                  aria-label="Next screenshots"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <CheckCircle2 className="w-4 h-4 text-[#114E45]" />
                <span className="hidden sm:inline">100% Genuine WhatsApp & DM Proof</span>
                <span className="sm:hidden">Verified Proof</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Lightbox Modal (Clickable with Description if any) */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-2xl border border-[#EADBBE] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-5 py-3.5 bg-[#FAF5EB] border-b border-[#EADBBE] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                    <span>{selectedScreenshot.customerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-stone-500">{selectedScreenshot.location}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enlarged Screenshot Image */}
            <div className="p-3 bg-stone-950/5 overflow-y-auto flex items-center justify-center max-h-[55vh]">
              <img
                src={selectedScreenshot.imageUrl}
                alt={selectedScreenshot.title || "Customer feedback screenshot"}
                className="w-auto h-auto max-w-full max-h-[50vh] object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Modal Footer with Description if any */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#EADBBE] space-y-2.5 flex-shrink-0 overflow-y-auto max-h-[30vh]">
              {selectedScreenshot.piece && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8F7234] text-xs font-semibold">
                  Verified Piece: {selectedScreenshot.piece}
                </span>
              )}
              {selectedScreenshot.caption && (
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F7234]">
                    Customer Review / Description:
                  </p>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-light italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBBE]/70">
                    &ldquo;{selectedScreenshot.caption}&rdquo;
                  </p>
                </div>
              )}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>{selectedScreenshot.date || "Verified WhatsApp Order"}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% Authentic Customer Feedback
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player (Plays with sound when clicked) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-700 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-[9/16] bg-black flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.poster}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Tag Bar */}
            <div className="p-4 bg-stone-950 flex items-center justify-between text-white border-t border-stone-800">
              <div>
                <p className="text-xs font-semibold">{selectedVideo.productTitle}</p>
                <p className="text-[11px] text-amber-400 font-mono">₹{selectedVideo.productPrice}</p>
              </div>

              {selectedVideo.productSlug && selectedVideo.productSlug !== "all" && (
                <Link
                  href={`/products/${selectedVideo.productSlug}`}
                  className="px-4 py-1.5 rounded-full bg-white text-stone-900 text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  Shop Piece
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
