import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { coinPacks } from "@/data/coinPacks";
import { formatEuro, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { purchaseCoins } from "@/store/walletSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { AppBottomSheet } from "./AppBottomSheet";
import { CoinPackGrid } from "./CoinPackGrid";

const DEFAULT_PACK_ID = coinPacks.find((pack) => pack.badge === "popular")?.id ?? coinPacks[0].id;

// "Buy coins" from the balance chip or the Profile: pick a pack and buy it. No episode is involved,
// so nothing is unlocked afterwards (the unlock sheet has its own recharge step for that).
export function BuyCoinsSheet() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [chosenId, setChosenId] = useState(DEFAULT_PACK_ID);
  const openRequest = useAppSelector((state) => state.wallet.buyCoinsRequest);
  const coins = useAppSelector((state) => state.wallet.coins);
  const purchasing = useAppSelector((state) => state.wallet.purchaseStatus === "purchasing");

  const pack = coinPacks.find((p) => p.id === chosenId) ?? coinPacks[0];

  const buy = async () => {
    await dispatch(purchaseCoins(pack.id)).unwrap();
    sheetRef.current?.dismiss();
  };

  const footer = (
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

  return (
    <AppBottomSheet
      sheetRef={sheetRef}
      openRequest={openRequest}
      onDismiss={() => setChosenId(DEFAULT_PACK_ID)}
      scrollable
      footer={footer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t("recharge.rechargeCoins")}</Text>
        <View style={styles.balance}>
          <Ionicons name="flash-outline" size={18} color={colors.primary} />
          <Text style={styles.balanceText}>
            {t("lockSheet.coins", { amount: formatNumber(coins, i18n.language) })}
          </Text>
        </View>
      </View>
      <CoinPackGrid selectedId={pack.id} onSelect={setChosenId} />
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.textPrimary },
  balance: { flexDirection: "row", alignItems: "center", gap: 6 },
  balanceText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textPrimary },
  secure: { flexDirection: "row", alignSelf: "center", alignItems: "center", gap: 6, marginTop: 4 },
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
