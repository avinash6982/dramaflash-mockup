export type UnlockedSummary = {
  seriesId: string;
  fullSeason: boolean; // the whole series is unlocked (bought, or unlocked with coins)
  episodes: number; // single episodes unlocked, when it is not the full season
};

// What the user has unlocked, per series, from the two lists the unlocks slice keeps
// (episode ids look like "seriesId:index", see getEpisodeId). Newest series first.
export function summarizeUnlocks(
  unlockedSeriesIds: string[],
  unlockedEpisodeIds: string[],
): UnlockedSummary[] {
  const counts = new Map<string, number>();
  for (const episodeId of unlockedEpisodeIds) {
    const seriesId = episodeId.slice(0, episodeId.lastIndexOf(":"));
    counts.set(seriesId, (counts.get(seriesId) ?? 0) + 1);
  }

  const ids = [...new Set([...unlockedSeriesIds, ...counts.keys()])];
  return ids
    .map((seriesId) => ({
      seriesId,
      fullSeason: unlockedSeriesIds.includes(seriesId),
      episodes: counts.get(seriesId) ?? 0,
    }))
    .reverse();
}
