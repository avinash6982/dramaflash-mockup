import { DarkTheme } from "expo-router";

import { colors } from "./colors";

// React Navigation paints every screen with its theme colours while transitioning.
// The default theme is light, which shows up as a white flash, so use the app's dark tokens.
export const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
  },
};
