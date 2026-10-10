# Editorial Light/Dark Toggle Refresh

This is a UI-only restyle for the existing `ClashLex/Ansil` Next.js portfolio. It keeps the current `ThemeProvider` behavior (theme preference storage and first-visit system preference) and changes the floating circle into a compact, labelled LIGHT / DARK segmented toggle.

## Apply

1. Replace `src/components/DarkModeButton.tsx` with the file in this package.
2. Append the contents of `patches/theme-toggle-override.css` to the end of `src/app/globals.css`.
3. Run `npm run build` to check the change.

No new packages are required. The CSS uses the existing theme variables from `globals.css`.
