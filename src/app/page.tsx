import LinksSection from "@/components/LinksSection";
import DarkModeButton from "@/components/DarkModeButton";
import ThemedBackground from "@/components/ThemedBackground";
import CustomCursor from "@/components/CustomCursor";
import { ToastProvider } from "@/components/Toast";
import ThemeProvider from "@/components/ThemeProvider";
import LiquidGlassInit from "@/components/LiquidGlassInit";

export default function Home() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <CustomCursor />
        <ThemedBackground />
        <LinksSection />
        <DarkModeButton />
        <LiquidGlassInit />
      </ThemeProvider>
    </ToastProvider>
  );
}
