import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

import type { GenreId } from "@/data/series";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = {
  genres: GenreId[];
  selected: GenreId | null; // null means "All"
  onSelect: (genre: GenreId | null) => void;
};

export function GenreChips({ genres, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const chips = [
    { value: null, label: t("home.all") },
    ...genres.map((genre) => ({ value: genre, label: t(`genres.${genre}`) })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {chips.map((chip) => {
        const isSelected = chip.value === selected;
        return (
          <Pressable
            key={chip.label}
            onPress={() => onSelect(chip.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [styles.chip, isSelected && styles.chipSelected, pressed && pressedStyle]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{chip.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 20, gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textMuted },
  labelSelected: { color: colors.onPrimary },
});
