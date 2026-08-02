"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface ToastContextType {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    const area = areaRef.current;
    if (!area) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    area.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(10px) scale(0.95)";
      t.style.transition = "all 0.3s ease";
      setTimeout(() => t.remove(), 300);
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div id="toast-area" ref={areaRef} />
      {children}
    </ToastContext.Provider>
  );
}
