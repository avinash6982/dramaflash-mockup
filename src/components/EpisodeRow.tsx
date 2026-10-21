import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Episode } from "@/data/series";
import { useAppSelector } from "@/store/hooks";
import { isEpisodeLocked } from "@/store/unlocksSlice";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = { seriesId: string; index: number; episode: Episode; onPress: () => void };

// One line in the episode list: thumbnail with a play or lock badge, title and duration
export function EpisodeRow({ seriesId, index, episode, onPress }: Props) {
  const { t } = useTranslation();
  const locked = useAppSelector((state) => isEpisodeLocked(state, seriesId, index));

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && pressedStyle]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.thumb}>
        <Image
          source={episode.thumb}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={IMAGE_FADE_MS}
        />
        <View style={[styles.badge, locked ? styles.badgeLocked : styles.badgePlay]}>
          <Ionicons
            name={locked ? "lock-closed" : "play"}
            size={14}
            color={locked ? colors.textPrimary : colors.onPrimary}
          />
        </View>
      </View>

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={2}>
          {index + 1}. {episode.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.duration}>{episode.duration}</Text>
          {locked && (
            <>
              <Text style={styles.unlock}>{t("series.unlock")}</Text>
              <Ionicons name="lock-open-outline" size={14} color={colors.accent} />
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  thumb: {
    width: 96,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  badgePlay: { backgroundColor: colors.primary },
  badgeLocked: { backgroundColor: "rgba(0,0,0,0.65)" },
  text: { flex: 1, gap: 6 },
  title: { fontFamily: fonts.displaySemiBold, fontSize: 15, color: colors.textPrimary },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  duration: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginRight: 8 },
  unlock: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.accent },
});
