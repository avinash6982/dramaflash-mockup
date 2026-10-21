import type { ImageSourcePropType } from "react-native";

import type { LocalizedText } from "@/i18n/localized";

// Ids of the genre labels in the i18n files (genres.<id>)
export type GenreId =
  | "romance"
  | "drama"
  | "billionaire"
  | "secretIdentity"
  | "thriller"
  | "fantasy"
  | "forbiddenLove"
  | "action"
  | "mystery";

export type Episode = {
  title: LocalizedText;
  duration: string;
  thumb: ImageSourcePropType;
  videoUri: string;
};

export type CastMember = {
  name: string;
  character: string;
  role: LocalizedText;
  photo: ImageSourcePropType;
};

export type Series = {
  id: string;
  title: LocalizedText;
  synopsis: LocalizedText;
  genres: GenreId[];
  rating: number;
  ratingCount: string; // shown as "(12k)"
  year: number;
  totalEpisodes: number;
  minutesPerEpisode: number; // matches the episode durations below
  isPro: boolean;
  freeEpisodes: number; // episodes before the lock
  poster: ImageSourcePropType;
  highlights: LocalizedText[];
  cast: CastMember[]; // only The CEO's Secret Life has one in the design
  episodes: Episode[];
};

// Placeholder clip until the short vertical clips are added (task: vertical player)
const SAMPLE_CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const images = {
  veLiebe: require("../../assets/images/hero-echoes-of-eternity.webp"),
  ceosSecretLife: require("../../assets/images/hero-ceos-secret-life.webp"),
  ceoAndI: require("../../assets/images/poster-ceo-and-i.webp"),
  mySecretLife: require("../../assets/images/poster-my-secret-life.webp"),
  loveOnDetours: require("../../assets/images/poster-love-on-detours.webp"),
  bloodyRoses: require("../../assets/images/poster-bloody-roses.webp"),
  shadowKiss: require("../../assets/images/poster-shadow-kiss.webp"),
  darkDesire: require("../../assets/images/poster-dark-desire.webp"),
  avengingAngel: require("../../assets/images/poster-avenging-angel.webp"),
  bandOfFate: require("../../assets/images/poster-band-of-fate.webp"),
  secondChance: require("../../assets/images/poster-second-chance.webp"),
  forbiddenVows: require("../../assets/images/poster-forbidden-vows.webp"),
  fastLane: require("../../assets/images/poster-love-in-the-fast-lane.webp"),
  heirsDilemma: require("../../assets/images/poster-the-heirs-dilemma.webp"),
};

// The design only has real episodes for The CEO's Secret Life (with its placeholder dragon art)
const ceoEpisodes: Episode[] = [
  { title: { en: "The Accidental Message", de: "Die falsch gesendete Nachricht" }, duration: "3:12", thumb: require("../../assets/images/ep-thumb-1.webp"), videoUri: SAMPLE_CLIP },
  { title: { en: "Coffee and Contracts", de: "Kaffee und Verträge" }, duration: "2:55", thumb: require("../../assets/images/ep-thumb-2.webp"), videoUri: SAMPLE_CLIP },
  { title: { en: "A Glimpse Behind the Mask", de: "Ein Blick hinter die Maske" }, duration: "3:30", thumb: require("../../assets/images/ep-thumb-3.webp"), videoUri: SAMPLE_CLIP },
  { title: { en: "The Gala Encounter", de: "Die Begegnung auf der Gala" }, duration: "4:05", thumb: require("../../assets/images/ep-thumb-4.webp"), videoUri: SAMPLE_CLIP },
  { title: { en: "Misunderstandings", de: "Missverständnisse" }, duration: "2:48", thumb: require("../../assets/images/ep-thumb-5-locked.webp"), videoUri: SAMPLE_CLIP },
  { title: { en: "Midnight Confessions", de: "Geständnisse um Mitternacht" }, duration: "3:15", thumb: require("../../assets/images/ep-thumb-6-locked.webp"), videoUri: SAMPLE_CLIP },
];

// Every other series gets plain "Episode N" rows with its own poster as thumbnail, and durations
// around its minutes per episode, so nothing on screen contradicts anything else.
const durationOffsetsInSeconds = [12, -5, 30, 65, -12, 15];

function plainEpisodes(poster: ImageSourcePropType, minutesPerEpisode: number): Episode[] {
  return durationOffsetsInSeconds.map((offset, index) => {
    const seconds = minutesPerEpisode * 60 + offset;
    const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    return {
      title: { en: `Episode ${index + 1}`, de: `Folge ${index + 1}` },
      duration,
      thumb: poster,
      videoUri: SAMPLE_CLIP,
    };
  });
}

const sharedHighlights: LocalizedText[] = [
  { en: "Intense chemistry from the very first frame.", de: "Es knistert ab der ersten Szene." },
  {
    en: "A gripping double-life narrative with high stakes.",
    de: "Ein fesselndes Doppelleben, bei dem alles auf dem Spiel steht.",
  },
];

const ceoCast: CastMember[] = [
  { name: "Elena Brooks", character: "Mia", role: { en: "Artist", de: "Künstlerin" }, photo: require("../../assets/images/cast-elena.webp") },
  { name: "Julian Vance", character: "Alexander", role: { en: "CEO", de: "CEO" }, photo: require("../../assets/images/cast-julian-vance.webp") },
  { name: "Sarah Lin", character: "Chloe", role: { en: "Best Friend", de: "Beste Freundin" }, photo: require("../../assets/images/cast-sarah-lin.webp") },
  { name: "Marcus Hale", character: "Daniel", role: { en: "Rival CEO", de: "Rivale" }, photo: require("../../assets/images/cast-marcus.webp") },
];

const base = { year: 2024, ratingCount: "12k", freeEpisodes: 3, highlights: sharedHighlights, cast: [] };

export const series: Series[] = [
  {
    ...base,
    id: "verbotene-liebe",
    title: { en: "Forbidden Love", de: "Verbotene Liebe" },
    synopsis: { en: "A CEO's dangerous secret contract.", de: "Der gefährliche Geheimvertrag eines CEOs." },
    genres: ["romance", "drama", "billionaire"],
    rating: 4.8,
    totalEpisodes: 72,
    minutesPerEpisode: 2,
    isPro: true,
    poster: images.veLiebe,
    episodes: plainEpisodes(images.veLiebe, 2),
  },
  {
    ...base,
    id: "ceos-secret-life",
    title: { en: "The CEO's Secret Life", de: "Das geheime Leben des CEOs" },
    synopsis: {
      en: "When a struggling artist accidentally discovers that the ruthless CEO of the city's largest conglomerate is actually her anonymous online confidant, her life is turned upside down. Can their digital romance survive the harsh reality of corporate espionage and forbidden love?",
      de: "Als eine mittellose Künstlerin zufällig entdeckt, dass der skrupellose CEO des größten Konzerns der Stadt in Wahrheit ihr anonymer Online-Vertrauter ist, steht ihr Leben Kopf. Kann ihre digitale Romanze die harte Realität von Wirtschaftsspionage und verbotener Liebe überstehen?",
    },
    genres: ["billionaire", "secretIdentity", "romance"],
    rating: 4.8,
    totalEpisodes: 45,
    minutesPerEpisode: 3,
    isPro: false,
    poster: images.ceosSecretLife,
    cast: ceoCast,
    episodes: ceoEpisodes,
  },
  {
    ...base,
    id: "der-ceo-und-ich",
    title: { en: "The CEO and I", de: "Der CEO und ich" },
    synopsis: { en: "A forbidden empire, a dangerous love.", de: "Ein verbotenes Imperium, eine gefährliche Liebe." },
    genres: ["romance", "billionaire"],
    rating: 4.6,
    totalEpisodes: 50,
    minutesPerEpisode: 2,
    isPro: true,
    poster: images.ceoAndI,
    episodes: plainEpisodes(images.ceoAndI, 2),
  },
  {
    ...base,
    id: "mein-geheimes-leben",
    title: { en: "My Secret Life", de: "Mein geheimes Leben" },
    synopsis: { en: "A thriller of masks and lies.", de: "Ein Thriller über Masken und Lügen." },
    genres: ["thriller", "drama"],
    rating: 4.4,
    totalEpisodes: 30,
    minutesPerEpisode: 1,
    isPro: false,
    poster: images.mySecretLife,
    episodes: plainEpisodes(images.mySecretLife, 1),
  },
  {
    ...base,
    id: "liebe-auf-umwegen",
    title: { en: "Love on Detours", de: "Liebe auf Umwegen" },
    synopsis: { en: "Two paths, one fate, and time running out.", de: "Zwei Wege, ein Schicksal, und die Zeit läuft ab." },
    genres: ["romance", "fantasy"],
    rating: 4.5,
    totalEpisodes: 65,
    minutesPerEpisode: 2,
    isPro: true,
    poster: images.loveOnDetours,
    episodes: plainEpisodes(images.loveOnDetours, 2),
  },
  {
    ...base,
    id: "blutige-rosen",
    title: { en: "Bloody Roses", de: "Blutige Rosen" },
    synopsis: { en: "A love that leaves its mark.", de: "Eine Liebe, die Spuren hinterlässt." },
    genres: ["forbiddenLove", "drama"],
    rating: 4.3,
    totalEpisodes: 80,
    minutesPerEpisode: 2,
    isPro: true,
    poster: images.bloodyRoses,
    episodes: plainEpisodes(images.bloodyRoses, 2),
  },
  {
    ...base,
    id: "schattenkuss",
    title: { en: "Shadow Kiss", de: "Schattenkuss" },
    synopsis: {
      en: "A forbidden love story that defies the darkness.",
      de: "Eine verbotene Liebesgeschichte, die der Dunkelheit trotzt.",
    },
    genres: ["forbiddenLove", "romance"],
    rating: 4.7,
    totalEpisodes: 45,
    minutesPerEpisode: 2,
    isPro: false,
    poster: images.shadowKiss,
    episodes: plainEpisodes(images.shadowKiss, 2),
  },
  {
    ...base,
    id: "dunkle-begierde",
    title: { en: "Dark Desire", de: "Dunkles Verlangen" },
    synopsis: { en: "A thriller of consuming passion.", de: "Ein Thriller über verzehrende Leidenschaft." },
    genres: ["forbiddenLove", "thriller"],
    rating: 4.2,
    totalEpisodes: 60,
    minutesPerEpisode: 2,
    isPro: true,
    poster: images.darkDesire,
    episodes: plainEpisodes(images.darkDesire, 2),
  },
  {
    ...base,
    id: "racheengel",
    title: { en: "Avenging Angel", de: "Racheengel" },
    synopsis: {
      en: "She fell to earth to settle a score.",
      de: "Sie stürzte auf die Erde, um eine alte Rechnung zu begleichen.",
    },
    genres: ["action", "fantasy"],
    rating: 4.6,
    totalEpisodes: 90,
    minutesPerEpisode: 3,
    isPro: true,
    poster: images.avengingAngel,
    episodes: plainEpisodes(images.avengingAngel, 3),
  },
  {
    ...base,
    id: "schicksalsband",
    title: { en: "Band of Fate", de: "Schicksalsband" },
    synopsis: {
      en: "Your destinies are woven, then broken.",
      de: "Schicksale werden verwoben und wieder zerrissen.",
    },
    genres: ["mystery", "drama"],
    rating: 4.1,
    totalEpisodes: 25,
    minutesPerEpisode: 1,
    isPro: false,
    poster: images.bandOfFate,
    episodes: plainEpisodes(images.bandOfFate, 1),
  },
  {
    ...base,
    id: "zweite-chance",
    title: { en: "Second Chance", de: "Eine zweite Chance" },
    synopsis: { en: "A new dawn, a new path.", de: "Ein neuer Morgen, ein neuer Weg." },
    genres: ["drama", "romance"],
    rating: 4.5,
    totalEpisodes: 55,
    minutesPerEpisode: 2,
    isPro: true,
    poster: images.secondChance,
    episodes: plainEpisodes(images.secondChance, 2),
  },
  {
    ...base,
    id: "forbidden-vows",
    title: { en: "Forbidden Vows", de: "Der verbotene Schwur" },
    synopsis: {
      en: "A vow that should never have been made.",
      de: "Ein Schwur, der nie hätte gegeben werden dürfen.",
    },
    genres: ["romance", "drama"],
    rating: 4.4,
    totalEpisodes: 40,
    minutesPerEpisode: 2,
    isPro: false,
    poster: images.forbiddenVows,
    episodes: plainEpisodes(images.forbiddenVows, 2),
  },
  {
    ...base,
    id: "love-in-the-fast-lane",
    title: { en: "Love in the Fast Lane", de: "Liebe auf der Überholspur" },
    synopsis: {
      en: "Neon nights, a stolen car and a risky romance.",
      de: "Neonnächte, ein gestohlener Wagen und eine riskante Romanze.",
    },
    genres: ["romance", "action"],
    rating: 4.3,
    totalEpisodes: 35,
    minutesPerEpisode: 2,
    isPro: false,
    poster: images.fastLane,
    episodes: plainEpisodes(images.fastLane, 2),
  },
  {
    ...base,
    id: "the-heirs-dilemma",
    title: { en: "The Heir's Dilemma", de: "Das Dilemma des Erben" },
    synopsis: {
      en: "A hidden fortune and a house full of secrets.",
      de: "Ein verborgenes Vermögen und ein Haus voller Geheimnisse.",
    },
    genres: ["mystery", "drama"],
    rating: 4.2,
    totalEpisodes: 38,
    minutesPerEpisode: 2,
    isPro: false,
    poster: images.heirsDilemma,
    episodes: plainEpisodes(images.heirsDilemma, 2),
  },
];

// Home screen layout, in display order: sections that hold rails of series
export const homeSections = [
  {
    key: "romance",
    rails: [
      { key: "trendingRomance", seriesIds: ["der-ceo-und-ich", "mein-geheimes-leben", "liebe-auf-umwegen"] },
      { key: "forbiddenLove", seriesIds: ["blutige-rosen", "schattenkuss", "dunkle-begierde"] },
    ],
  },
  {
    key: "popularMicroDramas",
    rails: [{ key: "mostWatched", seriesIds: ["racheengel", "schicksalsband", "zweite-chance"] }],
  },
] as const;

// Genre chips under the hero ("All" is added by the screen)
export const homeGenres: GenreId[] = ["romance", "drama", "action", "mystery"];

export const heroSeriesId = "verbotene-liebe";
export const alsoLikeSeriesIds = ["forbidden-vows", "love-in-the-fast-lane", "the-heirs-dilemma"];

// For route params, which can be missing or wrong (bad link, screen closing)
export function findSeries(id: string | undefined): Series | undefined {
  return series.find((s) => s.id === id);
}

// For code that only passes ids from this file's own data
export function getSeries(id: string): Series {
  const found = findSeries(id);
  if (!found) throw new Error(`Unknown series: ${id}`);
  return found;
}

// Episode index from a route param: a missing, non-numeric or out-of-range value falls back to the nearest valid one
export function clampEpisodeIndex(param: string | undefined, episodeCount: number): number {
  const index = Number(param);
  if (!Number.isInteger(index) || index < 0) return 0;
  return Math.min(index, Math.max(episodeCount - 1, 0));
}
