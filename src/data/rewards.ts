// Streak Token rules. A token is earned by really watching an episode, not by dragging the bar.

// The share of the episode that has to be really watched (seconds that actually played)
export const WATCH_SHARE_FOR_TOKEN = 0.8;

// DEMO SHORTCUT: 80% of a 3 minute episode is 2.5 minutes of waiting, which is too long to show the
// feature. Real playback is still required, just at most this many seconds. A real product would
// not have this cap, and would count the watched time on the server from player events.
export const DEMO_MAX_WATCH_SECONDS = 20;

// The coin bonuses on the three cards. Every card holds one, so there is no losing card, and the
// sheet shows them up front. Small on purpose: two rewards cannot pay for a 85 coin episode.
export const CARD_BONUSES = [5, 10, 20] as const;

export function watchSecondsNeeded(episodeSeconds: number): number {
  return Math.min(episodeSeconds * WATCH_SHARE_FOR_TOKEN, DEMO_MAX_WATCH_SECONDS);
}

export function isTokenEarned(watchedSeconds: number, episodeSeconds: number): boolean {
  return watchedSeconds >= watchSecondsNeeded(episodeSeconds);
}

// Only the free episodes before the cliffhanger offer a reward: the last free episode leads into the
// lock, and a free reward right before the paywall would work against it.
export function offersReward(episodeIndex: number, freeEpisodes: number): boolean {
  return episodeIndex < freeEpisodes - 1;
}

// The three bonuses in a random order (pass a random function so tests can control it)
export function shuffledBonuses(random: () => number = Math.random): number[] {
  const cards = [...CARD_BONUSES];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
