import { createAsyncThunk } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "./index";
import { purchasePremium, unlockEpisode, unlockSeason } from "./unlocksSlice";
import { purchaseCoins } from "./walletSlice";

export type UnlockResult = "unlocked" | "not-enough-coins";

type ThunkConfig = { state: RootState; dispatch: AppDispatch };

// "Unlock Now": unlock what the lock sheet has selected for the episode on screen.
// Coins can be too few, which is a normal result (the recharge sheet opens), not an error.
export const unlockSelected = createAsyncThunk<UnlockResult, void, ThunkConfig>(
  "flow/unlockSelected",
  async (_, { getState, dispatch }) => {
    const { seriesId, episodeIndex, unlockChoice } = getState().player;
    if (!seriesId) throw new Error("No episode is open");

    if (unlockChoice === "premium") {
      await dispatch(purchasePremium()).unwrap(); // real money, not coins, so no balance check
      return "unlocked";
    }

    const result =
      unlockChoice === "episode"
        ? await dispatch(unlockEpisode({ seriesId, index: episodeIndex }))
        : await dispatch(unlockSeason({ seriesId }));
    return result.meta.requestStatus === "fulfilled" ? "unlocked" : "not-enough-coins";
  },
);

// "Buy N Coins" on the recharge sheet: the mocked purchase credits the pack, then the
// selection is unlocked in the same step, so the episode starts playing right away.
export const buyPackAndUnlock = createAsyncThunk<UnlockResult, string, ThunkConfig>(
  "flow/buyPackAndUnlock",
  async (packId, { dispatch }) => {
    await dispatch(purchaseCoins(packId)).unwrap();
    return dispatch(unlockSelected()).unwrap();
  },
);
