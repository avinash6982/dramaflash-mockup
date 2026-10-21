// Placeholder so Home can navigate; replaced by the real series detail screen (next task)
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getSeries } from "@/data/series";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

export default function SeriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getSeries(id).title}</Text>
      <Pressable onPress={() => router.back()} accessibilityRole="button">
        <Text style={styles.back}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.textPrimary },
  back: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.primary },
});
