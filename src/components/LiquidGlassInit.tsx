"use client";

import { useEffect } from "react";
import { liquidGlass } from "../lib/liquid-glass";

/**
 * Applies liquid glass effect to specific elements after mount.
 */
export default function LiquidGlassInit() {
  useEffect(() => {
    const destroyers: (() => void)[] = [];

    // Header
    const headerEl = document.querySelector(".top-bar") as HTMLElement;
    if (headerEl) {
      const r = liquidGlass(headerEl, {
        scale: -40,
        blur: 12,
        saturate: 1.2,
      });
      destroyers.push(r.destroy);
    }

    // Featured Card (only full Liquid Glass on the first card to save CPU)
    const featuredCard = document.getElementById(
      "link-github"
    ) as HTMLElement;
    if (featuredCard) {
      const r = liquidGlass(featuredCard, {
        scale: -112,
        blur: 16,
        saturate: 1.3,
      });
      destroyers.push(r.destroy);
    }

    // Footer CTA
    const footerCta = document.querySelector(".footer-cta") as HTMLElement;
    if (footerCta) {
      const r = liquidGlass(footerCta, {
        scale: -40,
        blur: 10,
        saturate: 1.25,
      });
      destroyers.push(r.destroy);
    }

    return () => {
      destroyers.forEach((d) => d());
    };
  }, []);

  return null;
}
