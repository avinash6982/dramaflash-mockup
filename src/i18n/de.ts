import type { en } from "./en";

// Same keys as en.ts; TypeScript flags a missing or extra key.
export const de: typeof en = {
  tabs: {
    home: "Start",
    discover: "Entdecken",
    favourites: "Favoriten",
    library: "Bibliothek",
    profile: "Profil",
  },
  common: {
    notFoundTitle: "Seite nicht gefunden",
    goHome: "Zur Startseite",
    comingSoon: "Demnächst",
  },
  series: {
    playEpisode: "Folge {{number}} ansehen",
    synopsis: "Handlung",
    whyYoullLoveIt: "Warum du sie lieben wirst",
    castAndCrew: "Besetzung & Team",
    episodes: "Folgen",
    unlockFullSeason: "Alle Folgen freischalten",
    saveWithBundle: "40 % sparen mit dem Paket",
    unlock: "Freischalten",
    youMightAlsoLike: "Das könnte dir auch gefallen",
    back: "Zurück",
    share: "Teilen",
    addToFavourites: "Zu Favoriten hinzufügen",
  },
  genres: {
    romance: "Romantik",
    drama: "Drama",
    billionaire: "Milliardär",
    secretIdentity: "Geheime Identität",
    thriller: "Thriller",
    fantasy: "Fantasy",
    forbiddenLove: "Verbotene Liebe",
    action: "Action",
    mystery: "Mystery",
  },
  home: {
    watchNow: "Jetzt ansehen",
    seeAll: "Alle anzeigen",
    trendingRomance: "Angesagte Romanzen",
    forbiddenLove: "Verbotene Liebe",
    popularMicroDramas: "Beliebte Kurzdramen",
    mostWatched: "Meistgesehen",
    all: "Alle",
    spotlight: "Im Fokus",
    epsShort: "{{count}} Folgen",
    // keep short: a longer text such as "Min./Folge" wraps onto two lines on the 128 px poster card
    minPerEp: "{{count}} Min.",
    romance: "Romantik",
    noResults: "In diesem Genre gibt es noch nichts.",
    episodes: "{{count}} Folgen",
  },
};
