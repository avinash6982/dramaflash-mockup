import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Series } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = { series: Series; onWatch: () => void };

// Featured series at the top of Home
export function HomeHero({ series, onWatch }: Props) {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [inMyList, setInMyList] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={series.poster}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={IMAGE_FADE_MS}
      />
      <LinearGradient
        colors={["transparent", colors.background]}
        locations={[0.35, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.tagRow}>
          <View style={styles.spotlight}>
            <Text style={styles.spotlightText}>{t("home.spotlight")}</Text>
          </View>
          <Text style={styles.genres}>{series.genres.map((genre) => t(`genres.${genre}`)).join("  •  ")}</Text>
        </View>

        <Text style={styles.title}>{localized(series.title)}</Text>
        <Text style={styles.synopsis}>{localized(series.synopsis)}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.ratingText}>{series.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.ratingText}>{t("home.episodes", { count: series.totalEpisodes })}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.watchButton, pressed && pressedStyle]}
            onPress={onWatch}
            accessibilityRole="button"
          >
            <Ionicons name="play-outline" size={18} color={colors.onPrimary} />
            <Text style={styles.watchText}>{t("home.watchNow")}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && pressedStyle]}
            onPress={() => setInMyList((value) => !value)}
            accessibilityRole="button"
          >
            <Ionicons name={inMyList ? "checkmark" : "add"} size={22} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 500, justifyContent: "flex-end" },
  content: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  spotlight: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: "rgba(203,100,247,0.2)",
  },
  spotlightText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.accent },
  genres: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, flexShrink: 1 },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.textPrimary },
  synopsis: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  dot: { color: colors.textMuted },
  actions: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  watchButton: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  watchText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.onPrimary },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
