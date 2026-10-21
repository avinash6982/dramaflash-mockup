import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

import { makeStore, restoreSaved } from "../index";
import { parseSavedState, pickSavedState } from "../persist";
import { toggleFavouriteSeries } from "../favouritesSlice";
import { buyPackAndUnlock } from "../unlockFlow";
import { setEpisode } from "../playerSlice";
import { cancelPremium, membershipStatus, purchasePremium } from "../unlocksSlice";

// AsyncStorage is native code, so the tests use the mock the library ships for Jest
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

const NOW = Date.UTC(2026, 9, 21);
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

async function finish<T>(promise: Promise<T>) {
  await jest.advanceTimersByTimeAsync(1000);
  return promise;
}

// A store that has been used: coins bought, an episode unlocked, a favourite, premium
async function usedStore() {
  const store = makeStore();
  store.dispatch(setEpisode({ seriesId: "ceos-secret-life", index: 3 }));
  await finish(store.dispatch(buyPackAndUnlock("pack-800")));
  store.dispatch(toggleFavouriteSeries("schattenkuss"));
  await finish(store.dispatch(purchasePremium()));
  return store;
}

describe("saving and restoring", () => {
  it("brings back coins, unlocks, favourites and the membership", async () => {
    const used = await usedStore();
    const json = JSON.stringify(pickSavedState(used.getState()));

    const fresh = makeStore();
    fresh.dispatch(restoreSaved(parseSavedState(json, NOW)!));

    const state = fresh.getState();
    expect(state.wallet.coins).toBe(used.getState().wallet.coins);
    expect(state.wallet.transactions).toHaveLength(used.getState().wallet.transactions.length);
    expect(state.unlocks.unlockedEpisodeIds).toEqual(["ceos-secret-life:3"]);
    expect(state.favourites.seriesIds).toEqual(["schattenkuss"]);
    expect(membershipStatus(state)).toBe("active");
  });

  it("does not save things that only exist while something runs", async () => {
    const saved = JSON.stringify(pickSavedState(await usedStore().then((s) => s.getState())));
    expect(saved).not.toContain("purchaseStatus");
    expect(saved).not.toContain("Request");
    expect(saved).not.toContain("premiumBusy");
  });
});

describe("reading what was saved", () => {
  it("starts fresh for nothing, damaged text or a wrong shape", () => {
    expect(parseSavedState(null, NOW)).toBeNull();
    expect(parseSavedState("{not json", NOW)).toBeNull();
    expect(parseSavedState('{"wallet":{"coins":"many"}}', NOW)).toBeNull();
  });

  it("ends a cancelled membership once its paid month has run out", async () => {
    const store = makeStore();
    await finish(store.dispatch(purchasePremium()));
    await finish(store.dispatch(cancelPremium()));
    const json = JSON.stringify(pickSavedState(store.getState()));
    const renewsOn = store.getState().unlocks.premiumRenewsOn!;

    expect(parseSavedState(json, renewsOn - DAY)!.unlocks.premium).toBe(true); // still paid for
    const later = parseSavedState(json, renewsOn + DAY)!;
    expect(later.unlocks.premium).toBe(false);
    expect(later.unlocks.premiumCancelled).toBe(false);
  });
});
