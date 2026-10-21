import { combineReducers, configureStore, createAction } from "@reduxjs/toolkit";

import { STARTING_COINS } from "@/data/coinPacks";

import favouritesReducer from "./favouritesSlice";
import type { SavedState } from "./persist";
import playerReducer from "./playerSlice";
import unlocksReducer from "./unlocksSlice";
import walletReducer from "./walletSlice";

// Dev button on the Profile: back to the starting state (coins, unlocks, membership, favourites)
export const resetDemo = createAction("app/resetDemo");

// Puts back what was saved last time (see persist.ts); dispatched once, before the first screen
export const restoreSaved = createAction<SavedState>("app/restoreSaved");

const appReducer = combineReducers({
  wallet: walletReducer,
  unlocks: unlocksReducer,
  player: playerReducer,
  favourites: favouritesReducer,
});

const rootReducer: typeof appReducer = (state, action) => {
  // a state of undefined makes every slice return its initial state
  const current = appReducer(resetDemo.match(action) ? undefined : state, action);
  if (!restoreSaved.match(action)) return current;

  // keep the in-progress flags and counters of the fresh state, replace the saved data
  const saved = action.payload;
  return {
    ...current,
    wallet: { ...current.wallet, ...saved.wallet },
    unlocks: { ...current.unlocks, ...saved.unlocks },
    favourites: saved.favourites,
  };
};

// A function so tests can create a fresh store; the app uses the single `store` below
export const makeStore = () => configureStore({ reducer: rootReducer });

export const store = makeStore();

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;

// True once anything differs from the starting state; the Profile shows the reset button only then
export function hasDemoChanges(state: RootState): boolean {
  const { wallet, unlocks, favourites } = state;
  return (
    wallet.coins !== STARTING_COINS ||
    wallet.transactions.length > 0 ||
    unlocks.premium ||
    unlocks.unlockedEpisodeIds.length > 0 ||
    unlocks.unlockedSeriesIds.length > 0 ||
    favourites.seriesIds.length > 0 ||
    favourites.likedEpisodeIds.length > 0
  );
}
