import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { MEMBERSHIP } from "@/data/coinPacks";
import { formatEuro } from "@/i18n/format";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = {
  onPress?: () => void; // when given the whole card is tappable (the unlock sheet's membership option)
  busy?: boolean;
  note?: string; // replaces the "Unlimited access" line, e.g. "Renews on 20 Nov 2026"
  hidePrice?: boolean;
};

// The membership card from the design: black circle with a crown, serif title, short note, and the
// price on the right with its period underneath. Used on the recharge step, on the Profile and in
// the membership sheet, so it looks the same everywhere.
export function MembershipCard({ onPress, busy = false, note, hidePrice = false }: Props) {
  const { t, i18n } = useTranslation();

  const content = (
    <>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="crown-outline" size={24} color={colors.textPrimary} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{t("lockSheet.premium")}</Text>
        <Text style={styles.note}>{note ?? t("lockSheet.premiumNote")}</Text>
      </View>
      {!hidePrice &&
        (busy ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <View style={styles.price}>
            <Text style={styles.priceText}>{formatEuro(MEMBERSHIP.priceEur, i18n.language)}</Text>
            <Text style={styles.period}>{t("lockSheet.perMonthShort")}</Text>
          </View>
        ))}
    </>
  );

  if (!onPress) return <View style={styles.card}>{content}</View>;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && pressedStyle]}
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.background,
  },
  text: { flex: 1, gap: 3 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.textPrimary },
  note: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  price: { alignItems: "flex-end", gap: 2 },
  priceText: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.textPrimary },
  period: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
});
