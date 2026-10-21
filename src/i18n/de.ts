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
  home: {
    watchNow: "Jetzt ansehen",
    seeAll: "Alle ansehen",
    trendingRomance: "Beliebte Romanzen",
    forbiddenLove: "Verbotene Liebe",
    popularMicroDramas: "Beliebte Mikrodramen",
    mostWatched: "Meistgesehen",
    episodes: "{{count}} Episoden",
  },
};
