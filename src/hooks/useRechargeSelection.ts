import { coinPacks, recommendedPack, unlockCost } from "@/data/coinPacks";
import { useAppSelector } from "@/store/hooks";

// What the recharge step and its Buy button both need: what is missing, and which pack is selected.
// The selection itself (chosenPackId) lives in the sheet that owns both; null means "the recommended one".
export function useRechargeSelection(chosenPackId: string | null) {
  const unlockChoice = useAppSelector((state) => state.player.unlockChoice);
  const coins = useAppSelector((state) => state.wallet.coins);

  const cost = unlockCost(unlockChoice) ?? 0;
  const missing = Math.max(cost - coins, 0);
  const pack = coinPacks.find((p) => p.id === chosenPackId) ?? recommendedPack(missing);

  return { cost, coins, missing, pack };
}
