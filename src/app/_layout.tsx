import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack, ThemeProvider } from "expo-router";
import type { ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { ErrorScreen } from "@/components/ErrorScreen";
import { initI18n } from "@/i18n";
import { store } from "@/store";
import { colors } from "@/theme/colors";
import { navigationTheme } from "@/theme/navigationTheme";
import { fontAssets } from "@/theme/typography";

// Keep the splash screen up until the saved language and the fonts are loaded
SplashScreen.preventAutoHideAsync();

// Expo Router shows this when any screen throws while rendering
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorScreen message={error.message} onRetry={retry} />;
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // If a font fails to load, still start the app with the system font
  const ready = i18nReady && (fontsLoaded || fontError !== null);

  useEffect(() => {
    // finally: if setup fails the app still opens (texts fall back to their keys) instead of hanging on the splash
    initI18n().finally(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Provider store={store}>
      <ThemeProvider value={navigationTheme}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
          <BottomSheetModalProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
}
