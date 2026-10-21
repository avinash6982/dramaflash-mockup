import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

type Props = {
  title: string;
  note: string;
  price: string;
  selected: boolean;
  badge?: string; // for example "Best Value"
  onPress: () => void;
};

// One row of the lock sheet: radio, what you get, what it costs
export function UnlockOption({ title, note, price, selected, badge, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, selected && styles.rowSelected, pressed && pressedStyle]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={selected ? colors.primary : colors.textMuted}
      />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
      <Text style={[styles.price, selected && styles.priceSelected]}>{price}</Text>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  rowSelected: { borderColor: colors.primary, backgroundColor: "rgba(100,237,247,0.08)" },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.textPrimary },
  note: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  price: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textPrimary },
  priceSelected: { color: colors.primary },
  badge: {
    position: "absolute",
    top: -11,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.onPrimary,
  },
});
