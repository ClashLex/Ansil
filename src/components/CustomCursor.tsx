"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cur = curRef.current;
    if (!cur) return;
    if (cur.style.opacity !== "1") {
      document.body.classList.add("cursor-active");
      cur.style.opacity = "1";
    }
    cur.style.left = e.clientX + "px";
    cur.style.top = e.clientY + "px";
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

    window.addEventListener("mousemove", handleMouseMove);

    const interactiveEls = document.querySelectorAll(
      ".link-card, .footer-cta, a, button"
    );
    const enterHandler = () => curRef.current?.classList.add("active");
    const leaveHandler = () => curRef.current?.classList.remove("active");

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", enterHandler);
      el.addEventListener("mouseleave", leaveHandler);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", enterHandler);
        el.removeEventListener("mouseleave", leaveHandler);
      });
      document.body.classList.remove("cursor-active");
    };
  }, [handleMouseMove]);

  return <div id="cursor" ref={curRef} />;
}
