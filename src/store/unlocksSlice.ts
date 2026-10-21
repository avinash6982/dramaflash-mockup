import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { EPISODE_UNLOCK_COST, SEASON_UNLOCK_COST } from "@/data/coinPacks";
import { getSeries } from "@/data/series";

import type { RootState } from "./index";

type UnlocksState = {
  unlockedEpisodeIds: string[]; // see getEpisodeId
  unlockedSeriesIds: string[];
  purchasingSeasonId: string | null; // set while the mocked season purchase runs
};

const initialState: UnlocksState = {
  unlockedEpisodeIds: [],
  unlockedSeriesIds: [],
  purchasingSeasonId: null,
};

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

// The "Unlock Full Season €9.99" banner: a mocked real-money purchase that does not touch the coins.
// In production this is StoreKit / Play Billing with server-side receipt validation.
export const purchaseSeason = createAsyncThunk(
  "unlocks/purchaseSeason",
  async (seriesId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return seriesId;
  },
);

function addUnlockedSeries(state: UnlocksState, seriesId: string) {
  if (!state.unlockedSeriesIds.includes(seriesId)) state.unlockedSeriesIds.push(seriesId);
}

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
        addUnlockedSeries(state, action.payload.seriesId);
      })
      .addCase(purchaseSeason.pending, (state, action) => {
        state.purchasingSeasonId = action.meta.arg;
      })
      .addCase(purchaseSeason.fulfilled, (state, action) => {
        state.purchasingSeasonId = null;
        addUnlockedSeries(state, action.payload);
      })
      .addCase(purchaseSeason.rejected, (state) => {
        state.purchasingSeasonId = null;
      });
  },
});

export default unlocksSlice.reducer;

export const isSeasonUnlocked = (state: RootState, seriesId: string) =>
  state.unlocks.unlockedSeriesIds.includes(seriesId);

// The only place that decides whether an episode is locked: components must use this
export function isEpisodeLocked(state: RootState, seriesId: string, index: number) {
  if (index < getSeries(seriesId).freeEpisodes) return false;
  if (isSeasonUnlocked(state, seriesId)) return false;
  return !state.unlocks.unlockedEpisodeIds.includes(getEpisodeId(seriesId, index));
}
