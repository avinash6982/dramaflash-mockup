import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string; // what is being bought
  note: string; // one line under the title
  priceLabel: string; // "85 Coins", "\u20ac9.99", "\u20ac9.99 / month"
  rows?: { label: string; value: string }[]; // for example the coin balance before and after
  secureCheckout?: boolean; // real-money purchases show "Secure checkout"
  terms?: string; // for a subscription: the auto-renew terms
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel: string;
};

// The last step before anything is spent: what you get, what it costs, and a clear Confirm and Cancel.
// Used inside the unlock sheet and in the season purchase sheet, so every purchase asks the same way.
export function ConfirmPurchase({
  icon,
  title,
  note,
  priceLabel,
  rows = [],
  secureCheckout = false,
  terms,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
  cancelLabel,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t("confirm.heading")}</Text>

      <View style={styles.card}>
        <View style={styles.icon}>
          <Ionicons name={icon} size={24} color={colors.textPrimary} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.note} numberOfLines={2}>
            {note}
          </Text>
        </View>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t("confirm.price")}</Text>
          <Text style={styles.price}>{priceLabel}</Text>
        </View>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      {secureCheckout && (
        <View style={styles.secure}>
          <Ionicons name="shield-checkmark-outline" size={15} color={colors.textMuted} />
          <Text style={styles.secureText}>{t("recharge.secureCheckout")}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.confirm, pressed && pressedStyle]}
        onPress={onConfirm}
        disabled={busy}
        accessibilityRole="button"
      >
        {busy ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        )}
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.cancel, pressed && pressedStyle]}
        onPress={onCancel}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.cancelText}>{cancelLabel}</Text>
      </Pressable>

      {terms && <Text style={styles.terms}>{terms}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 4, gap: 14 },
  heading: { fontFamily: fonts.display, fontSize: 22, color: colors.textPrimary },
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
  rows: { gap: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  rowValue: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textPrimary },
  price: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.primary },
  secure: { flexDirection: "row", alignSelf: "center", alignItems: "center", gap: 6 },
  secureText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  confirm: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: colors.primary,
  },
  confirmText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onPrimary },
  cancel: { alignItems: "center", paddingVertical: 4 },
  cancelText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.textMuted },
  terms: {
    marginHorizontal: 8,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: colors.textMuted,
  },
});
