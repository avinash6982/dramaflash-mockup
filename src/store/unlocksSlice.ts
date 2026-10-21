import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { EPISODE_UNLOCK_COST, SEASON_UNLOCK_COST } from "@/data/coinPacks";
import { getSeries } from "@/data/series";

import type { RootState } from "./index";

type UnlocksState = {
  unlockedEpisodeIds: string[]; // see getEpisodeId
  unlockedSeriesIds: string[];
  purchasingSeasonId: string | null; // set while the mocked season purchase runs
  premium: boolean; // Premium Membership: every episode of every series
  premiumRenewsOn: number | null; // next renewal, or the end of paid access once cancelled
  premiumCancelled: boolean; // a cancelled member keeps access until premiumRenewsOn
  premiumBusy: boolean; // a mocked purchase or cancellation is running
  membershipSheetRequest: number; // each tap on Subscribe adds 1 (the sheet opens when it goes up)
};

const initialState: UnlocksState = {
  unlockedEpisodeIds: [],
  unlockedSeriesIds: [],
  purchasingSeasonId: null,
  premium: false,
  premiumRenewsOn: null,
  premiumCancelled: false,
  premiumBusy: false,
  membershipSheetRequest: 0,
};

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

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

// Premium Membership, EUR 9.99 per month: a mocked purchase (about 1 s) that unlocks everything.
// In production this is a StoreKit / Play Billing subscription with server-side validation.
export const purchasePremium = createAsyncThunk("unlocks/purchasePremium", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Like the app stores: cancelling stops the renewal but keeps the access until the paid month ends.
// In production the store owns the subscription (the app would open its manage-subscription page).
export const cancelPremium = createAsyncThunk("unlocks/cancelPremium", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

function addUnlockedSeries(state: UnlocksState, seriesId: string) {
  if (!state.unlockedSeriesIds.includes(seriesId)) state.unlockedSeriesIds.push(seriesId);
}

const unlocksSlice = createSlice({
  name: "unlocks",
  initialState,
  reducers: {
    openMembershipSheet: (state) => {
      state.membershipSheetRequest += 1;
    },
  },
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
      })
      .addCase(purchasePremium.pending, (state) => {
        state.premiumBusy = true;
      })
      .addCase(purchasePremium.fulfilled, (state) => {
        state.premiumBusy = false;
        state.premium = true;
        state.premiumCancelled = false;
        state.premiumRenewsOn = Date.now() + ONE_MONTH_MS;
      })
      .addCase(purchasePremium.rejected, (state) => {
        state.premiumBusy = false;
      })
      .addCase(cancelPremium.pending, (state) => {
        state.premiumBusy = true;
      })
      .addCase(cancelPremium.fulfilled, (state) => {
        state.premiumBusy = false;
        state.premiumCancelled = true; // premium stays true until premiumRenewsOn
      })
      .addCase(cancelPremium.rejected, (state) => {
        state.premiumBusy = false;
      });
  },
});

export const { openMembershipSheet } = unlocksSlice.actions;
export default unlocksSlice.reducer;

export const isSeasonUnlocked = (state: RootState, seriesId: string) =>
  state.unlocks.premium || state.unlocks.unlockedSeriesIds.includes(seriesId);

// The only place that decides whether an episode is locked: components must use this
export function isEpisodeLocked(state: RootState, seriesId: string, index: number) {
  if (index < getSeries(seriesId).freeEpisodes) return false;
  if (isSeasonUnlocked(state, seriesId)) return false;
  return !state.unlocks.unlockedEpisodeIds.includes(getEpisodeId(seriesId, index));
}

export type MembershipStatus = "none" | "active" | "cancelled";

// "cancelled" still has access: premium stays true until the renewal date passes
export function membershipStatus(state: RootState): MembershipStatus {
  if (!state.unlocks.premium) return "none";
  return state.unlocks.premiumCancelled ? "cancelled" : "active";
}
