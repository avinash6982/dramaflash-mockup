import type { en } from "./en";

// Same keys as en.ts; TypeScript flags a missing or extra key.
export const de: typeof en = {
  tabs: {
    home: "Start",
    discover: "Entdecken",
    romance: "Romantik",
    library: "Bibliothek",
    profile: "Profil",
  },
  common: {
    comingSoon: "Demnächst",
  },
  series: {
    playEpisode: "Folge {{number}} ansehen",
    synopsis: "Handlung",
    whyYoullLoveIt: "Darum wirst du sie lieben",
    castAndCrew: "Besetzung",
    episodes: "Episoden",
    unlockFullSeason: "Ganze Staffel freischalten",
    saveWithBundle: "40 % sparen mit dem Paket",
    unlock: "Freischalten",
    youMightAlsoLike: "Das könnte dir auch gefallen",
    back: "Zurück",
    share: "Teilen",
    addToFavourites: "Zu Favoriten hinzufügen",
  },
  home: {
    watchNow: "Jetzt ansehen",
    seeAll: "Alle ansehen",
    trendingRomance: "Beliebte Romanzen",
    forbiddenLove: "Verbotene Liebe",
    popularMicroDramas: "Beliebte Mikrodramen",
    mostWatched: "Meistgesehen",
    all: "Alle",
    spotlight: "Spotlight",
    epsShort: "{{count}} Folgen",
    minPerEp: "{{count}} Min.",
    romance: "Romantik",
    noResults: "Noch nichts in diesem Genre",
    episodes: "{{count}} Episoden",
  },
};
