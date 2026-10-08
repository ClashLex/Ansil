"use client";

import { useCallback } from "react";
import FlowingMenu from "./FlowingMenu";
import { useToast } from "./Toast";
import { useTheme } from "./ThemeProvider";
import { playTick } from "@/lib/audio";

const items = [
  {
    link: "https://github.com/ClashLex",
    text: "GitHub",
    image: "/Ansil/avatar.jpg",
  },
  {
    link: "https://twitter.com/Claashhhhh",
    text: "Twitter / X",
    image: "/Ansil/images/twitter/profile.jpg",
  },
  {
    link: "https://instagram.com/Claashhhhh",
    text: "Instagram",
    image: "/Ansil/images/instagram/profile.jpg",
  },
  {
    link: "https://www.linkedin.com/in/ansil-muhammed-n-s-882449377",
    text: "LinkedIn",
    image: "/Ansil/avatar.jpg",
  },
  {
    link: "https://gitlab.com/ClashLex",
    text: "GitLab",
    image: "/Ansil/profile.jpg",
  },
  {
    link: "mailto:ansilmuhammed919@gmail.com",
    text: "Email",
    image: "/Ansil/background.jpg",
  },
];

export default function LinksSection() {
  const { showToast } = useToast();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const handleSelect = useCallback(
    (label: string) => {
      playTick();
      showToast("Opening " + label);
    },
    [showToast]
  );

  return (
    <section className="links-section" aria-label="Social links">
      <FlowingMenu
        items={items}
        onItemClick={handleSelect}
        speed={12}
        textColor={dark ? "#F4F2ED" : "#1A1A1A"}
        bgColor="transparent"
        marqueeBgColor="#A855F7"
        marqueeTextColor="#FFFFFF"
        borderColor={dark ? "rgba(255, 255, 255, 0.14)" : "rgba(26, 26, 26, 0.12)"}
      />
    </section>
  );
}
