import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CoinPack } from "@/data/coinPacks";
import { formatEuro, formatNumber } from "@/i18n/format";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = { pack: CoinPack; selected: boolean; width: number; onPress: () => void };

// One coin pack on the recharge sheet: coins, bonus, price, and a Popular or Best Value tag
export function CoinPackCard({ pack, selected, width, onPress }: Props) {
  const { t, i18n } = useTranslation();
  const badge =
    pack.badge === "popular"
      ? t("recharge.popular")
      : pack.badge === "bestValue"
        ? t("recharge.bestValue")
        : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width },
        selected && styles.cardSelected,
        pressed && pressedStyle,
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${formatNumber(pack.coins, i18n.language)} Coins`}
    >
      {badge && (
        <View style={[styles.badge, pack.badge === "bestValue" && styles.badgeBest]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="flash-outline" size={26} color={colors.primary} />
      <Text style={styles.coins}>{formatNumber(pack.coins, i18n.language)}</Text>
      <Text style={styles.bonus}>
        {pack.bonus > 0
          ? t("recharge.bonus", { amount: formatNumber(pack.bonus, i18n.language) })
          : " "}
      </Text>
      <View style={[styles.price, selected && styles.priceSelected]}>
        <Text style={[styles.priceText, selected && styles.priceTextSelected]}>
          {formatEuro(pack.priceEur, i18n.language)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: 4,
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: "rgba(100,237,247,0.08)" },
  badge: {
    position: "absolute",
    top: -1,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: colors.primary,
  },
  badgeBest: { backgroundColor: colors.accent },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.onPrimary,
  },
  coins: { fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
  bonus: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.accent },
  price: {
    alignSelf: "stretch",
    height: 34,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  priceSelected: { backgroundColor: colors.primary },
  priceText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textPrimary },
  priceTextSelected: { color: colors.onPrimary },
});
