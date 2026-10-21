import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RootState } from "./index";

const STORAGE_KEY = "dramaflash-state-v1"; // bump the number if the saved shape ever changes
const SAVE_DELAY_MS = 300;

// The part of the state that is kept between launches. Things that only exist while something is
// running (a purchase in progress, sheet request counters, the episode on screen) are left out.
export type SavedState = {
  wallet: Pick<RootState["wallet"], "coins" | "transactions">;
  unlocks: Pick<
    RootState["unlocks"],
    "unlockedEpisodeIds" | "unlockedSeriesIds" | "premium" | "premiumRenewsOn" | "premiumCancelled"
  >;
  favourites: RootState["favourites"];
  rewards: Pick<RootState["rewards"], "claimedEpisodeIds">;
};

export function pickSavedState(state: RootState): SavedState {
  const { wallet, unlocks, favourites } = state;
  return {
    wallet: { coins: wallet.coins, transactions: wallet.transactions },
    unlocks: {
      unlockedEpisodeIds: unlocks.unlockedEpisodeIds,
      unlockedSeriesIds: unlocks.unlockedSeriesIds,
      premium: unlocks.premium,
      premiumRenewsOn: unlocks.premiumRenewsOn,
      premiumCancelled: unlocks.premiumCancelled,
    },
    favourites,
    rewards: { claimedEpisodeIds: state.rewards.claimedEpisodeIds },
  };
}

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

// Reads what was saved. Anything missing or damaged gives null, so the app starts fresh instead of
// crashing on a bad value. A cancelled membership whose paid month has run out is over by now.
export function parseSavedState(json: string | null, now: number): SavedState | null {
  if (!json) return null;
  try {
    const saved = JSON.parse(json) as SavedState;
    const { wallet, unlocks, favourites, rewards } = saved;
    const valid =
      typeof wallet?.coins === "number" &&
      Array.isArray(wallet.transactions) &&
      isStringList(unlocks?.unlockedEpisodeIds) &&
      isStringList(unlocks?.unlockedSeriesIds) &&
      typeof unlocks.premium === "boolean" &&
      isStringList(favourites?.seriesIds) &&
      isStringList(favourites?.likedEpisodeIds) &&
      (rewards === undefined || isStringList(rewards.claimedEpisodeIds)); // older saves have none
    if (!valid) return null;
    saved.rewards = rewards ?? { claimedEpisodeIds: [] };

    const ended = unlocks.premiumCancelled && (unlocks.premiumRenewsOn ?? 0) < now;
    if (ended) {
      saved.unlocks = {
        ...unlocks,
        premium: false,
        premiumCancelled: false,
        premiumRenewsOn: null,
      };
    }
    return saved;
  } catch {
    return null;
  }
}

export async function loadSavedState(): Promise<SavedState | null> {
  try {
    return parseSavedState(await AsyncStorage.getItem(STORAGE_KEY), Date.now());
  } catch {
    return null; // storage is not available (for example private browsing): start fresh
  }
}

// Saves after every change, but waits a moment so a burst of changes is written once
export function startSaving(store: {
  subscribe: (listener: () => void) => () => void;
  getState: () => RootState;
}) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return store.subscribe(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pickSavedState(store.getState()))).catch(
        () => {}, // the app keeps working, it just will not remember
      );
    }, SAVE_DELAY_MS);
  });
}
