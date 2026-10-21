import { EPISODE_UNLOCK_COST, SEASON_UNLOCK_COST, STARTING_COINS } from "@/data/coinPacks";

import { makeStore } from "../index";
import { isEpisodeLocked, purchaseSeason, unlockEpisode, unlockSeason } from "../unlocksSlice";
import { purchaseCoins } from "../walletSlice";

const SERIES = "ceos-secret-life"; // 3 free episodes

// The mocked purchase waits 1 s, so use fake timers and let them run
async function buyPack(store: ReturnType<typeof makeStore>, packId: string) {
  const purchase = store.dispatch(purchaseCoins(packId));
  jest.advanceTimersByTime(1000);
  await purchase;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("isEpisodeLocked", () => {
  it("keeps the first 3 episodes free and locks the rest", () => {
    const state = makeStore().getState();
    expect(isEpisodeLocked(state, SERIES, 2)).toBe(false);
    expect(isEpisodeLocked(state, SERIES, 3)).toBe(true);
  });
});

describe("unlockEpisode", () => {
  it("fails with too few coins and changes nothing", async () => {
    const store = makeStore();
    const result = await store.dispatch(unlockEpisode({ seriesId: SERIES, index: 3 }));

    expect(result.type).toBe(unlockEpisode.rejected.type);
    expect(result.payload).toBe("not-enough-coins");
    expect(store.getState().wallet.coins).toBe(STARTING_COINS);
    expect(isEpisodeLocked(store.getState(), SERIES, 3)).toBe(true);
  });

  it("deducts the cost and unlocks only that episode after a purchase", async () => {
    const store = makeStore();
    await buyPack(store, "pack-800"); // 800 coins + 50 bonus
    expect(store.getState().wallet.coins).toBe(STARTING_COINS + 850);

    await store.dispatch(unlockEpisode({ seriesId: SERIES, index: 3 }));

    const state = store.getState();
    expect(state.wallet.coins).toBe(STARTING_COINS + 850 - EPISODE_UNLOCK_COST);
    expect(isEpisodeLocked(state, SERIES, 3)).toBe(false);
    expect(isEpisodeLocked(state, SERIES, 4)).toBe(true);
  });
});

describe("purchaseCoins", () => {
  it("shows a purchasing status, then credits the pack and logs it", async () => {
    const store = makeStore();
    const purchase = store.dispatch(purchaseCoins("pack-300"));
    expect(store.getState().wallet.purchaseStatus).toBe("purchasing");

    jest.advanceTimersByTime(1000);
    await purchase;

    const { wallet } = store.getState();
    expect(wallet.purchaseStatus).toBe("idle");
    expect(wallet.coins).toBe(STARTING_COINS + 300);
    expect(wallet.transactions).toHaveLength(1);
    expect(wallet.transactions[0]).toMatchObject({ kind: "purchase", coins: 300 });
  });
});

describe("unlockSeason", () => {
  it("unlocks every episode of the series and deducts the season price", async () => {
    const store = makeStore();
    await buyPack(store, "pack-2500");

    await store.dispatch(unlockSeason({ seriesId: SERIES }));

    const state = store.getState();
    expect(isEpisodeLocked(state, SERIES, 5)).toBe(false);
    expect(state.wallet.coins).toBe(STARTING_COINS + 2700 - SEASON_UNLOCK_COST);
    expect(state.wallet.transactions[0]).toMatchObject({ kind: "unlock", coins: -SEASON_UNLOCK_COST });
  });
});

describe("purchaseSeason", () => {
  it("unlocks the season without touching the coins", async () => {
    const store = makeStore();
    const purchase = store.dispatch(purchaseSeason(SERIES));
    expect(store.getState().unlocks.purchasingSeasonId).toBe(SERIES);

    jest.advanceTimersByTime(1000);
    await purchase;

    const state = store.getState();
    expect(state.unlocks.purchasingSeasonId).toBeNull();
    expect(isEpisodeLocked(state, SERIES, 5)).toBe(false);
    expect(state.wallet.coins).toBe(STARTING_COINS);
    expect(state.wallet.transactions).toHaveLength(0);
  });
});
