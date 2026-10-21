import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./index";
import { getEpisodeId } from "./unlocksSlice";

type FavouritesState = {
  seriesIds: string[]; // newest first; these are what the Favourites tab shows
  likedEpisodeIds: string[]; // remembered, but not listed anywhere (see getEpisodeId)
};

const initialState: FavouritesState = { seriesIds: [], likedEpisodeIds: [] };

// Adds the id if it is missing, removes it if it is there
function toggle(list: string[], id: string) {
  const index = list.indexOf(id);
  if (index >= 0) list.splice(index, 1);
  else list.unshift(id);
}

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    toggleFavouriteSeries: (state, action: PayloadAction<string>) => {
      toggle(state.seriesIds, action.payload);
    },
    toggleEpisodeLike: (state, action: PayloadAction<string>) => {
      toggle(state.likedEpisodeIds, action.payload);
    },
  },
});

export const { toggleFavouriteSeries, toggleEpisodeLike } = favouritesSlice.actions;
export default favouritesSlice.reducer;

export const isFavouriteSeries = (state: RootState, seriesId: string) =>
  state.favourites.seriesIds.includes(seriesId);

export const isEpisodeLiked = (state: RootState, seriesId: string, index: number) =>
  state.favourites.likedEpisodeIds.includes(getEpisodeId(seriesId, index));
