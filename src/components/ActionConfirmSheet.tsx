import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { AppBottomSheet } from "./AppBottomSheet";

type Props = {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  openRequest: number;
  onDismiss?: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
};

// A "Are you sure?" bottom sheet for actions that cannot be undone with a tap (cancelling the
// membership, resetting the demo data). Same look and behaviour as the purchase confirmations.
export function ActionConfirmSheet({
  sheetRef,
  openRequest,
  onDismiss,
  title,
  message,
  confirmLabel,
  busy = false,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  return (
    <AppBottomSheet sheetRef={sheetRef} openRequest={openRequest} onDismiss={onDismiss}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <Pressable
          style={({ pressed }) => [styles.confirm, pressed && pressedStyle]}
          onPress={onConfirm}
          disabled={busy}
          accessibilityRole="button"
        >
          {busy ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.cancel, pressed && pressedStyle]}
          onPress={() => sheetRef.current?.dismiss()}
          disabled={busy}
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>{t("confirm.cancel")}</Text>
        </Pressable>
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 4, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.textPrimary },
  message: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.textMuted },
  confirm: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: colors.accent,
  },
  confirmText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textPrimary },
  cancel: { alignItems: "center", paddingVertical: 4 },
  cancelText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.textMuted },
});
