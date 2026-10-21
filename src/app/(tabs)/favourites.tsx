import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PosterCard } from "@/components/PosterCard";
import { findSeries } from "@/data/series";
import type { Series } from "@/data/series";
import { useAppSelector } from "@/store/hooks";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

const COLUMNS = 2;
const SIDE_PADDING = 20;
const GAP = 14;

// The series the user hearted, newest first. Episodes are not listed here: their likes are only remembered.
export default function FavouritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const seriesIds = useAppSelector((state) => state.favourites.seriesIds);

  const favourites = seriesIds
    .map(findSeries)
    .filter((series): series is Series => series !== undefined);
  // Two cards fill the row, whatever the screen width
  const cardWidth = Math.floor((width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + 16 }]}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
    >
      <Text style={styles.title}>{t("tabs.favourites")}</Text>

      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{t("favourites.emptyTitle")}</Text>
          <Text style={styles.emptyHint}>{t("favourites.emptyHint")}</Text>
        </View>
      ) : (
        width > 0 && (
          <FlatList
            data={favourites}
            numColumns={COLUMNS}
            keyExtractor={(series) => series.id}
            renderItem={({ item }) => (
              <PosterCard
                series={item}
                width={cardWidth}
                onPress={() => router.push({ pathname: "/series/[id]", params: { id: item.id } })}
              />
            )}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )
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
  list: { paddingHorizontal: SIDE_PADDING, paddingBottom: 24 },
  row: { gap: GAP, marginBottom: 20 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 32 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.textPrimary },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
