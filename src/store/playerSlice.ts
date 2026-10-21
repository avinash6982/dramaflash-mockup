import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type PlayerState = {
  seriesId: string | null;
  episodeIndex: number;
  lockSheetOpen: boolean;
};

const initialState: PlayerState = { seriesId: null, episodeIndex: 0, lockSheetOpen: false };

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setEpisode: (state, action: PayloadAction<{ seriesId: string; index: number }>) => {
      state.seriesId = action.payload.seriesId;
      state.episodeIndex = action.payload.index;
    },
    openLockSheet: (state) => {
      state.lockSheetOpen = true;
    },
    closeLockSheet: (state) => {
      state.lockSheetOpen = false;
    },
  },
});

export const { setEpisode, openLockSheet, closeLockSheet } = playerSlice.actions;
export default playerSlice.reducer;
