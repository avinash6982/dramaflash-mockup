import { StyleSheet, View, useWindowDimensions } from "react-native";

import { colors } from "@/theme/colors";

// The app is designed for a phone. On a wide screen (web, tablets) it stays a centred phone-width
// column, so buttons, the progress bar and sheets line up as they do on a phone.
export const MAX_APP_WIDTH = 430;

export function AppFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isWide = width > MAX_APP_WIDTH;

  return (
    <View style={styles.outside}>
      <View style={[styles.frame, isWide && styles.frameEdges]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outside: { flex: 1, alignItems: "center", backgroundColor: colors.background },
  frame: { flex: 1, width: "100%", maxWidth: MAX_APP_WIDTH, overflow: "hidden" },
  frameEdges: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
});
