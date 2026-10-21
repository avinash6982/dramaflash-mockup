import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { pressedStyle } from "@/theme/interaction";

type Props = { message: string; onRetry: () => void };

// Last-resort screen when something crashes. Plain English on purpose: the crash may be in the
// translation setup itself, so this screen must not depend on it.
export function ErrorScreen({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message} numberOfLines={4}>
        {message}
      </Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && pressedStyle]}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
  message: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, textAlign: "center" },
  button: {
    marginTop: 8,
    paddingHorizontal: 28,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  buttonText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.onPrimary },
});
