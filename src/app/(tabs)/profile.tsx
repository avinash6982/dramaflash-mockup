import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MembershipCard } from "@/components/MembershipCard";
import { formatDate, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hasDemoChanges, resetDemo } from "@/store";
import { cancelPremium, membershipStatus, openMembershipSheet } from "@/store/unlocksSlice";
import { openBuyCoinsSheet } from "@/store/walletSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

// Coin balance with Recharge, and the membership (subscribe, cancel, resubscribe).
// Everything is mocked and kept for the session only. The reset button at the bottom is for testing.
export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const coins = useAppSelector((state) => state.wallet.coins);
  const status = useAppSelector(membershipStatus);
  const renewsOn = useAppSelector((state) => state.unlocks.premiumRenewsOn);
  const busy = useAppSelector((state) => state.unlocks.premiumBusy);
  const canReset = useAppSelector(hasDemoChanges);

  const date = renewsOn ? formatDate(renewsOn, i18n.language) : "";

  const cancel = async () => {
    await dispatch(cancelPremium()).unwrap();
    setConfirmingCancel(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <Text style={styles.title}>{t("tabs.profile")}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{t("profile.coinBalance")}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balance}>
            <Ionicons name="flash" size={26} color={colors.lockCoin} />
            <Text style={styles.balanceText}>{formatNumber(coins, i18n.language)}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && pressedStyle]}
            onPress={() => dispatch(openBuyCoinsSheet())}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>{t("profile.recharge")}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.membership}>
        <Text style={styles.label}>{t("profile.membership")}</Text>
        <MembershipCard
          hidePrice={status !== "none"}
          note={
            status === "active"
              ? t("profile.renewsOn", { date })
              : status === "cancelled"
                ? t("profile.accessUntil", { date })
                : undefined
          }
        />

        {confirmingCancel ? (
          <View style={styles.confirm}>
            <Text style={styles.confirmText}>{t("profile.cancelQuestion", { date })}</Text>
            <View style={styles.confirmButtons}>
              <Pressable
                style={({ pressed }) => [styles.secondaryButton, pressed && pressedStyle]}
                onPress={() => setConfirmingCancel(false)}
                disabled={busy}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>{t("profile.keep")}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.dangerButton, pressed && pressedStyle]}
                onPress={cancel}
                disabled={busy}
                accessibilityRole="button"
              >
                {busy ? (
                  <ActivityIndicator color={colors.textPrimary} />
                ) : (
                  <Text style={styles.dangerButtonText}>{t("profile.confirmCancel")}</Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : status === "active" ? (
          <Pressable
            style={({ pressed }) => [styles.linkButton, pressed && pressedStyle]}
            onPress={() => setConfirmingCancel(true)}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>{t("profile.cancelMembership")}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              styles.fullWidth,
              pressed && pressedStyle,
            ]}
            onPress={() => dispatch(openMembershipSheet())}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              {status === "cancelled" ? t("profile.resubscribe") : t("profile.subscribe")}
            </Text>
          </Pressable>
        )}
      </View>

      {canReset && (
        <View style={styles.reset}>
          <Pressable
            style={({ pressed }) => [styles.resetButton, pressed && pressedStyle]}
            onPress={() => dispatch(resetDemo())}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={colors.textMuted} />
            <Text style={styles.resetText}>{t("profile.resetDemo")}</Text>
          </Pressable>
          <Text style={styles.resetNote}>{t("profile.resetNote")}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.textPrimary },
  membership: { gap: 12 },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  balanceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  balance: { flexDirection: "row", alignItems: "center", gap: 8 },
  balanceText: { fontFamily: fonts.display, fontSize: 32, color: colors.textPrimary },
  primaryButton: {
    height: 44,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  fullWidth: { alignSelf: "stretch" },
  primaryButtonText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.onPrimary },
  linkButton: { alignSelf: "flex-start", paddingVertical: 4 },
  linkText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.accent },
  confirm: { gap: 12 },
  confirmText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  confirmButtons: { flexDirection: "row", gap: 10 },
  secondaryButton: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textPrimary },
  dangerButton: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.accent,
  },
  dangerButtonText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textPrimary },
  reset: { alignItems: "center", gap: 6, marginTop: 8 },
  resetButton: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  resetNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: colors.textMuted,
  },
});
