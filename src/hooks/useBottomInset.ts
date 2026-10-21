import { useSafeAreaInsets } from "react-native-safe-area-context";

// Minimum gap at the bottom: the safe-area inset is 0 on web and on phones without a home indicator
const MIN_BOTTOM_INSET = 16;

// Bottom spacing for the tab bar, sheets and any screen that sits at the bottom edge
export function useBottomInset() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, MIN_BOTTOM_INSET);
}
