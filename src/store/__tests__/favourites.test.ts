import { makeStore } from "../index";
import {
  isEpisodeLiked,
  isFavouriteSeries,
  toggleEpisodeLike,
  toggleFavouriteSeries,
} from "../favouritesSlice";
import { getEpisodeId } from "../unlocksSlice";

describe("favourites", () => {
  it("adds a series, keeps the newest first, and removes it on the second toggle", () => {
    const store = makeStore();
    store.dispatch(toggleFavouriteSeries("schattenkuss"));
    store.dispatch(toggleFavouriteSeries("racheengel"));

    expect(store.getState().favourites.seriesIds).toEqual(["racheengel", "schattenkuss"]);
    expect(isFavouriteSeries(store.getState(), "racheengel")).toBe(true);

    store.dispatch(toggleFavouriteSeries("racheengel"));
    expect(isFavouriteSeries(store.getState(), "racheengel")).toBe(false);
    expect(store.getState().favourites.seriesIds).toEqual(["schattenkuss"]);
  });

  it("remembers the like of an episode without making it a favourite series", () => {
    const store = makeStore();
    store.dispatch(toggleEpisodeLike(getEpisodeId("ceos-secret-life", 2)));

    expect(isEpisodeLiked(store.getState(), "ceos-secret-life", 2)).toBe(true);
    expect(isEpisodeLiked(store.getState(), "ceos-secret-life", 3)).toBe(false);
    expect(isFavouriteSeries(store.getState(), "ceos-secret-life")).toBe(false);

    store.dispatch(toggleEpisodeLike(getEpisodeId("ceos-secret-life", 2)));
    expect(isEpisodeLiked(store.getState(), "ceos-secret-life", 2)).toBe(false);
  });
});
