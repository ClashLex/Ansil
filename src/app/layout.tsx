import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--ff-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--ff-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ansil Muhammed N S — Links",
  description:
    "Connect with Ansil Muhammed N S — Engineer, Builder, Open Source advocate. GitHub, Twitter, Instagram, LinkedIn, GitLab.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
