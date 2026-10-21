import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, ThunkAction, UnknownAction } from "@reduxjs/toolkit";

import { isTokenEarned, offersReward, shuffledBonuses } from "@/data/rewards";
import { findSeries } from "@/data/series";

import type { RootState } from "./index";
import { getEpisodeId } from "./unlocksSlice";

type Offer = { episodeId: string; bonuses: number[] }; // bonuses: the coins behind the three cards

type RewardsState = {
  claimedEpisodeIds: string[]; // one reward per episode (see getEpisodeId); saved between launches
  offer: Offer | null; // the reward the sheet is showing
  rewardSheetRequest: number; // each offer adds 1 (the sheet opens when it goes up)
};

const initialState: RewardsState = { claimedEpisodeIds: [], offer: null, rewardSheetRequest: 0 };

const rewardsSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {
    offerReward: {
      // prepare is where randomness is allowed: reducers themselves must stay predictable
      prepare: (episodeId: string) => ({ payload: { episodeId, bonuses: shuffledBonuses() } }),
      reducer: (state, action: PayloadAction<Offer>) => {
        state.offer = action.payload;
        state.rewardSheetRequest += 1;
      },
    },
    // The user flipped a card: the episode's reward is used up. The wallet adds the coins.
    claimReward: (state, action: PayloadAction<{ episodeId: string; coins: number }>) => {
      state.claimedEpisodeIds.push(action.payload.episodeId);
    },
  },
});

export const { offerReward, claimReward } = rewardsSlice.actions;
export default rewardsSlice.reducer;

type AppThunk<Result> = ThunkAction<Result, RootState, unknown, UnknownAction>;

// Called when an episode ends. Opens the reward sheet and returns true when the episode earned a
// Streak Token, is one of the free episodes before the cliffhanger and was not rewarded yet.
export const offerRewardIfEarned =
  (args: {
    seriesId: string;
    index: number;
    watchedSeconds: number;
    episodeSeconds: number;
  }): AppThunk<boolean> =>
  (dispatch, getState) => {
    const series = findSeries(args.seriesId);
    if (!series) return false;

    const episodeId = getEpisodeId(args.seriesId, args.index);
    const eligible =
      offersReward(args.index, series.freeEpisodes) &&
      isTokenEarned(args.watchedSeconds, args.episodeSeconds) &&
      !getState().rewards.claimedEpisodeIds.includes(episodeId);
    if (eligible) dispatch(offerReward(episodeId));
    return eligible;
  };
