import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack, ThemeProvider } from "expo-router";
import type { ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { AppFrame } from "@/components/AppFrame";
import { BuyCoinsSheet } from "@/components/BuyCoinsSheet";
import { ErrorScreen } from "@/components/ErrorScreen";
import { MembershipSheet } from "@/components/MembershipSheet";
import { SeasonPurchaseSheet } from "@/components/SeasonPurchaseSheet";
import { initI18n } from "@/i18n";
import { restoreSaved, store } from "@/store";
import { loadSavedState, startSaving } from "@/store/persist";
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
    // The saved language and the saved data are loaded before the first screen, so nothing flashes.
    // finally: if setup fails the app still opens (texts fall back to their keys) instead of hanging on the splash
    Promise.all([initI18n(), loadSavedState()])
      .then(([, saved]) => {
        if (saved) store.dispatch(restoreSaved(saved));
        startSaving(store);
      })
      .finally(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Provider store={store}>
      <ThemeProvider value={navigationTheme}>
        <AppFrame>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
            <BottomSheetModalProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }} />
              <BuyCoinsSheet />
              <MembershipSheet />
              <SeasonPurchaseSheet />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AppFrame>
      </ThemeProvider>
    </Provider>
  );
}
