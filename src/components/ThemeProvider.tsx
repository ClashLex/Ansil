'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext<{ theme: Theme }>({ theme: 'light' });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Always render 'light' first so server + client HTML match (no hydration
  // mismatch); the real preference is applied in the effect below.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const media = window.matchMedia(DARK_SCHEME_QUERY);
    const sync = () => setTheme(media.matches ? 'dark' : 'light');

    sync();

    // Safari < 14 and some in-app WebKit shells only expose the legacy
    // addListener/removeListener API on MediaQueryList.
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', sync);
      return () => media.removeEventListener('change', sync);
    }

    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}