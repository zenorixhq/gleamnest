"use client";

import { useState } from "react";
import { storeConfig } from "@/config/store.config";
import { X, Sparkles } from "lucide-react";

import { useCartStore } from "@/store/useCartStore";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);

  if (!storeConfig.features.enableAnnouncementBar || !visible) {
    return null;
  }

  const isQatar = selectedCurrency === "QAR";
  const announcement = isQatar
    ? "✨ 100% Anti-Tarnish & Waterproof Everyday Jewelry • Free Delivery Across Qatar on All Orders • Order on WhatsApp"
    : storeConfig.features.announcementText;

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 text-xs sm:text-sm font-medium transition-all relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 pr-6">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 animate-pulse text-accent" />
        <span className="text-center truncate">
          {announcement}
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
