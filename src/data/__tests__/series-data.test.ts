import { en } from "@/i18n/en";
import { de } from "@/i18n/de";
import { formatEuro } from "@/i18n/formatPrice";
import { localize } from "@/i18n/localized";
import type { LocalizedText } from "@/i18n/localized";

import { SEASON_PRICE_EUR } from "../coinPacks";
import {
  alsoLikeSeriesIds,
  clampEpisodeIndex,
  findSeries,
  heroSeriesId,
  homeGenres,
  homeSections,
  series,
} from "../series";

const toSeconds = (duration: string) => {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

describe("series data", () => {
  // Home and the detail screen look these ids up and would crash on a typo
  it("only references series that exist", () => {
    const referenced = [
      heroSeriesId,
      ...alsoLikeSeriesIds,
      ...homeSections.flatMap((section) => section.rails.flatMap((rail) => rail.seriesIds)),
    ];
    for (const id of referenced) expect(findSeries(id)).toBeDefined();
  });

  it("has unique series ids and at least one episode each", () => {
    expect(new Set(series.map((s) => s.id)).size).toBe(series.length);
    for (const s of series) expect(s.episodes.length).toBeGreaterThan(0);
  });

  it("returns undefined for a missing or unknown id", () => {
    expect(findSeries(undefined)).toBeUndefined();
    expect(findSeries("nope")).toBeUndefined();
  });

  it("only uses genres that have an English and a German label", () => {
    const genres = new Set([...homeGenres, ...series.flatMap((s) => s.genres)]);
    for (const genre of genres) {
      expect(en.genres[genre]).toBeTruthy();
      expect(de.genres[genre]).toBeTruthy();
    }
  });

  it("has every text in both languages", () => {
    const texts: LocalizedText[] = series.flatMap((s) => [
      s.title,
      s.synopsis,
      ...s.highlights,
      ...s.episodes.map((e) => e.title),
      ...s.cast.map((c) => c.role),
    ]);
    for (const text of texts) {
      expect(text.en.trim()).not.toBe("");
      expect(text.de.trim()).not.toBe("");
    }
  });

  // The poster says "2m/ep", so the episode list must not show 4-minute episodes
  it("shows episode durations that match minutes per episode", () => {
    for (const s of series) {
      const average = s.episodes.reduce((sum, e) => sum + toSeconds(e.duration), 0) / s.episodes.length;
      expect(Math.round(average / 60)).toBe(s.minutesPerEpisode);
    }
  });

  it("never offers more listed episodes than the series has", () => {
    for (const s of series) expect(s.episodes.length).toBeLessThanOrEqual(s.totalEpisodes);
  });
});

describe("localize and formatEuro", () => {
  const text = { en: "Home", de: "Start" };
  it("picks the language and falls back to English", () => {
    expect(localize(text, "de")).toBe("Start");
    expect(localize(text, "en")).toBe("Home");
    expect(localize(text, "fr")).toBe("Home");
  });

  it("formats the season price per language", () => {
    expect(formatEuro(SEASON_PRICE_EUR, "en")).toBe("€9.99");
    // German puts the symbol after the number, separated by a non-breaking space
    expect(formatEuro(SEASON_PRICE_EUR, "de").replace(/\s/g, " ")).toBe("9,99 €");
  });
});

describe("clampEpisodeIndex", () => {
  it("keeps a valid index", () => expect(clampEpisodeIndex("2", 6)).toBe(2));
  it("falls back to 0 for missing, non-numeric or negative values", () => {
    expect(clampEpisodeIndex(undefined, 6)).toBe(0);
    expect(clampEpisodeIndex("abc", 6)).toBe(0);
    expect(clampEpisodeIndex("-3", 6)).toBe(0);
    expect(clampEpisodeIndex("1.5", 6)).toBe(0);
  });
  it("caps an index past the last episode", () => expect(clampEpisodeIndex("99", 6)).toBe(5));
});
