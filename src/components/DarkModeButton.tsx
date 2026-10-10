'use client';

import { useTheme } from './ThemeProvider';

/** A quiet editorial theme switch: two labelled states instead of a floating icon button. */
export default function DarkModeButton() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${dark ? 'is-dark' : 'is-light'}`}
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`theme-toggle__segment ${!dark ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        LIGHT
      </span>
      <span
        className={`theme-toggle__segment ${dark ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        DARK
      </span>
    </button>
  );
}