import { de } from "@/i18n/de";
import { en } from "@/i18n/en";
import { localize } from "@/i18n/localized";

import { getSeries, homeRails, series } from "./series";
import type { GenreId, Series } from "./series";

const genreLabels = { en: en.genres, de: de.genres };

// Series whose title or genre contains the typed text (not case sensitive), in the user's language.
// An empty search finds everything.
export function searchSeries(query: string, language: string): Series[] {
  const text = query.trim().toLowerCase();
  if (text === "") return series;

  const labels = genreLabels[language === "de" ? "de" : "en"];
  return series.filter((item) => {
    const title = localize(item.title, language).toLowerCase();
    const genres = item.genres.map((genre) => labels[genre].toLowerCase());
    return title.includes(text) || genres.some((genre) => genre.includes(text));
  });
}

export function seriesInGenre(genre: GenreId): Series[] {
  return series.filter((item) => item.genres.includes(genre));
}

// Every genre that at least one series has, in the order the data first uses them
export function allGenres(): GenreId[] {
  return [...new Set(series.flatMap((item) => item.genres))];
}

// Best rating first; the newer series wins a tie
export function topRated(count: number): Series[] {
  return [...series].sort((a, b) => b.rating - a.rating || b.year - a.year).slice(0, count);
}

// Newest year first; the better rating wins a tie
export function newest(count: number): Series[] {
  return [...series].sort((a, b) => b.year - a.year || b.rating - a.rating).slice(0, count);
}

// The rails on Home that have a "See all", and what else belongs to each one besides the series
// the rail shows (those come first, so the full list starts with what Home showed)
const categoryExtras: Record<string, () => Series[]> = {
  trendingRomance: () => seriesInGenre("romance"),
  forbiddenLove: () => seriesInGenre("forbiddenLove"),
  mostWatched: () => [...series].sort((a, b) => b.totalEpisodes - a.totalEpisodes),
};

// Everything behind a rail's "See all", or undefined for a key that is not a Home rail
export function categorySeries(key: string): Series[] | undefined {
  const rail = homeRails.find((item) => item.key === key);
  const extras = categoryExtras[key];
  if (!rail || !extras) return undefined;

  const first = rail.seriesIds.map(getSeries);
  const more = extras().filter((item) => !rail.seriesIds.includes(item.id));
  return [...first, ...more];
}
