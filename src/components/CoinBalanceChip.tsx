import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openBuyCoinsSheet } from "@/store/walletSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

// Coin balance; tapping it opens the Buy coins sheet
export function CoinBalanceChip() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const coins = useAppSelector((state) => state.wallet.coins);

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && pressedStyle]}
      onPress={() => dispatch(openBuyCoinsSheet())}
      accessibilityRole="button"
      accessibilityLabel={t("recharge.rechargeCoins")}
    >
      <Ionicons name="flash" size={14} color={colors.lockCoin} />
      <Text style={styles.text}>{formatNumber(coins, i18n.language)}</Text>
      <Ionicons name="add-circle" size={16} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  text: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
});
