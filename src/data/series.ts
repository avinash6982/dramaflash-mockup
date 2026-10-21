import type { ImageSourcePropType } from "react-native";

export type Episode = {
  title: string;
  duration: string;
  thumb: ImageSourcePropType;
  videoUri: string;
};

export type CastMember = {
  name: string;
  role: string;
  photo: ImageSourcePropType;
};

export type Series = {
  id: string;
  title: string;
  synopsis: string;
  genres: string[];
  rating: number;
  year: number;
  totalEpisodes: number;
  minutesPerEpisode: number;
  isPro: boolean;
  freeEpisodes: number; // episodes before the lock
  poster: ImageSourcePropType;
  highlights: string[];
  cast: CastMember[];
  episodes: Episode[];
};

// Placeholder clip until the short vertical clips are added (task: vertical player)
const SAMPLE_CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// Episodes, cast and highlights are shared by every series: the design only shows them for one
const shared = {
  highlights: [
    "Intense chemistry from the very first frame.",
    "A gripping double-life narrative with high stakes.",
  ],
  cast: [
    { name: "Elena", role: "Mia (Artist)", photo: require("../../assets/images/cast-elena.webp") },
    { name: "Julian Vance", role: "Alexander (CEO)", photo: require("../../assets/images/cast-julian-vance.webp") },
    { name: "Sarah Lin", role: "Chloe (Best Friend)", photo: require("../../assets/images/cast-sarah-lin.webp") },
    { name: "Marcus", role: "Rival CEO", photo: require("../../assets/images/cast-marcus.webp") },
  ],
  episodes: [
    { title: "The Accidental Message", duration: "3:12", thumb: require("../../assets/images/ep-thumb-1.webp"), videoUri: SAMPLE_CLIP },
    { title: "Coffee and Contracts", duration: "2:55", thumb: require("../../assets/images/ep-thumb-2.webp"), videoUri: SAMPLE_CLIP },
    { title: "A Glimpse Behind the Mask", duration: "3:30", thumb: require("../../assets/images/ep-thumb-3.webp"), videoUri: SAMPLE_CLIP },
    { title: "The Gala Encounter", duration: "4:05", thumb: require("../../assets/images/ep-thumb-4.webp"), videoUri: SAMPLE_CLIP },
    { title: "Misunderstandings", duration: "2:48", thumb: require("../../assets/images/ep-thumb-5-locked.webp"), videoUri: SAMPLE_CLIP },
    { title: "Midnight Confessions", duration: "3:15", thumb: require("../../assets/images/ep-thumb-6-locked.webp"), videoUri: SAMPLE_CLIP },
  ],
};

const base = { year: 2024, freeEpisodes: 3, ...shared };

export const series: Series[] = [
  {
    ...base,
    id: "verbotene-liebe",
    title: "Verbotene Liebe",
    synopsis: "A CEO's dangerous secret contract.",
    genres: ["Romance", "Drama", "Billionaire"],
    rating: 4.8,
    totalEpisodes: 72,
    minutesPerEpisode: 2,
    isPro: true,
    poster: require("../../assets/images/hero-echoes-of-eternity.webp"),
  },
  {
    ...base,
    id: "ceos-secret-life",
    title: "The CEO's Secret Life",
    synopsis:
      "When a struggling artist accidentally discovers that the ruthless CEO of the city's largest conglomerate is actually her anonymous online confidant, her life is turned upside down. Can their digital romance survive the harsh reality of corporate espionage and forbidden love?",
    genres: ["Billionaire", "Secret Identity", "Romance"],
    rating: 4.8,
    totalEpisodes: 45,
    minutesPerEpisode: 3,
    isPro: false,
    poster: require("../../assets/images/hero-ceos-secret-life.webp"),
  },
  {
    ...base,
    id: "der-ceo-und-ich",
    title: "Der CEO und ich",
    synopsis: "A forbidden empire, a dangerous love.",
    genres: ["Romance", "Billionaire"],
    rating: 4.6,
    totalEpisodes: 50,
    minutesPerEpisode: 2,
    isPro: true,
    poster: require("../../assets/images/poster-ceo-and-i.webp"),
  },
  {
    ...base,
    id: "mein-geheimes-leben",
    title: "Mein geheimes Leben",
    synopsis: "A thriller of masks and lies.",
    genres: ["Thriller", "Drama"],
    rating: 4.4,
    totalEpisodes: 30,
    minutesPerEpisode: 1,
    isPro: false,
    poster: require("../../assets/images/poster-my-secret-life.webp"),
  },
  {
    ...base,
    id: "liebe-auf-umwegen",
    title: "Liebe auf Umwegen",
    synopsis: "Two paths, one fate, and time running out.",
    genres: ["Romance", "Fantasy"],
    rating: 4.5,
    totalEpisodes: 65,
    minutesPerEpisode: 2,
    isPro: true,
    poster: require("../../assets/images/poster-love-on-detours.webp"),
  },
  {
    ...base,
    id: "blutige-rosen",
    title: "Blutige Rosen",
    synopsis: "A love that leaves its mark.",
    genres: ["Forbidden Love", "Drama"],
    rating: 4.3,
    totalEpisodes: 80,
    minutesPerEpisode: 2,
    isPro: true,
    poster: require("../../assets/images/poster-bloody-roses.webp"),
  },
  {
    ...base,
    id: "schattenkuss",
    title: "Schattenkuss",
    synopsis: "A forbidden love story that defies the darkness.",
    genres: ["Forbidden Love", "Romance"],
    rating: 4.7,
    totalEpisodes: 45,
    minutesPerEpisode: 2,
    isPro: false,
    poster: require("../../assets/images/poster-shadow-kiss.webp"),
  },
  {
    ...base,
    id: "dunkle-begierde",
    title: "Dunkle Begierde",
    synopsis: "A thriller of consuming passion.",
    genres: ["Forbidden Love", "Thriller"],
    rating: 4.2,
    totalEpisodes: 60,
    minutesPerEpisode: 2,
    isPro: true,
    poster: require("../../assets/images/poster-dark-desire.webp"),
  },
  {
    ...base,
    id: "racheengel",
    title: "Racheengel",
    synopsis: "She fell to earth to settle a score.",
    genres: ["Action", "Fantasy"],
    rating: 4.6,
    totalEpisodes: 90,
    minutesPerEpisode: 3,
    isPro: true,
    poster: require("../../assets/images/poster-avenging-angel.webp"),
  },
  {
    ...base,
    id: "schicksalsband",
    title: "Schicksalsband",
    synopsis: "Your destinies are woven, then broken.",
    genres: ["Mystery", "Drama"],
    rating: 4.1,
    totalEpisodes: 25,
    minutesPerEpisode: 1,
    isPro: false,
    poster: require("../../assets/images/poster-band-of-fate.webp"),
  },
  {
    ...base,
    id: "zweite-chance",
    title: "Zweite Chance",
    synopsis: "A new dawn, a new path.",
    genres: ["Drama", "Romance"],
    rating: 4.5,
    totalEpisodes: 55,
    minutesPerEpisode: 2,
    isPro: true,
    poster: require("../../assets/images/poster-second-chance.webp"),
  },
  {
    ...base,
    id: "forbidden-vows",
    title: "Forbidden Vows",
    synopsis: "A vow that should never have been made.",
    genres: ["Romance", "Drama"],
    rating: 4.4,
    totalEpisodes: 40,
    minutesPerEpisode: 2,
    isPro: false,
    poster: require("../../assets/images/poster-forbidden-vows.webp"),
  },
  {
    ...base,
    id: "love-in-the-fast-lane",
    title: "Love in the Fast Lane",
    synopsis: "Neon nights, a stolen car and a risky romance.",
    genres: ["Romance", "Action"],
    rating: 4.3,
    totalEpisodes: 35,
    minutesPerEpisode: 2,
    isPro: false,
    poster: require("../../assets/images/poster-love-in-the-fast-lane.webp"),
  },
  {
    ...base,
    id: "the-heirs-dilemma",
    title: "The Heir's Dilemma",
    synopsis: "A hidden fortune and a house full of secrets.",
    genres: ["Mystery", "Drama"],
    rating: 4.2,
    totalEpisodes: 38,
    minutesPerEpisode: 2,
    isPro: false,
    poster: require("../../assets/images/poster-the-heirs-dilemma.webp"),
  },
];

// Home screen rails, in display order
export const homeRails = [
  { key: "trendingRomance", seriesIds: ["der-ceo-und-ich", "mein-geheimes-leben", "liebe-auf-umwegen"] },
  { key: "forbiddenLove", seriesIds: ["blutige-rosen", "schattenkuss", "dunkle-begierde"] },
  { key: "mostWatched", seriesIds: ["racheengel", "schicksalsband", "zweite-chance"] },
] as const;

export const heroSeriesId = "verbotene-liebe";
export const alsoLikeSeriesIds = ["forbidden-vows", "love-in-the-fast-lane", "the-heirs-dilemma"];

export function getSeries(id: string): Series {
  const found = series.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown series: ${id}`);
  return found;
}
