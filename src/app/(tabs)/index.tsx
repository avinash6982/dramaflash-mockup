import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { GenreChips } from "@/components/GenreChips";
import { HomeHeader } from "@/components/HomeHeader";
import { HomeHero } from "@/components/HomeHero";
import { Rail } from "@/components/Rail";
import { getSeries, heroSeriesId, homeGenres, homeSections } from "@/data/series";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

// Scroll distance after which the header gets a solid background (the hero is 500 high)
const HEADER_SOLID_OFFSET = 360;

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [genre, setGenre] = useState<string | null>(null); // null means "All"
  const [headerSolid, setHeaderSolid] = useState(false);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setHeaderSolid(event.nativeEvent.contentOffset.y > HEADER_SOLID_OFFSET);
  };

  const openSeries = (id: string) => router.push({ pathname: "/series/[id]", params: { id } });

  // Rails keep only the series in the chosen genre; empty rails and sections disappear
  const sections = homeSections
    .map((section) => ({
      ...section,
      rails: section.rails
        .map((rail) => ({
          ...rail,
          series: rail.seriesIds.map(getSeries).filter((s) => !genre || s.genres.includes(genre)),
        }))
        .filter((rail) => rail.series.length > 0),
    }))
    .filter((section) => section.rails.length > 0);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <HomeHero series={getSeries(heroSeriesId)} onWatch={() => openSeries(heroSeriesId)} />
        <GenreChips genres={homeGenres} selected={genre} onSelect={setGenre} />

        {sections.length === 0 && <Text style={styles.empty}>{t("home.noResults")}</Text>}

        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`home.${section.key}`)}</Text>
            {section.rails.map((rail) => (
              <Rail
                key={rail.key}
                title={t(`home.${rail.key}`)}
                series={rail.series}
                onPressSeries={openSeries}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <HomeHeader solid={headerSolid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32, gap: 24 },
  section: { gap: 24 },
  sectionTitle: {
    paddingHorizontal: 20,
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
  },
  empty: {
    paddingHorizontal: 20,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
});
