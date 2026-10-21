import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { SEASON_PRICE_EUR } from "@/data/coinPacks";
import { findSeries } from "@/data/series";
import { useLocalized } from "@/hooks/useLocalized";
import { formatEuro } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { purchaseSeason } from "@/store/unlocksSlice";

import { AppBottomSheet } from "./AppBottomSheet";
import { ConfirmPurchase } from "./ConfirmPurchase";

// "Unlock Full Season" on the series page costs real money (mocked), so it asks first: what you get,
// the price, Secure checkout, then Confirm. Opened by the request counter in the store.
export function SeasonPurchaseSheet() {
  const { t, i18n } = useTranslation();
  const localized = useLocalized();
  const dispatch = useAppDispatch();
  const sheetRef = useRef<BottomSheetModal>(null);
  const { request, seriesId } = useAppSelector((state) => state.unlocks.seasonSheet);
  const busy = useAppSelector((state) => state.unlocks.purchasingSeasonId !== null);
  const series = findSeries(seriesId ?? undefined);

  const confirm = async () => {
    if (!series) return;
    await dispatch(purchaseSeason(series.id)).unwrap();
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet sheetRef={sheetRef} openRequest={request}>
      {series && (
        <ConfirmPurchase
          icon="lock-open-outline"
          title={t("lockSheet.unlockSeason")}
          note={`${localized(series.title)} \u2022 ${t("home.epsShort", { count: series.totalEpisodes })}`}
          priceLabel={formatEuro(SEASON_PRICE_EUR, i18n.language)}
          secureCheckout
          confirmLabel={t("confirm.pay")}
          busy={busy}
          onConfirm={confirm}
          onCancel={() => sheetRef.current?.dismiss()}
          cancelLabel={t("confirm.cancel")}
        />
      )}
    </AppBottomSheet>
  );
}
