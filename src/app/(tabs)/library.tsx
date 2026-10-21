import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { summarizeUnlocks } from "@/data/library";
import { findSeries } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { formatDate, formatNumber } from "@/i18n/format";
import { useAppSelector } from "@/store/hooks";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

// What the user owns and what they spent: the series they unlocked (a season, or single episodes)
// and the coin history. Saved series are on the Favourites tab and the balance is on the Profile,
// so neither is repeated here.
export default function LibraryScreen() {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const premium = useAppSelector((state) => state.unlocks.premium);
  const unlockedSeriesIds = useAppSelector((state) => state.unlocks.unlockedSeriesIds);
  const unlockedEpisodeIds = useAppSelector((state) => state.unlocks.unlockedEpisodeIds);
  const transactions = useAppSelector((state) => state.wallet.transactions);

  // Select the raw lists and work them out here: a selector that builds a new array every time
  // makes the screen render again for nothing
  const unlocked = useMemo(
    () => summarizeUnlocks(unlockedSeriesIds, unlockedEpisodeIds),
    [unlockedSeriesIds, unlockedEpisodeIds],
  );
  const isEmpty = !premium && unlocked.length === 0 && transactions.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t("tabs.library")}</Text>

      {isEmpty && (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={44} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{t("library.emptyTitle")}</Text>
          <Text style={styles.emptyHint}>{t("library.emptyHint")}</Text>
        </View>
      )}

      {premium && (
        <View style={styles.premium}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          <Text style={styles.premiumText}>{t("library.premiumOn")}</Text>
        </View>
      )}

      {unlocked.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("library.unlocked")}</Text>
          {unlocked.map((item) => {
            const series = findSeries(item.seriesId);
            if (!series) return null;
            return (
              <Pressable
                key={item.seriesId}
                style={({ pressed }) => [styles.row, pressed && pressedStyle]}
                onPress={() =>
                  router.push({ pathname: "/series/[id]", params: { id: item.seriesId } })
                }
                accessibilityRole="button"
              >
                <Image
                  source={series.poster}
                  style={styles.thumb}
                  contentFit="cover"
                  transition={IMAGE_FADE_MS}
                />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={2}>
                    {localized(series.title)}
                  </Text>
                  <Text style={styles.rowNote}>
                    {item.fullSeason
                      ? t("library.fullSeason")
                      : t("library.episodesUnlocked", { count: item.episodes })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>
      )}

      {transactions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("library.coinHistory")}</Text>
          {transactions.slice(0, 8).map((transaction) => (
            <View key={transaction.id} style={styles.historyRow}>
              <View style={styles.rowText}>
                <Text style={styles.historyTitle}>
                  {transaction.kind === "purchase"
                    ? t("library.coinsBought")
                    : t("library.unlockedWithCoins")}
                </Text>
                <Text style={styles.rowNote}>
                  {formatDate(transaction.createdAt, i18n.language)}
                </Text>
              </View>
              <Text style={[styles.coins, transaction.coins > 0 && styles.coinsPlus]}>
                {transaction.coins > 0 ? "+" : "−"}
                {formatNumber(Math.abs(transaction.coins), i18n.language)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 32, gap: 20 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.textPrimary },
  empty: { alignItems: "center", gap: 10, padding: 32, paddingTop: 48 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.textPrimary },
  emptyHint: { fontFamily: fonts.body, fontSize: 14, textAlign: "center", color: colors.textMuted },
  premium: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(100,237,247,0.08)",
  },
  premiumText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textPrimary },
  section: { gap: 8 },
  sectionTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.textPrimary },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 8 },
  thumb: { width: 52, height: 74, borderRadius: 8, backgroundColor: colors.surface },
  rowText: { flex: 1, gap: 3 },
  rowTitle: { fontFamily: fonts.displaySemiBold, fontSize: 16, color: colors.textPrimary },
  rowNote: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyTitle: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textPrimary },
  coins: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textPrimary },
  coinsPlus: { color: colors.primary },
});
