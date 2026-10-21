import { useTranslation } from "react-i18next";

import { EPISODE_UNLOCK_COST, MEMBERSHIP, SEASON_UNLOCK_COST } from "@/data/coinPacks";
import { findSeries } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { formatEuro, formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockSelected } from "@/store/unlockFlow";

import { ConfirmPurchase } from "./ConfirmPurchase";

type Props = {
  onBack: () => void; // to the step the user came from
  onUnlocked: () => void; // done: the sheet closes and the episode plays
  onNeedCoins: () => void; // the coins turned out to be too few: go to the recharge step
};

// Step "confirm" of the unlock sheet: spending coins or starting the membership asks once more,
// showing the price and, for coins, the balance before and after.
export function UnlockConfirmStep({ onBack, onUnlocked, onNeedCoins }: Props) {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const dispatch = useAppDispatch();
  const { seriesId, episodeIndex, unlockChoice } = useAppSelector((state) => state.player);
  const coins = useAppSelector((state) => state.wallet.coins);
  const busy = useAppSelector((state) => state.unlocks.premiumBusy);
  const series = findSeries(seriesId ?? undefined);
  if (!series) return null;

  const confirm = async () => {
    const result = await dispatch(unlockSelected()).unwrap();
    if (result === "unlocked") onUnlocked();
    else onNeedCoins();
  };

  const coinPrice = unlockChoice === "season" ? SEASON_UNLOCK_COST : EPISODE_UNLOCK_COST;
  const language = i18n.language;
  const coinsLabel = (amount: number) =>
    t("lockSheet.coins", { amount: formatNumber(amount, language) });

  if (unlockChoice === "premium") {
    return (
      <ConfirmPurchase
        icon="ribbon-outline"
        title={t("lockSheet.premium")}
        note={t("lockSheet.premiumNote")}
        priceLabel={`${formatEuro(MEMBERSHIP.priceEur, language)} ${t("lockSheet.perMonthShort")}`}
        secureCheckout
        terms={t("recharge.terms")}
        confirmLabel={t("confirm.subscribe")}
        busy={busy}
        onConfirm={confirm}
        onCancel={onBack}
        cancelLabel={t("confirm.back")}
      />
    );
  }

  return (
    <ConfirmPurchase
      icon="lock-open-outline"
      title={
        unlockChoice === "season"
          ? t("lockSheet.unlockSeason")
          : t("confirm.episode", { number: episodeIndex + 1 })
      }
      note={
        unlockChoice === "season"
          ? `${localized(series.title)} \u2022 ${t("lockSheet.seasonRange", {
              from: episodeIndex + 1,
              to: series.totalEpisodes,
            })}`
          : localized(series.title)
      }
      priceLabel={coinsLabel(coinPrice)}
      rows={[
        { label: t("confirm.balance"), value: coinsLabel(coins) },
        { label: t("confirm.balanceAfter"), value: coinsLabel(coins - coinPrice) },
      ]}
      confirmLabel={t("confirm.unlock")}
      onConfirm={confirm}
      onCancel={onBack}
      cancelLabel={t("confirm.back")}
    />
  );
}
