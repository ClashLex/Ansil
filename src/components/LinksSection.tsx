"use client";

import { useRef, useCallback } from "react";
import LinkCard from "./LinkCard";
import { useToast } from "./Toast";

// SVG icons
const GitHubIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.503 11.503 0 013.003-.404c1.018.005 2.042.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.29 19.495h2.039L6.482 3.239H4.294L17.611 20.648z" />
  </svg>
);

const InstagramIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm4.4 2.75a5.25 5.25 0 1 1-5.25 5.25A5.25 5.25 0 0 1 12 6.75zm0 1.75a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5zm5.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z" />
  </svg>
);

const LinkedInIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GitLabIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.137-.423-.733-.423-.868 0L1.387 9.452.045 13.587c-.121.38.016.797.326 1.026l11.63 8.442 11.629-8.442c.31-.229.447-.646.325-1.026z" />
  </svg>
);

const EmailIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const links = [
  {
    id: "link-github",
    href: "https://github.com/ClashLex",
    label: "GitHub",
    description: "Open source contributions",
    icon: GitHubIcon,
  },
  {
    id: "link-twitter",
    href: "https://twitter.com/Claashhhhh",
    label: "Twitter / X",
    description: "Thoughts & updates",
    icon: TwitterIcon,
  },
  {
    id: "link-instagram",
    href: "https://instagram.com/Claashhhhh",
    label: "Instagram",
    description: "Visual journal",
    icon: InstagramIcon,
  },
  {
    id: "link-linkedin",
    href: "https://www.linkedin.com/in/ansil-muhammed-n-s-882449377",
    label: "LinkedIn",
    description: "Professional network",
    icon: LinkedInIcon,
  },
  {
    id: "link-gitlab",
    href: "https://gitlab.com/ClashLex",
    label: "GitLab",
    description: "Additional repositories",
    icon: GitLabIcon,
  },
  {
    id: "link-email",
    href: "mailto:ansilmuhammed919@gmail.com",
    label: "Email",
    description: "Get in touch directly",
    icon: EmailIcon,
  },
];

// Audio context singleton
let audioCtx: AudioContext | null = null;

function initAudio() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTick() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    1200,
    audioCtx.currentTime + 0.04
  );
  gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
}

export default function LinksSection() {
  const { showToast } = useToast();

  const handleClick = useCallback(
    (label: string) => {
      playTick();
      showToast("Opening " + label);
    },
    [showToast]
  );

  return (
    <section className="links-section">
      <p className="section-header" />
      <nav className="link-stack" aria-label="Social links">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            id={link.id}
            href={link.href}
            label={link.label}
            description={link.description}
            icon={link.icon}
            onClick={() => handleClick(link.label)}
          />
        ))}
      </nav>
    </section>
  );
}

export { initAudio };
