import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";

type Props = {
  solid: boolean; // solid once the page has scrolled past the hero
  onLogoPress: () => void; // the logo takes you back to the top of Home
};

// App bar that floats over the hero: logo on the left, actions on the right
export function HomeHeader({ solid, onLogoPress }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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
      <Pressable
        style={({ pressed }) => [styles.logo, pressed && pressedStyle]}
        onPress={onLogoPress}
        accessibilityRole="button"
        accessibilityLabel={t("home.backToTop")}
      >
        <Ionicons name="heart-outline" size={22} color={colors.onPrimary} />
      </Pressable>

      <View style={styles.actions}>
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
  avatar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
  },
});
