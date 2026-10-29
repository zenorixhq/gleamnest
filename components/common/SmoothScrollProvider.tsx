"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect user accessibility preference
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with luxury momentum deceleration tuned for 60-120fps displays
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      syncTouch: false, // Keep native 120Hz capacitive touch on mobile/tablets with zero lag
      autoRaf: false,
      allowNestedScroll: true,
      prevent: (node: HTMLElement) => {
        if (!node) return false;
        // Never hijack or smooth scroll inside any modal, dialog, fixed overlay, drawer, or prevent container
        return (
          node.hasAttribute?.("data-lenis-prevent") ||
          Boolean(node.closest?.("[data-lenis-prevent]")) ||
          Boolean(node.closest?.(".fixed")) ||
          Boolean(node.closest?.("[role='dialog']")) ||
          Boolean(node.closest?.("[aria-modal='true']"))
        );
      },
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    // High FPS animation frame loop
    let rafId: number;
    function update(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    // Smoothly scroll to in-page anchor links (e.g., #reviews, #categories, #about)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.2 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick, { passive: false });

    // Watch for modal scroll locks (document.body.style.overflow = "hidden")
    const checkScrollLock = () => {
      const isLocked =
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden" ||
        document.body.classList.contains("overflow-hidden") ||
        document.body.classList.contains("modal-open");
      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver(checkScrollLock);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      observer.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, []);

  // When pathname changes, immediately reset scroll to top without fighting page transition
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
