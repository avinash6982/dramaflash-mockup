// Placeholder so the series screen can navigate; replaced by the vertical player (next task)
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { findSeries } from "@/data/series";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

export default function WatchScreen() {
  const { id, episode } = useLocalSearchParams<{ id: string; episode?: string }>();
  const router = useRouter();
  const series = findSeries(id);

  if (!series) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{series.title}</Text>
      <Text style={styles.text}>Episode {Number(episode ?? 0) + 1}</Text>
      <Pressable onPress={() => router.back()} accessibilityRole="button">
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
