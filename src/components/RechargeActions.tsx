import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useRechargeSelection } from "@/hooks/useRechargeSelection";
import { formatEuro, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { buyPackAndUnlock } from "@/store/unlockFlow";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = {
  chosenPackId: string | null; // null: the recommended pack
  onUnlocked: () => void; // the pack was bought and the choice unlocked
};

// The end of the recharge step: "Secure checkout", the Buy button and the terms. Part of the
// content like in every sheet, so it moves with the sheet. Buying credits the pack and unlocks what
// was chosen in the same step.
export function RechargeActions({ chosenPackId, onUnlocked }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { pack } = useRechargeSelection(chosenPackId);
  const purchasing = useAppSelector((state) => state.wallet.purchaseStatus === "purchasing");

  const buy = async () => {
    const result = await dispatch(buyPackAndUnlock(pack.id)).unwrap();
    if (result === "unlocked") onUnlocked(); // the sheet closes and the episode starts playing
    // otherwise the pack was too small for the choice: the missing amount updates, buy again
  };

  return (
    <View>
      <View style={styles.secure}>
        <Ionicons name="shield-checkmark-outline" size={15} color={colors.textMuted} />
        <Text style={styles.secureText}>{t("recharge.secureCheckout")}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.buy, pressed && pressedStyle]}
        onPress={buy}
        disabled={purchasing}
        accessibilityRole="button"
      >
        {purchasing ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <>
            <Text style={styles.buyText}>
              {t("recharge.buy", { amount: formatNumber(pack.coins + pack.bonus, i18n.language) })}
            </Text>
            <Text style={styles.buyPrice}>
              {t("recharge.buyFor", { price: formatEuro(pack.priceEur, i18n.language) })}
            </Text>
          </>
        )}
      </Pressable>
      <Text style={styles.terms}>{t("recharge.terms")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  secure: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  secureText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  buy: {
    height: 58,
    marginHorizontal: 20,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: colors.primary,
  },
  buyText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onPrimary },
  buyPrice: { fontFamily: fonts.body, fontSize: 12, color: colors.onPrimary },
  terms: {
    marginHorizontal: 28,
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: colors.textMuted,
  },
});
