import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { setLanguage } from "@/i18n";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

type Props = { solid: boolean }; // solid once the page has scrolled past the hero

// App bar that floats over the hero: logo on the left, actions on the right
export function HomeHeader({ solid }: Props) {
  const { i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isGerman = i18n.language === "de";

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8 },
        solid && { backgroundColor: colors.background },
      ]}
    >
      {!solid && (
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      <View style={styles.logo}>
        <Ionicons name="heart-outline" size={22} color={colors.onPrimary} />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.language}
          onPress={() => setLanguage(isGerman ? "en" : "de")}
          accessibilityRole="button"
          accessibilityLabel="Language"
        >
          <Text style={styles.languageText}>{isGerman ? "DE" : "EN"}</Text>
        </Pressable>
        <Ionicons name="search-outline" size={22} color={colors.textPrimary} />
        <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color={colors.textMuted} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  logo: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 16 },
  language: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  languageText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textPrimary },
  avatar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
  },
});
