"use client";

import { useState, useEffect, useRef } from "react";
import {
  Instagram,
  Play,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Sparkles,
  Maximize2,
} from "lucide-react";

export interface InstagramVideoItem {
  id: string | number;
  title: string;
  handle?: string;
  caption?: string;
  videoUrl: string;
  embedUrl?: string;
  poster?: string;
  views?: string;
  instagramLink?: string;
}

const defaultInstagramVideos: InstagramVideoItem[] = [
  {
    id: "insta-1",
    title: "Daily Jewelry Stack & Styling Glow",
    handle: "@gleamnest.in",
    caption: "Waterproof & anti-tarnish everyday luxury crafted in 304 & 306 steel ✨",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-jewelry-in-front-of-a-mirror-42407-large.mp4",
    poster: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=700",
    views: "28.4K",
    instagramLink: "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5",
  },
  {
    id: "insta-2",
    title: "Anti-Tarnish Water & Perfume Test",
    handle: "@gleamnest.in",
    caption: "Shower safe, sweatproof, and designed to never turn green 💧",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-showing-a-gold-ring-42409-large.mp4",
    poster: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700",
    views: "34.1K",
    instagramLink: "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5",
  },
  {
    id: "insta-3",
    title: "Unboxing the GleamNest Velvet Pouch",
    handle: "@gleamnest.in",
    caption: "Every order packed with real care. Pan-India delivery via DTDC & India Post 📦",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-gold-ring-in-hand-42410-large.mp4",
    poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=700",
    views: "19.8K",
    instagramLink: "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5",
  },
  {
    id: "insta-4",
    title: "Earrings & Hoops Real Mirror Finish",
    handle: "@gleamnest.in",
    caption: "Lightweight, hypoallergenic, and crafted for all-day sensitive ear wear ✨",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-jewelry-in-front-of-a-mirror-42407-large.mp4",
    poster: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=700",
    views: "22.5K",
    instagramLink: "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5",
  },
];

function AutoPlayingInstaCard({
  vid,
  onClick,
}: {
  vid: InstagramVideoItem;
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
  }, [vid.videoUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isDirectVideo =
    vid.videoUrl &&
    (vid.videoUrl.includes(".mp4") ||
      vid.videoUrl.includes(".webm") ||
      vid.videoUrl.includes("blob.vercel-storage.com") ||
      vid.videoUrl.startsWith("/uploads/") ||
      vid.videoUrl.startsWith("data:video") ||
      vid.videoUrl.includes("assets.mixkit.co"));

  return (
    <div
      onClick={onClick}
      className="group relative aspect-[9/15] rounded-2xl overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer border border-[#EADBBE]"
    >
      {/* Active playing video directly in card */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          src={vid.videoUrl}
          poster={vid.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={
            vid.poster ||
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700"
          }
          alt={vid.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}

      {/* Gradient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 flex flex-col justify-between p-3.5 sm:p-4 text-white pointer-events-none">
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{vid.views ? `${vid.views} views` : "Reel"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isDirectVideo && (
              <button
                type="button"
                onClick={toggleSound}
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur flex items-center justify-center text-white transition-all shadow"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
              <Instagram className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Center Hover Action */}
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-xl group-hover:scale-110">
          <Maximize2 className="w-4 h-4 text-[#1C1917]" />
        </div>

        {/* Bottom Details */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1 leading-snug drop-shadow-sm">
            {vid.title}
          </p>
          <p className="text-[11px] text-white/85 line-clamp-1 font-light drop-shadow-sm">
            {vid.caption}
          </p>
          <span className="inline-block text-[10px] text-[#F3DFB0] font-mono tracking-wider">
            {vid.handle || "@gleamnest.in"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function InstagramReelSection() {
  const [videos, setVideos] = useState<InstagramVideoItem[]>(defaultInstagramVideos);
  const [activeVideo, setActiveVideo] = useState<InstagramVideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.instagramVideos) && data.instagramVideos.length > 0) {
          setVideos(data.instagramVideos);
        }
      })
      .catch((e) => console.error("Error fetching Instagram videos:", e));
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeVideo) {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-t border-[#EADBBE]/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
              FOLLOW THE HOUSE
            </span>
          </div>

          <a
            href="https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1C1917] hover:text-[#C5A059] transition-colors"
          >
            <span>@gleamnest.in</span>
            <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-[#C5A059]" />
          </a>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md mx-auto">
            Watch our latest styling reels, water tests, and styling inspiration directly on site.
          </p>
        </div>

        {/* Video Reels Grid (Continuous Autoplay on Site) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {videos.map((vid) => (
            <AutoPlayingInstaCard
              key={vid.id}
              vid={vid}
              onClick={() => setActiveVideo(vid)}
            />
          ))}
        </div>

        {/* Bottom CTA to Instagram Profile */}
        <div className="text-center pt-2">
          <a
            href="https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @gleamnest.in on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Video Modal Player (Expanded View with Audio) */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold truncate max-w-[200px]">{activeVideo.title}</h4>
                  <p className="text-[10px] text-stone-400">{activeVideo.handle || "@gleamnest.in"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-[9/15] max-h-[68vh] bg-black flex items-center justify-center overflow-hidden">
              {activeVideo.embedUrl ? (
                <iframe
                  src={activeVideo.embedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoPlayerRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.poster}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Caption & Instagram CTA Bar */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3 text-white">
              <div className="space-y-0.5 max-w-[65%]">
                <p className="text-xs font-semibold truncate">{activeVideo.title}</p>
                <p className="text-[11px] text-stone-400 line-clamp-1">{activeVideo.caption}</p>
              </div>

              {activeVideo.instagramLink && (
                <a
                  href={activeVideo.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#E1306C] text-white text-xs font-semibold hover:bg-[#C1275B] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>View Post</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
