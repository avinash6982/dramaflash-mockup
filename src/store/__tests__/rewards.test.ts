import { STARTING_COINS } from "@/data/coinPacks";

import { hasDemoChanges, makeStore, resetDemo } from "../index";
import { claimReward, offerRewardIfEarned } from "../rewardsSlice";

const SERIES = "ceos-secret-life"; // 3 free episodes, 192 s each at index 0

const end = (index: number, watchedSeconds: number) => ({
  seriesId: SERIES,
  index,
  watchedSeconds,
  episodeSeconds: 192,
});

describe("offering a reward when an episode ends", () => {
  it("opens the sheet for a really watched free episode", () => {
    const store = makeStore();
    expect(store.dispatch(offerRewardIfEarned(end(0, 30)))).toBe(true);

    const { offer, rewardSheetRequest } = store.getState().rewards;
    expect(offer?.episodeId).toBe(`${SERIES}:0`);
    expect(offer?.bonuses).toHaveLength(3);
    expect(rewardSheetRequest).toBe(1);
  });

  it("does not for an episode that was only scrubbed to the end", () => {
    const store = makeStore();
    expect(store.dispatch(offerRewardIfEarned(end(0, 2)))).toBe(false);
    expect(store.getState().rewards.offer).toBeNull();
  });

  it("does not for the last free episode (it leads into the lock)", () => {
    const store = makeStore();
    expect(store.dispatch(offerRewardIfEarned(end(2, 60)))).toBe(false);
  });

  it("does not twice for the same episode once its reward was taken", () => {
    const store = makeStore();
    store.dispatch(claimReward({ episodeId: `${SERIES}:1`, coins: 10 }));
    expect(store.dispatch(offerRewardIfEarned(end(1, 60)))).toBe(false);
    expect(store.dispatch(offerRewardIfEarned(end(0, 60)))).toBe(true); // another episode is fine
  });
});

describe("taking the reward", () => {
  it("adds the coins to the wallet and the history, and marks the episode as rewarded", () => {
    const store = makeStore();
    store.dispatch(claimReward({ episodeId: `${SERIES}:0`, coins: 20 }));

    const { wallet, rewards } = store.getState();
    expect(wallet.coins).toBe(STARTING_COINS + 20);
    expect(wallet.transactions[0]).toMatchObject({ kind: "reward", coins: 20 });
    expect(rewards.claimedEpisodeIds).toEqual([`${SERIES}:0`]);
  });

  it("counts as a change that Reset demo data undoes", () => {
    const store = makeStore();
    store.dispatch(claimReward({ episodeId: `${SERIES}:0`, coins: 5 }));
    expect(hasDemoChanges(store.getState())).toBe(true);

    store.dispatch(resetDemo());
    expect(store.getState().rewards.claimedEpisodeIds).toEqual([]);
    expect(store.getState().wallet.coins).toBe(STARTING_COINS);
  });
});
