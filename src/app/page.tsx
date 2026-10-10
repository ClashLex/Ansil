import LinksSection from "@/components/LinksSection";
import ThemedBackground from "@/components/ThemedBackground";
import CustomCursor from "@/components/CustomCursor";
import { ToastProvider } from "@/components/Toast";
import ThemeProvider from "@/components/ThemeProvider";

export default function Home() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <CustomCursor />
        <ThemedBackground />
        <LinksSection />
      </ThemeProvider>
    </ToastProvider>
  );
}
