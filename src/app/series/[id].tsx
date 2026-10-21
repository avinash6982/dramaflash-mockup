import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EpisodeRow } from "@/components/EpisodeRow";
import { Rail } from "@/components/Rail";
import { SeasonBanner } from "@/components/SeasonBanner";
import { SEASON_PRICE_EUR } from "@/data/coinPacks";
import { alsoLikeSeriesIds, findSeries, getSeries } from "@/data/series";
import type { Series } from "@/data/series";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useGoBack } from "@/hooks/useGoBack";
import { useLocalized } from "@/hooks/useLocalized";
import { formatEuro } from "@/i18n/formatPrice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { isSeasonUnlocked, purchaseSeason } from "@/store/unlocksSlice";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

// Fixed heights above "Play Ep 1" put its top edge at 440, the same place as the Home hero's
// "Watch now" button (500 hero - 12 padding - 48 button), so it looks still when navigating between them.
// Exact at normal text size; with large system fonts or a two-line title it shifts down a little, nothing clips.
const HERO_HEIGHT = 314;

export default function SeriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const series = findSeries(id);

  // Unknown or missing id (bad link): show nothing instead of crashing
  if (!series) return null;
  return <SeriesDetail series={series} />;
}

function SeriesDetail({ series }: { series: Series }) {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const router = useRouter();
  const goBack = useGoBack();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const [isFavourite, setIsFavourite] = useState(false);

  const seasonUnlocked = useAppSelector((state) => isSeasonUnlocked(state, series.id));
  const purchasing = useAppSelector((state) => state.unlocks.purchasingSeasonId === series.id);

  const play = (episodeIndex: number) =>
    router.push({ pathname: "/watch/[id]", params: { id: series.id, episode: episodeIndex } });
  const openSeries = (seriesId: string) =>
    router.push({ pathname: "/series/[id]", params: { id: seriesId } });
  const share = () => Share.share({ message: localized(series.title) }).catch(() => {});

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomInset + 24 }}>
        <View style={styles.hero}>
          <Image
            source={series.poster}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={IMAGE_FADE_MS}
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            locations={[0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.body}>
          <View style={styles.tags}>
            {series.genres.map((genre) => (
              <View key={genre} style={styles.tag}>
                <Text style={styles.tagText}>{t(`genres.${genre}`)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{localized(series.title)}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="star-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.metaStrong}>{series.rating}</Text>
            <Text style={styles.meta}>({series.ratingCount})</Text>
            <Text style={styles.meta}>•</Text>
            <Text style={styles.metaStrong}>{series.year}</Text>
            <Text style={styles.meta}>•</Text>
            <Ionicons name="list-outline" size={16} color={colors.textMuted} />
            <Text style={styles.meta}>{t("home.epsShort", { count: series.totalEpisodes })}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.playButton, pressed && pressedStyle]}
              onPress={() => play(0)}
              accessibilityRole="button"
            >
              <Ionicons name="play-outline" size={18} color={colors.onPrimary} />
              <Text style={styles.playText}>{t("series.playEpisode", { number: 1 })}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && pressedStyle]}
              onPress={() => setIsFavourite((value) => !value)}
              accessibilityRole="button"
              accessibilityLabel={t("series.addToFavourites")}
            >
              <Ionicons
                name={isFavourite ? "heart" : "heart-outline"}
                size={22}
                color={isFavourite ? colors.accent : colors.textPrimary}
              />
            </Pressable>
          </View>

          <Text style={styles.heading}>{t("series.synopsis")}</Text>
          <Text style={styles.synopsis}>{localized(series.synopsis)}</Text>

          <View style={styles.highlights}>
            <View style={styles.highlightsTitleRow}>
              <Ionicons name="sparkles-outline" size={16} color={colors.accent} />
              <Text style={styles.highlightsTitle}>{t("series.whyYoullLoveIt")}</Text>
            </View>
            {series.highlights.map((line) => (
              <View key={line.en} style={styles.highlightRow}>
                <Ionicons name="flame-outline" size={16} color={colors.primary} />
                <Text style={styles.highlightText}>{localized(line)}</Text>
              </View>
            ))}
          </View>

          {series.cast.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.heading}>{t("series.castAndCrew")}</Text>
            </>
          )}
        </View>
        {series.cast.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castRow}
          >
            {series.cast.map((member) => (
              <View key={member.name} style={styles.cast}>
                <Image
                  source={member.photo}
                  style={styles.castPhoto}
                  contentFit="cover"
                  transition={IMAGE_FADE_MS}
                />
                <Text style={styles.castName} numberOfLines={1}>
                  {member.name}
                </Text>
                <Text style={styles.castRole} numberOfLines={2}>
                  {member.character} ({localized(member.role)})
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.body}>
          <View style={styles.episodesHeader}>
            <Text style={styles.heading}>{t("series.episodes")}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{series.totalEpisodes}</Text>
            </View>
          </View>

          {!seasonUnlocked && (
            <SeasonBanner
              priceLabel={formatEuro(SEASON_PRICE_EUR, i18n.language)}
              purchasing={purchasing}
              onPress={() => dispatch(purchaseSeason(series.id))}
            />
          )}

          <View style={styles.episodes}>
            {series.episodes.map((episode, index) => (
              <EpisodeRow
                key={index}
                seriesId={series.id}
                index={index}
                episode={episode}
                onPress={() => play(index)}
              />
            ))}
          </View>
        </View>

        <Rail
          title={t("series.youMightAlsoLike")}
          series={alsoLikeSeriesIds.map(getSeries)}
          onPressSeries={openSeries}
          showSeeAll={false}
        />
      </ScrollView>

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={({ pressed }) => [styles.topButton, pressed && pressedStyle]}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel={t("series.back")}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.topButton, pressed && pressedStyle]}
          onPress={share}
          accessibilityRole="button"
          accessibilityLabel={t("series.share")}
        >
          <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: HERO_HEIGHT },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  topButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  body: { paddingHorizontal: 20, gap: 14 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    minHeight: 26, // grows with large system fonts instead of clipping
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.textMuted },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 38, color: colors.textPrimary },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 20 },
  meta: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  metaStrong: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textPrimary },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
  playButton: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  playText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.onPrimary },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heading: { fontFamily: fonts.display, fontSize: 20, color: colors.textPrimary },
  synopsis: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.textMuted },
  highlights: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  highlightsTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  highlightsTitle: { fontFamily: fonts.displaySemiBold, fontSize: 15, color: colors.textPrimary },
  highlightRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  highlightText: { flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  castRow: { paddingHorizontal: 20, paddingVertical: 14, gap: 16 },
  cast: { width: 88, alignItems: "center", gap: 4 },
  castPhoto: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surface },
  castName: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textPrimary },
  castRole: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
  },
  episodesHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
  },
  countText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.primary },
  episodes: { gap: 18, paddingVertical: 8, marginBottom: 12 },
});
