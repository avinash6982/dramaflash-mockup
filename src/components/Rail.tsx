import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { Series } from "@/data/series";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { PosterCard } from "./PosterCard";

type Props = {
  title: string;
  series: Series[];
  onPressSeries: (id: string) => void;
  showSeeAll?: boolean;
};

// A titled row of posters that scrolls sideways
export function Rail({ title, series, onPressSeries, showSeeAll = true }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showSeeAll && (
          <Pressable
            style={({ pressed }) => pressed && pressedStyle}
            accessibilityRole="button"
          >
            <Text style={styles.seeAll}>{t("home.seeAll")}</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal
        data={series}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PosterCard series={item} onPress={() => onPressSeries(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: { fontFamily: fonts.display, fontSize: 19, color: colors.textPrimary },
  seeAll: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.primary },
  list: { paddingHorizontal: 20 },
  separator: { width: 14 },
});
