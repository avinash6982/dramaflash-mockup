export type CoinPack = {
  id: string;
  coins: number;
  bonus: number;
  priceEur: number;
  badge?: "popular" | "bestValue";
};

// Packs from the Recharge Coins design
export const coinPacks: CoinPack[] = [
  { id: "pack-300", coins: 300, bonus: 0, priceEur: 2.99 },
  { id: "pack-800", coins: 800, bonus: 50, priceEur: 6.99, badge: "popular" },
  { id: "pack-2500", coins: 2500, bonus: 200, priceEur: 19.99 },
  { id: "pack-6000", coins: 6000, bonus: 1000, priceEur: 49.99, badge: "bestValue" },
];

// One coin price everywhere (the design shows 85 on one screen and 10 on another)
export const EPISODE_UNLOCK_COST = 85;
export const SEASON_UNLOCK_COST = 1200;
export const STARTING_COINS = 15;

// What the lock sheet can unlock, and the coin price of each (premium costs real money, not coins)
export type UnlockChoice = "episode" | "season" | "premium";

export function unlockCost(choice: UnlockChoice): number | null {
  if (choice === "episode") return EPISODE_UNLOCK_COST;
  if (choice === "season") return SEASON_UNLOCK_COST;
  return null;
}

// The pack to preselect on the recharge sheet: the Popular one if it covers what is missing (as in
// the design), otherwise the smallest pack that does, otherwise the biggest. Bonus coins count.
export function recommendedPack(missingCoins: number): CoinPack {
  const covers = (pack: CoinPack) => pack.coins + pack.bonus >= missingCoins;
  const popular = coinPacks.find((pack) => pack.badge === "popular");
  if (popular && covers(popular)) return popular;
  return coinPacks.find(covers) ?? coinPacks[coinPacks.length - 1];
}

// Real-money prices, defined once (the design shows $9.99 per month on one screen and EUR 4.99 per week on another)
export const SEASON_PRICE_EUR = 9.99;
export const MEMBERSHIP = { name: "Premium Membership", priceEur: 9.99, period: "month" } as const;
