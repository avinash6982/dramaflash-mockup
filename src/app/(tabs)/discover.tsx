import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PosterGrid } from "@/components/PosterGrid";
import { Rail } from "@/components/Rail";
import { allGenres, newest, searchSeries, seriesInGenre, topRated } from "@/data/discover";
import type { GenreId, Series } from "@/data/series";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

const SIDE_PADDING = 20;
const RAIL_LENGTH = 6;

// Find something to watch: search by title or genre, browse by genre, or pick from the best rated
// and the newest. Home shows a hero and four genres; this tab is for looking around.
export default function DiscoverScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<GenreId | null>(null); // a genre tile that was tapped

  const openSeries = (id: string) => router.push({ pathname: "/series/[id]", params: { id } });

  // A typed search wins; otherwise a tapped genre; otherwise the browse view
  const searching = query.trim() !== "";
  const results: Series[] | null = searching
    ? searchSeries(query, i18n.language)
    : genre
      ? seriesInGenre(genre)
      : null;

  const clear = () => {
    setQuery("");
    setGenre(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>{t("tabs.discover")}</Text>

      <View style={styles.search}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={t("discover.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t("discover.searchPlaceholder")}
        />
        {(searching || genre) && (
          <Pressable
            onPress={clear}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t("discover.clear")}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {results === null ? (
          <View style={styles.browse}>
            <Text style={styles.sectionTitle}>{t("discover.browseByGenre")}</Text>
            <View style={styles.tiles}>
              {allGenres().map((id) => (
                <Pressable
                  key={id}
                  style={({ pressed }) => [styles.tile, pressed && pressedStyle]}
                  onPress={() => setGenre(id)}
                  accessibilityRole="button"
                >
                  <Text style={styles.tileText}>{t(`genres.${id}`)}</Text>
                </Pressable>
              ))}
            </View>

            <Rail
              title={t("discover.topRated")}
              series={topRated(RAIL_LENGTH)}
              onPressSeries={openSeries}
            />
            <Rail
              title={t("discover.newReleases")}
              series={newest(RAIL_LENGTH)}
              onPressSeries={openSeries}
            />
          </View>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {t("discover.noResults", { query: query.trim() })}
            </Text>
            <Text style={styles.emptyHint}>{t("discover.noResultsHint")}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.count}>
              {genre && !searching ? `${t(`genres.${genre}`)} • ` : ""}
              {t("discover.results", { count: results.length })}
            </Text>
            <PosterGrid series={results} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 14,
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
  },
  search: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: SIDE_PADDING,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  browse: { gap: 24 },
  sectionTitle: {
    paddingHorizontal: SIDE_PADDING,
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: -12,
    paddingHorizontal: SIDE_PADDING,
  },
  tile: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textPrimary },
  count: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 12,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
  },
  empty: { alignItems: "center", gap: 10, padding: 32, paddingTop: 48 },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    textAlign: "center",
    color: colors.textPrimary,
  },
  emptyHint: { fontFamily: fonts.body, fontSize: 14, textAlign: "center", color: colors.textMuted },
});
