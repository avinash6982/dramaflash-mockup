import { configureStore } from "@reduxjs/toolkit";

import favouritesReducer from "./favouritesSlice";
import playerReducer from "./playerSlice";
import unlocksReducer from "./unlocksSlice";
import walletReducer from "./walletSlice";

// A function so tests can create a fresh store; the app uses the single `store` below
export const makeStore = () =>
  configureStore({
    reducer: {
        wallet: walletReducer,
        unlocks: unlocksReducer,
        player: playerReducer,
        favourites: favouritesReducer,
      },
  });

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
