import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = { priceLabel: string; purchasing: boolean; onPress: () => void };

// "Unlock Full Season" card above the episode list
export function SeasonBanner({ priceLabel, purchasing, onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && pressedStyle]}
      onPress={onPress}
      disabled={purchasing}
      accessibilityRole="button"
      accessibilityLabel={`${t("series.unlockFullSeason")} ${priceLabel}`}
    >
      <View style={styles.text}>
        <Text style={styles.title}>{t("series.unlockFullSeason")}</Text>
        <Text style={styles.subtitle}>{t("series.saveWithBundle")}</Text>
      </View>
      <View style={styles.price}>
        {purchasing ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Text style={styles.priceText}>{priceLabel}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  text: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.display, fontSize: 17, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  price: {
    minWidth: 72,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.accent,
  },
  priceText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
});
