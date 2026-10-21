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
