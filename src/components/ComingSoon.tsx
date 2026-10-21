import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

// Placeholder for tabs that are not part of the mock-up
export function ComingSoon({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{t("common.comingSoon")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
  text: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
});
