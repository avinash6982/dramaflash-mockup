import {
  allGenres,
  categorySeries,
  newest,
  searchSeries,
  seriesInGenre,
  topRated,
} from "../discover";
import { summarizeUnlocks } from "../library";
import { homeRails, series } from "../series";

describe("searchSeries", () => {
  it("finds everything for an empty search", () => {
    expect(searchSeries("", "en")).toHaveLength(series.length);
    expect(searchSeries("   ", "en")).toHaveLength(series.length);
  });

  it("matches the title in the user's language, ignoring case", () => {
    expect(searchSeries("CEO", "en").map((s) => s.id)).toContain("der-ceo-und-ich");
    // the German title "Liebe auf Umwegen" has no match in English, "Love on Detours" has no "liebe"
    expect(searchSeries("liebe", "de").map((s) => s.id)).toContain("liebe-auf-umwegen");
    expect(searchSeries("liebe", "en").map((s) => s.id)).not.toContain("liebe-auf-umwegen");
  });

  it("matches the genre label in the user's language", () => {
    expect(searchSeries("thriller", "en").map((s) => s.id)).toContain("mein-geheimes-leben");
    expect(searchSeries("milliardär", "de").map((s) => s.id)).toContain("der-ceo-und-ich");
  });

  it("finds nothing for a nonsense word", () => {
    expect(searchSeries("qqqzzz", "en")).toHaveLength(0);
  });
});

describe("genres and rankings", () => {
  it("lists every genre once, and each has at least one series", () => {
    const genres = allGenres();
    expect(new Set(genres).size).toBe(genres.length);
    for (const genre of genres) expect(seriesInGenre(genre).length).toBeGreaterThan(0);
  });

  it("sorts top rated by rating and newest by year", () => {
    const ratings = topRated(5).map((s) => s.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
    const years = newest(5).map((s) => s.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(topRated(3)).toHaveLength(3);
  });

  it("has different release years, so New releases is not just a copy of the data order", () => {
    expect(new Set(series.map((s) => s.year)).size).toBeGreaterThan(1);
  });
});

describe("summarizeUnlocks", () => {
  it("counts single episodes per series and marks full seasons", () => {
    const summary = summarizeUnlocks(["racheengel"], ["ceos-secret-life:3", "ceos-secret-life:4"]);

    expect(summary).toContainEqual({
      seriesId: "ceos-secret-life",
      fullSeason: false,
      episodes: 2,
    });
    expect(summary).toContainEqual({ seriesId: "racheengel", fullSeason: true, episodes: 0 });
  });

  it("lists a series once even if it has a season and single episodes", () => {
    const summary = summarizeUnlocks(["racheengel"], ["racheengel:3"]);
    expect(summary).toEqual([{ seriesId: "racheengel", fullSeason: true, episodes: 1 }]);
  });

  it("is empty when nothing is unlocked", () => {
    expect(summarizeUnlocks([], [])).toEqual([]);
  });
});

describe("categorySeries (See all)", () => {
  it("exists for every Home rail and starts with the series the rail shows", () => {
    for (const rail of homeRails) {
      const all = categorySeries(rail.key);
      expect(all).toBeDefined();
      expect(all!.slice(0, rail.seriesIds.length).map((s) => s.id)).toEqual([...rail.seriesIds]);
    }
  });

  it("lists each series once and is never shorter than the rail", () => {
    for (const rail of homeRails) {
      const ids = categorySeries(rail.key)!.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBeGreaterThanOrEqual(rail.seriesIds.length);
    }
  });

  it("is undefined for a key that is not a Home rail", () => {
    expect(categorySeries("nope")).toBeUndefined();
  });
});
