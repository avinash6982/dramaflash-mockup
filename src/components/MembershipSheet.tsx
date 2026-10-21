import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { MEMBERSHIP } from "@/data/coinPacks";
import { formatEuro } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { purchasePremium } from "@/store/unlocksSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { AppBottomSheet } from "./AppBottomSheet";
import { MembershipCard } from "./MembershipCard";

// "Subscribe" from the Profile: shows the membership with its price and the terms before the
// (mocked) purchase, like the coin purchase does. Opened by the request counter in the store.
export function MembershipSheet() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const sheetRef = useRef<BottomSheetModal>(null);
  const openRequest = useAppSelector((state) => state.unlocks.membershipSheetRequest);
  const busy = useAppSelector((state) => state.unlocks.premiumBusy);

  const subscribe = async () => {
    await dispatch(purchasePremium()).unwrap();
    sheetRef.current?.dismiss();
  };

  // Short sheet: the button sits in the content, not in a fixed footer (that is for tall sheets)
  const actions = (
    <View>
      <View style={styles.secure}>
        <Ionicons name="shield-checkmark-outline" size={15} color={colors.textMuted} />
        <Text style={styles.secureText}>{t("recharge.secureCheckout")}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && pressedStyle]}
        onPress={subscribe}
        disabled={busy}
        accessibilityRole="button"
      >
        {busy ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <>
            <Text style={styles.buttonText}>{t("profile.subscribe")}</Text>
            <Text style={styles.buttonNote}>
              {t("recharge.buyFor", {
                price: `${formatEuro(MEMBERSHIP.priceEur, i18n.language)} ${t("lockSheet.perMonthShort")}`,
              })}
            </Text>
          </>
        )}
      </Pressable>
      <Text style={styles.terms}>{t("recharge.terms")}</Text>
    </View>
  );

  return (
    <AppBottomSheet sheetRef={sheetRef} openRequest={openRequest}>
      <View style={styles.content}>
        <MembershipCard />
      </View>
      {actions}
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16, gap: 16 },
  secure: { flexDirection: "row", alignSelf: "center", alignItems: "center", gap: 6, marginTop: 4 },
  secureText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  button: {
    height: 58,
    marginHorizontal: 20,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: colors.primary,
  },
  buttonText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onPrimary },
  buttonNote: { fontFamily: fonts.body, fontSize: 12, color: colors.onPrimary },
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
