import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { UnlockChoice } from "@/data/coinPacks";

type PlayerState = {
  seriesId: string | null;
  episodeIndex: number;
  // Each tap that wants a sheet adds 1; the sheet opens whenever its number goes up. There is no
  // "is it open" flag to drift out of step with the real sheet (a swipe-down, one still closing).
  lockSheetRequest: number;
  unlockChoice: UnlockChoice; // what the lock sheet will unlock; the recharge sheet needs it too
};

const initialState: PlayerState = {
  seriesId: null,
  episodeIndex: 0,
  lockSheetRequest: 0,
  unlockChoice: "episode",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setEpisode: (state, action: PayloadAction<{ seriesId: string; index: number }>) => {
      state.seriesId = action.payload.seriesId;
      state.episodeIndex = action.payload.index;
    },
    openLockSheet: (state) => {
      state.lockSheetRequest += 1;
    },
    setUnlockChoice: (state, action: PayloadAction<UnlockChoice>) => {
      state.unlockChoice = action.payload;
    },
  },
});

export const { setEpisode, openLockSheet, setUnlockChoice } = playerSlice.actions;
export default playerSlice.reducer;
