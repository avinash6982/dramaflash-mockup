import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PosterGrid } from "@/components/PosterGrid";
import { findSeries } from "@/data/series";
import type { Series } from "@/data/series";
import { useAppSelector } from "@/store/hooks";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

const SIDE_PADDING = 20;

// The series the user hearted, newest first. Episodes are not listed here: their likes are only remembered.
export default function FavouritesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const seriesIds = useAppSelector((state) => state.favourites.seriesIds);

  const favourites = seriesIds
    .map(findSeries)
    .filter((series): series is Series => series !== undefined);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>{t("tabs.favourites")}</Text>

      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{t("favourites.emptyTitle")}</Text>
          <Text style={styles.emptyHint}>{t("favourites.emptyHint")}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <PosterGrid series={favourites} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 16,
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
  },
  list: { paddingBottom: 24 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 32 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.textPrimary },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
