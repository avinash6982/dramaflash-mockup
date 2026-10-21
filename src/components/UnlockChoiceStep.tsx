import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { EPISODE_UNLOCK_COST, MEMBERSHIP, SEASON_UNLOCK_COST } from "@/data/coinPacks";
import type { UnlockChoice } from "@/data/coinPacks";
import { findSeries } from "@/data/series";
import { formatEuro, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUnlockChoice } from "@/store/playerSlice";
import { unlockSelected } from "@/store/unlockFlow";
import { colors } from "@/theme/colors";
import { IMAGE_FADE_MS, pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { UnlockOption } from "./UnlockOption";

type Props = {
  onUnlocked: () => void; // the choice was unlocked
  onNeedCoins: () => void; // too few coins: the sheet moves on to the recharge step
  onMaybeLater: () => void;
};

// Step 1 of the unlock sheet, "Continue the romance": choose what to unlock, then Unlock Now.
export function UnlockChoiceStep({ onUnlocked, onNeedCoins, onMaybeLater }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { seriesId, episodeIndex, unlockChoice } = useAppSelector((state) => state.player);
  const purchasingPremium = useAppSelector((state) => state.unlocks.premiumBusy);

  const series = findSeries(seriesId ?? undefined);

  const unlockNow = async () => {
    const result = await dispatch(unlockSelected()).unwrap();
    if (result === "unlocked") onUnlocked();
    else onNeedCoins(); // too few coins: buy some, which unlocks right after
  };

  const option = (choice: UnlockChoice) => ({
    selected: unlockChoice === choice,
    onPress: () => dispatch(setUnlockChoice(choice)),
  });

  if (!series) return null;

  return (
    <>
      {
        <View style={styles.content}>
          <View style={styles.art}>
            <Image
              source={series.poster}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={IMAGE_FADE_MS}
            />
            <View style={styles.artDim} />
            <View style={styles.lock}>
              <Ionicons name="lock-closed" size={20} color={colors.textPrimary} />
            </View>
            <Text style={styles.lockedText}>{t("lockSheet.locked")}</Text>
          </View>

          <Text style={styles.episode}>{t("lockSheet.episode", { number: episodeIndex + 1 })}</Text>
          <Text style={styles.title}>{t("lockSheet.title")}</Text>
          <Text style={styles.subtitle}>{t("lockSheet.subtitle")}</Text>

          <View style={styles.options}>
            <UnlockOption
              {...option("episode")}
              title={t("lockSheet.unlockEpisode")}
              note={t("lockSheet.oneTimeAccess")}
              price={t("lockSheet.coins", {
                amount: formatNumber(EPISODE_UNLOCK_COST, i18n.language),
              })}
            />
            <UnlockOption
              {...option("season")}
              title={t("lockSheet.unlockSeason")}
              note={t("lockSheet.seasonRange", {
                from: episodeIndex + 1,
                to: series.totalEpisodes,
              })}
              price={t("lockSheet.coins", {
                amount: formatNumber(SEASON_UNLOCK_COST, i18n.language),
              })}
              badge={t("lockSheet.bestValue")}
            />
            <UnlockOption
              {...option("premium")}
              title={t("lockSheet.premium")}
              note={t("lockSheet.premiumNote")}
              price={t("lockSheet.perMonth", {
                price: formatEuro(MEMBERSHIP.priceEur, i18n.language),
              })}
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.unlock, pressed && pressedStyle]}
            onPress={unlockNow}
            disabled={purchasingPremium}
            accessibilityRole="button"
          >
            {purchasingPremium ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <Ionicons name="lock-open-outline" size={18} color={colors.onPrimary} />
                <Text style={styles.unlockText}>{t("lockSheet.unlockNow")}</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.later, pressed && pressedStyle]}
            onPress={onMaybeLater}
            accessibilityRole="button"
          >
            <Text style={styles.laterText}>{t("lockSheet.maybeLater")}</Text>
          </Pressable>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", paddingHorizontal: 20, paddingTop: 8 },
  art: {
    width: 92,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  artDim: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.55)" },
  lock: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  lockedText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
  episode: {
    marginTop: 14,
    fontFamily: fonts.displaySemiBold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.primary,
  },
  title: { marginTop: 6, fontFamily: fonts.display, fontSize: 26, color: colors.textPrimary },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: colors.textMuted,
  },
  options: { alignSelf: "stretch", gap: 14, marginTop: 22 },
  unlock: {
    alignSelf: "stretch",
    height: 52,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 26,
    backgroundColor: colors.primary,
  },
  unlockText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.onPrimary },
  later: { paddingVertical: 14 },
  laterText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.textMuted },
});
