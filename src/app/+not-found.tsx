import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

// Shown for any URL that matches no route (e.g. a mistyped link on web)
export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("common.notFoundTitle")}</Text>
      <Link href="/" replace style={styles.link}>
        {t("common.goHome")}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
  link: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.primary },
});
