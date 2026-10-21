import { Ionicons } from "@expo/vector-icons";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionConfirmSheet } from "@/components/ActionConfirmSheet";
import { MembershipCard } from "@/components/MembershipCard";
import { formatDate, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLanguage } from "@/i18n";
import type { Language } from "@/i18n/localized";
import { hasDemoChanges, resetDemo } from "@/store";
import { cancelPremium, membershipStatus, openMembershipSheet } from "@/store/unlocksSlice";
import { openBuyCoinsSheet } from "@/store/walletSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

// The language (EN / DE), the coin balance with Recharge, and the membership (subscribe, cancel, resubscribe).
// Everything is mocked and kept for the session only. The reset button at the bottom is for testing.
// Language names are shown in their own language, the way people look for them
const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
];

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  // One confirmation sheet serves both actions; each tap asks it to open again (request counter)
  const confirmSheetRef = useRef<BottomSheetModal>(null);
  const [pendingAction, setPendingAction] = useState<"cancel" | "reset">("reset");
  const [confirmRequest, setConfirmRequest] = useState(0);
  const askToConfirm = (action: "cancel" | "reset") => {
    setPendingAction(action);
    setConfirmRequest((count) => count + 1);
  };

  const coins = useAppSelector((state) => state.wallet.coins);
  const status = useAppSelector(membershipStatus);
  const renewsOn = useAppSelector((state) => state.unlocks.premiumRenewsOn);
  const busy = useAppSelector((state) => state.unlocks.premiumBusy);
  const canReset = useAppSelector(hasDemoChanges);

  const date = renewsOn ? formatDate(renewsOn, i18n.language) : "";

  const confirmAction = async () => {
    if (pendingAction === "cancel") await dispatch(cancelPremium()).unwrap();
    else dispatch(resetDemo());
    confirmSheetRef.current?.dismiss();
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

        {status === "active" ? (
          <Pressable
            style={({ pressed }) => [styles.linkButton, pressed && pressedStyle]}
            onPress={() => askToConfirm("cancel")}
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

      <View style={styles.card}>
        <Text style={styles.label}>{t("profile.language")}</Text>
        <View style={styles.languages}>
          {languages.map((option) => {
            const selected = i18n.language === option.code;
            return (
              <Pressable
                key={option.code}
                style={({ pressed }) => [
                  styles.language,
                  selected && styles.languageSelected,
                  pressed && pressedStyle,
                ]}
                onPress={() => setLanguage(option.code)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <Text style={[styles.languageText, selected && styles.languageTextSelected]}>
                  {option.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {canReset && (
        <View style={styles.reset}>
          <Pressable
            style={({ pressed }) => [styles.resetButton, pressed && pressedStyle]}
            onPress={() => askToConfirm("reset")}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={colors.textMuted} />
            <Text style={styles.resetText}>{t("profile.resetDemo")}</Text>
          </Pressable>
          <Text style={styles.resetNote}>{t("profile.resetNote")}</Text>
        </View>
      )}
      <ActionConfirmSheet
        sheetRef={confirmSheetRef}
        openRequest={confirmRequest}
        title={pendingAction === "cancel" ? t("confirm.cancelTitle") : t("confirm.resetTitle")}
        message={
          pendingAction === "cancel"
            ? t("profile.cancelQuestion", { date })
            : t("confirm.resetQuestion")
        }
        confirmLabel={
          pendingAction === "cancel" ? t("profile.confirmCancel") : t("confirm.resetYes")
        }
        busy={busy}
        onConfirm={confirmAction}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.textPrimary },
  languages: { flexDirection: "row", gap: 10 },
  language: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageSelected: { borderColor: colors.primary, backgroundColor: "rgba(100,237,247,0.1)" },
  languageText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textMuted },
  languageTextSelected: { fontFamily: fonts.bodySemiBold, color: colors.primary },
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
  reset: { alignItems: "stretch", gap: 6, marginTop: 8 },
  resetButton: {
    alignSelf: "center",
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
