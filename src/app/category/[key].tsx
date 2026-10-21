import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PosterGrid } from "@/components/PosterGrid";
import { categorySeries } from "@/data/discover";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useGoBack } from "@/hooks/useGoBack";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

// "See all" of a Home rail: every series of that category in one grid
export default function CategoryScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { t } = useTranslation();
  const goBack = useGoBack();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();

  const list = categorySeries(key);
  // Unknown or missing key (bad link): show nothing instead of crashing
  if (!list) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.back, pressed && pressedStyle]}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel={t("series.back")}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {t(`home.${key}` as "home.trendingRomance")}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: bottomInset + 24 }}
      >
        <PosterGrid series={list} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20 },
  back: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: colors.surface,
  },
  title: { flex: 1, fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
});
