import { recommendedPack, STARTING_COINS } from "@/data/coinPacks";
import { makeStore } from "../index";
import { setEpisode, setUnlockChoice } from "../playerSlice";
import { buyPackAndUnlock, unlockSelected } from "../unlockFlow";
import { isEpisodeLocked } from "../unlocksSlice";

const SERIES = "ceos-secret-life"; // 3 free episodes

// Someone has landed on locked episode 4 (index 3)
function openLockedEpisode() {
  const store = makeStore();
  store.dispatch(setEpisode({ seriesId: SERIES, index: 3 }));
  return store;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

// The mocked purchases wait 1 s, so let the timers run while the thunk is pending
async function finish<T>(promise: Promise<T>) {
  await jest.advanceTimersByTimeAsync(1000);
  return promise;
}

describe("unlockSelected", () => {
  it("reports too few coins and changes nothing", async () => {
    const store = openLockedEpisode();
    const result = await store.dispatch(unlockSelected());

    expect(result.payload).toBe("not-enough-coins");
    expect(store.getState().wallet.coins).toBe(STARTING_COINS);
    expect(isEpisodeLocked(store.getState(), SERIES, 3)).toBe(true);
  });

  it("premium unlocks every episode of every series without touching the coins", async () => {
    const store = openLockedEpisode();
    store.dispatch(setUnlockChoice("premium"));

    const result = await finish(store.dispatch(unlockSelected()));

    expect(result.payload).toBe("unlocked");
    expect(store.getState().wallet.coins).toBe(STARTING_COINS);
    expect(isEpisodeLocked(store.getState(), SERIES, 3)).toBe(false);
    expect(isEpisodeLocked(store.getState(), "racheengel", 50)).toBe(false);
  });
});

describe("buyPackAndUnlock", () => {
  it("credits the pack, takes the episode price and unlocks that episode only", async () => {
    const store = openLockedEpisode();
    const result = await finish(store.dispatch(buyPackAndUnlock("pack-800")));

    expect(result.payload).toBe("unlocked");
    expect(store.getState().wallet.coins).toBe(STARTING_COINS + 800 + 50 - 85);
    expect(isEpisodeLocked(store.getState(), SERIES, 3)).toBe(false);
    expect(isEpisodeLocked(store.getState(), SERIES, 4)).toBe(true);
  });

  it("a pack that is too small for the season buys the coins but leaves it locked", async () => {
    const store = openLockedEpisode();
    store.dispatch(setUnlockChoice("season"));

    const result = await finish(store.dispatch(buyPackAndUnlock("pack-800")));

    expect(result.payload).toBe("not-enough-coins");
    expect(store.getState().wallet.coins).toBe(STARTING_COINS + 850); // kept for next time
    expect(isEpisodeLocked(store.getState(), SERIES, 4)).toBe(true);
  });
});

describe("recommendedPack", () => {
  it("preselects the Popular pack when it covers what is missing", () => {
    expect(recommendedPack(70).id).toBe("pack-800"); // an episode with 15 coins in the wallet
    expect(recommendedPack(850).id).toBe("pack-800"); // bonus coins count
  });

  it("otherwise the smallest pack that covers it, or the biggest one", () => {
    expect(recommendedPack(1185).id).toBe("pack-2500"); // the season with 15 coins in the wallet
    expect(recommendedPack(999999).id).toBe("pack-6000"); // nothing covers it
  });
});
