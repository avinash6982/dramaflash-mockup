import { combineReducers, configureStore, createAction } from "@reduxjs/toolkit";

import { STARTING_COINS } from "@/data/coinPacks";

import favouritesReducer from "./favouritesSlice";
import playerReducer from "./playerSlice";
import unlocksReducer from "./unlocksSlice";
import walletReducer from "./walletSlice";

// Dev button on the Profile: back to the starting state (coins, unlocks, membership, favourites)
export const resetDemo = createAction("app/resetDemo");

const appReducer = combineReducers({
  wallet: walletReducer,
  unlocks: unlocksReducer,
  player: playerReducer,
  favourites: favouritesReducer,
});

const rootReducer: typeof appReducer = (state, action) =>
  // a state of undefined makes every slice return its initial state
  appReducer(resetDemo.match(action) ? undefined : state, action);

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
