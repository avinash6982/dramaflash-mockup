import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { Series } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

export const POSTER_WIDTH = 128;
const POSTER_RATIO = 1.5; // height / width

type Props = { series: Series; onPress: () => void; width?: number };

export function PosterCard({ series, onPress, width = POSTER_WIDTH }: Props) {
  const { t } = useTranslation();
  const localized = useLocalized();
  const title = localized(series.title);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && pressedStyle}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.poster, { width, height: Math.round(width * POSTER_RATIO) }]}>
        <Image
          source={series.poster}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={IMAGE_FADE_MS}
        />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} style={styles.bottomFade} />
        {series.isPro && (
          <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proBadge}
          >
            <MaterialCommunityIcons name="crown-outline" size={12} color={colors.onPrimary} />
            <Text style={styles.proText}>PRO</Text>
          </LinearGradient>
        )}
        <View style={styles.meta}>
          <Text style={styles.metaText}>{t("home.epsShort", { count: series.totalEpisodes })}</Text>
          <Text style={styles.metaText}>
            {t("home.minPerEp", { count: series.minutesPerEpisode })}
          </Text>
        </View>
      </View>
      <Text style={[styles.title, { width }]} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  poster: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  bottomFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 56 },
  proBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  proText: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.onPrimary },
  meta: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.textPrimary },
  title: {
    marginTop: 8,
    fontFamily: fonts.displaySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
