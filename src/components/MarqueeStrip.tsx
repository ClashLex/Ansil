"use client";

import { useEffect, useRef } from "react";

const items = [
  "Connect",
  "Collaborate",
  "Build",
  "Ship",
  "Open Source",
  "ClashLex",
];

export default function MarqueeStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inner = strip.querySelector(".marquee-inner") as HTMLElement;
          if (inner) {
            inner.style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  const content = items.map((item, i) => (
    <span key={i}>
      {item}
      <span className="dot" style={{ margin: "0 40px" }}>
        ·
      </span>
    </span>
  ));

  return (
    <div className="marquee-strip" aria-hidden="true" ref={stripRef}>
      <div className="marquee-inner">
        {content}
        {content}
      </div>
    </div>
  );
}
