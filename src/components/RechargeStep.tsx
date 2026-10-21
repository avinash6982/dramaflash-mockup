import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { coinPacks, MEMBERSHIP } from "@/data/coinPacks";
import { findSeries } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { useRechargeSelection } from "@/hooks/useRechargeSelection";
import { formatEuro, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { purchasePremium } from "@/store/unlocksSlice";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { CoinPackCard } from "./CoinPackCard";

const COLUMNS = 2;
const SIDE_PADDING = 20;
const GAP = 12;

type Props = {
  chosenPackId: string | null; // null: the recommended pack
  onChoosePack: (packId: string) => void;
  onBack: () => void; // back to the choice step
  onUnlocked: () => void; // the membership was bought, so everything is unlocked
};

// Step 2 of the unlock sheet, shown when "Unlock Now" finds too few coins: pick a pack (the Popular
// one is preselected when it is enough) or take the membership instead. The Buy button for the pack
// is the sheet's footer (RechargeFooter), so it stays in view while this scrolls.
export function RechargeStep({ chosenPackId, onChoosePack, onBack, onUnlocked }: Props) {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const dispatch = useAppDispatch();
  const { seriesId, episodeIndex, unlockChoice } = useAppSelector((state) => state.player);
  const purchasingPremium = useAppSelector((state) => state.unlocks.purchasingPremium);
  const [width, setWidth] = useState(0);

  const series = findSeries(seriesId ?? undefined);
  const { cost, coins, missing, pack } = useRechargeSelection(chosenPackId);
  const cardWidth = Math.floor((width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  // Mocked EUR 9.99 purchase that unlocks every episode; no coins involved
  const getPremium = async () => {
    await dispatch(purchasePremium()).unwrap();
    onUnlocked();
  };

  const title =
    unlockChoice === "season" ? t("lockSheet.unlockSeason") : t("lockSheet.unlockEpisode");

  if (!series) return null;

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={styles.content}>
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

      <View style={styles.episodeCard}>
        <Image
          source={series.poster}
          style={styles.thumb}
          contentFit="cover"
          transition={IMAGE_FADE_MS}
        />
        <View style={styles.episodeText}>
          <Text style={styles.seriesTitle} numberOfLines={1}>
            {localized(series.title)}
          </Text>
          <Text style={styles.episodeStatus}>
            {t("recharge.episodeLocked", { number: episodeIndex + 1 })}
          </Text>
          <View style={styles.costChip}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.primary} />
            <Text style={styles.costText}>
              {t("recharge.unlockFor", { amount: formatNumber(cost, i18n.language) })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.balance}>
        <Text style={styles.balanceLabel}>{t("recharge.yourBalance")}</Text>
        <View style={styles.balanceValue}>
          <Ionicons name="flash-outline" size={18} color={colors.primary} />
          <Text style={styles.balanceText}>
            {t("lockSheet.coins", { amount: formatNumber(coins, i18n.language) })}
          </Text>
        </View>
      </View>
      {missing > 0 && (
        <Text style={styles.missing}>
          {t("recharge.missing", { amount: formatNumber(missing, i18n.language) })}
        </Text>
      )}

      <Text style={styles.sectionTitle}>{t("recharge.rechargeCoins")}</Text>
      {width > 0 && (
        <View style={styles.grid}>
          {coinPacks.map((item) => (
            <CoinPackCard
              key={item.id}
              pack={item}
              width={cardWidth}
              selected={item.id === pack.id}
              onPress={() => onChoosePack(item.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.or}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>{t("recharge.or")}</Text>
        <View style={styles.orLine} />
      </View>

      <Pressable
        style={({ pressed }) => [styles.premium, pressed && pressedStyle]}
        onPress={getPremium}
        disabled={purchasingPremium}
        accessibilityRole="button"
      >
        <View style={styles.premiumIcon}>
          <MaterialCommunityIcons name="crown-outline" size={22} color={colors.textPrimary} />
        </View>
        <View style={styles.premiumText}>
          <Text style={styles.premiumTitle}>{t("lockSheet.premium")}</Text>
          <Text style={styles.premiumNote}>{t("lockSheet.premiumNote")}</Text>
        </View>
        {purchasingPremium ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Text style={styles.premiumPrice}>
            {t("lockSheet.perMonth", { price: formatEuro(MEMBERSHIP.priceEur, i18n.language) })}
          </Text>
        )}
      </Pressable>
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
  episodeCard: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: SIDE_PADDING,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  thumb: { width: 56, height: 78, borderRadius: 8, backgroundColor: colors.surface },
  episodeText: { flex: 1, justifyContent: "center", gap: 4 },
  seriesTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.textPrimary },
  episodeStatus: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  costChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(100,237,247,0.12)",
  },
  costText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.primary },
  balance: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIDE_PADDING,
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  balanceLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  balanceValue: { flexDirection: "row", alignItems: "center", gap: 6 },
  balanceText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textPrimary },
  missing: {
    marginHorizontal: SIDE_PADDING,
    marginTop: 8,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.accent,
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: SIDE_PADDING,
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP, paddingHorizontal: SIDE_PADDING },
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
  premium: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: SIDE_PADDING,
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: "rgba(203,100,247,0.1)",
  },
  premiumIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.background,
  },
  premiumText: { flex: 1, gap: 2 },
  premiumTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.textPrimary },
  premiumNote: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  premiumPrice: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
});
