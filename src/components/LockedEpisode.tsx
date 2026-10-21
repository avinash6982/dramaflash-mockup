import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Series } from "@/data/series";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = { series: Series; index: number; onUnlock: () => void };

// What a locked episode shows instead of the video: the artwork, blurred, with an unlock card
export function LockedEpisode({ series, index, onUnlock }: Props) {
  const { t } = useTranslation();

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={series.poster} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={40} />
      <View style={styles.dim} />
      <View style={styles.center}>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && pressedStyle]}
          onPress={onUnlock}
          accessibilityRole="button"
        >
          <View>
            <Ionicons name="lock-closed" size={32} color={colors.textPrimary} />
            <View style={styles.coin}>
              <Ionicons name="flash" size={11} color={colors.onPrimary} />
            </View>
          </View>
          <Text style={styles.text}>{t("player.unlockEpisode", { number: index + 1 })}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.3)" },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  card: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(24,23,43,0.9)",
  },
  coin: {
    position: "absolute",
    right: -10,
    bottom: -4,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: colors.lockCoin,
  },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.textPrimary },
});
