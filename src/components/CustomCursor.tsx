"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, .menu__item-link, .theme-toggle, canvas";

function closestInteractive(target: EventTarget | null): Element | null {
  if (!target || !(target instanceof Element)) return null;
  return target.closest(INTERACTIVE_SELECTOR);
}

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    if (!cur) return;
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let initialized = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!initialized) {
        curX = targetX;
        curY = targetY;
        initialized = true;
        document.body.classList.add("cursor-active");
        cur.style.opacity = "1";
      }
    };

    const loop = () => {
      curX += (targetX - curX) * 0.2;
      curY += (targetY - curY) * 0.2;
      cur.style.left = curX + "px";
      cur.style.top = curY + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Delegated hover state — works for dynamically added nodes too.
    const onOver = (e: MouseEvent) => {
      if (closestInteractive(e.target)) cur.classList.add("active");
    };
    const onOut = (e: MouseEvent) => {
      if (
        closestInteractive(e.target) &&
        !closestInteractive(e.relatedTarget)
      ) {
        cur.classList.remove("active");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("cursor-active");
    };
  }, []);

  return <div id="cursor" ref={curRef} />;
}
