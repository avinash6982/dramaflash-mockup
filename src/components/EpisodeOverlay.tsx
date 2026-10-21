import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

import type { Series } from "@/data/series";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useLocalized } from "@/hooks/useLocalized";
import { formatCount } from "@/i18n/format";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { PROGRESS_BAR_SPACE } from "./EpisodeProgress";

const BASE_LIKES = 12000;

type Props = { series: Series; index: number };

// Text and buttons drawn over every episode page: title, episode badge and the right-hand rail
export function EpisodeOverlay({ series, index }: Props) {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const bottomInset = useBottomInset();
  const [liked, setLiked] = useState(false);

  const title = localized(series.title);
  const share = () => Share.share({ message: title }).catch(() => {});

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.75)"]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      <View
        style={[styles.info, { paddingBottom: bottomInset + PROGRESS_BAR_SPACE + 12 }]}
        pointerEvents="none"
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t("player.episodeShort", { number: index + 1 })}</Text>
          </View>
          <Text style={styles.duration}>{series.episodes[index].duration}</Text>
        </View>
      </View>

      <View style={[styles.rail, { bottom: bottomInset + PROGRESS_BAR_SPACE + 28 }]}>
        <Pressable
          style={({ pressed }) => [styles.railButton, pressed && pressedStyle]}
          onPress={() => setLiked((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={t("player.like")}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={30}
            color={liked ? colors.accent : colors.textPrimary}
          />
          <Text style={styles.railText}>
            {formatCount(BASE_LIKES + (liked ? 1 : 0), i18n.language)}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.railButton, pressed && pressedStyle]}
          onPress={share}
          accessibilityRole="button"
          accessibilityLabel={t("series.share")}
        >
          <Ionicons name="share-social-outline" size={28} color={colors.textPrimary} />
          <Text style={styles.railText}>{t("series.share")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 260 },
  info: { position: "absolute", left: 20, right: 90, bottom: 0, gap: 10 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.textPrimary },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textPrimary },
  duration: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textMuted },
  rail: { position: "absolute", right: 16, alignItems: "center", gap: 22 },
  railButton: { alignItems: "center", gap: 4 },
  railText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textPrimary },
});
