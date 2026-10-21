// Placeholder so the series screen can navigate; replaced by the vertical player (next task)
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { clampEpisodeIndex, findSeries } from "@/data/series";
import { useGoBack } from "@/hooks/useGoBack";
import { useLocalized } from "@/hooks/useLocalized";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

export default function WatchScreen() {
  const { id, episode } = useLocalSearchParams<{ id: string; episode?: string }>();
  const goBack = useGoBack();
  const localized = useLocalized();
  const series = findSeries(id);

  if (!series) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{localized(series.title)}</Text>
      <Text style={styles.text}>Episode {clampEpisodeIndex(episode, series.episodes.length) + 1}</Text>
      <Pressable onPress={goBack} accessibilityRole="button">
        <Text style={styles.back}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.textPrimary },
  text: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted },
  back: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.primary },
});
