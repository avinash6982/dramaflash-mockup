import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { findSeries } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { useRechargeSelection } from "@/hooks/useRechargeSelection";
import { formatNumber } from "@/i18n/format";
import { useAppSelector } from "@/store/hooks";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { CoinPackGrid } from "./CoinPackGrid";
import { MembershipCard } from "./MembershipCard";
import { RechargeActions } from "./RechargeActions";

const SIDE_PADDING = 20;

type Props = {
  chosenPackId: string | null; // null: the recommended pack
  onChoosePack: (packId: string) => void;
  onBack: () => void; // back to the choice step
  onChooseMembership: () => void; // the membership card was tapped: the sheet asks to confirm it
  onUnlocked: () => void; // a pack was bought and the choice unlocked: the sheet closes
};

// Step 2 of the unlock sheet, shown when "Unlock Now" finds too few coins: pick a pack (the Popular
// one is preselected when it is enough) or take the membership instead, then Buy at the end.
export function RechargeStep({
  chosenPackId,
  onChoosePack,
  onChooseMembership,
  onBack,
  onUnlocked,
}: Props) {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const { seriesId, episodeIndex, unlockChoice } = useAppSelector((state) => state.player);

  const series = findSeries(seriesId ?? undefined);
  const { cost, coins, missing, pack } = useRechargeSelection(chosenPackId);

  const title =
    unlockChoice === "season" ? t("lockSheet.unlockSeason") : t("lockSheet.unlockEpisode");

  if (!series) return null;

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t("recharge.close")}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.summary}>
        <Image
          source={series.poster}
          style={styles.thumb}
          contentFit="cover"
          transition={IMAGE_FADE_MS}
        />
        <View style={styles.summaryText}>
          <Text style={styles.seriesTitle} numberOfLines={1}>
            {localized(series.title)} {"\u2022"}{" "}
            {t("recharge.episodeShort", { number: episodeIndex + 1 })}
          </Text>
          <Text style={styles.costText}>
            {t("recharge.unlockFor", { amount: formatNumber(cost, i18n.language) })}
          </Text>
          <Text style={styles.balanceLine}>
            {t("recharge.yourBalance")}:{" "}
            {t("lockSheet.coins", { amount: formatNumber(coins, i18n.language) })}
            {missing > 0 &&
              ` \u2022 ${t("recharge.missing", { amount: formatNumber(missing, i18n.language) })}`}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t("recharge.rechargeCoins")}</Text>
      <CoinPackGrid selectedId={pack.id} onSelect={onChoosePack} />

      <View style={styles.or}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>{t("recharge.or")}</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.premiumWrap}>
        <MembershipCard onPress={onChooseMembership} />
      </View>

      <RechargeActions chosenPackId={chosenPackId} onUnlocked={onUnlocked} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 10,
  },
  headerTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.textPrimary },
  summary: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: SIDE_PADDING,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  thumb: { width: 48, height: 68, borderRadius: 8, backgroundColor: colors.surface },
  summaryText: { flex: 1, justifyContent: "center", gap: 3 },
  seriesTitle: { fontFamily: fonts.displaySemiBold, fontSize: 16, color: colors.textPrimary },
  costText: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.primary },
  balanceLine: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: SIDE_PADDING,
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  or: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: SIDE_PADDING,
    marginTop: 18,
  },
  orLine: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  premiumWrap: { marginHorizontal: SIDE_PADDING, marginTop: 14 },
});
