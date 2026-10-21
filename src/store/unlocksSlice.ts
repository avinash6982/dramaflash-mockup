import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { EPISODE_UNLOCK_COST, SEASON_UNLOCK_COST } from "@/data/coinPacks";
import { getSeries } from "@/data/series";

import type { RootState } from "./index";

type UnlocksState = {
  unlockedEpisodeIds: string[]; // see getEpisodeId
  unlockedSeriesIds: string[];
};

const initialState: UnlocksState = { unlockedEpisodeIds: [], unlockedSeriesIds: [] };

// Episodes are identified by series and 0-based index
export const getEpisodeId = (seriesId: string, index: number) => `${seriesId}:${index}`;

type UnlockError = "not-enough-coins";

// Both unlock thunks read the balance and reject if it is too low.
// The wallet slice listens for the fulfilled action and deducts the coins.
export const unlockEpisode = createAsyncThunk<
  { episodeId: string; cost: number },
  { seriesId: string; index: number },
  { state: RootState; rejectValue: UnlockError }
>("unlocks/unlockEpisode", async ({ seriesId, index }, { getState, rejectWithValue }) => {
  if (getState().wallet.coins < EPISODE_UNLOCK_COST) return rejectWithValue("not-enough-coins");
  return { episodeId: getEpisodeId(seriesId, index), cost: EPISODE_UNLOCK_COST };
});

export const unlockSeason = createAsyncThunk<
  { seriesId: string; cost: number },
  { seriesId: string },
  { state: RootState; rejectValue: UnlockError }
>("unlocks/unlockSeason", async ({ seriesId }, { getState, rejectWithValue }) => {
  if (getState().wallet.coins < SEASON_UNLOCK_COST) return rejectWithValue("not-enough-coins");
  return { seriesId, cost: SEASON_UNLOCK_COST };
});

const unlocksSlice = createSlice({
  name: "unlocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(unlockEpisode.fulfilled, (state, action) => {
        state.unlockedEpisodeIds.push(action.payload.episodeId);
      })
      .addCase(unlockSeason.fulfilled, (state, action) => {
        state.unlockedSeriesIds.push(action.payload.seriesId);
      });
  },
});

export default unlocksSlice.reducer;

// The only place that decides whether an episode is locked: components must use this
export function isEpisodeLocked(state: RootState, seriesId: string, index: number) {
  if (index < getSeries(seriesId).freeEpisodes) return false;
  if (state.unlocks.unlockedSeriesIds.includes(seriesId)) return false;
  return !state.unlocks.unlockedEpisodeIds.includes(getEpisodeId(seriesId, index));
}
