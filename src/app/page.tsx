import BackgroundBlobs from "@/components/BackgroundBlobs";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import LinksSection from "@/components/LinksSection";
import SnakeGame from "@/components/SnakeGame";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { ToastProvider } from "@/components/Toast";
import LiquidGlassInit from "@/components/LiquidGlassInit";

export default function Home() {
  return (
    <ToastProvider>
      <CustomCursor />
      <BackgroundBlobs />
      <TopBar />
      <Hero />
      <MarqueeStrip />
      <LinksSection />
      <SnakeGame />
      <Footer />
      <LiquidGlassInit />
    </ToastProvider>
  );
}
