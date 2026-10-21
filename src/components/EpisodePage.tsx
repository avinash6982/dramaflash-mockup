import { StyleSheet, View } from "react-native";

import type { Series } from "@/data/series";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openLockSheet } from "@/store/playerSlice";
import { isEpisodeLocked } from "@/store/unlocksSlice";
import { colors } from "@/theme/colors";

import { EpisodeOverlay } from "./EpisodeOverlay";
import { EpisodeVideo } from "./EpisodeVideo";
import { LockedEpisode } from "./LockedEpisode";

type Props = {
  series: Series;
  index: number;
  height: number; // one page is exactly one screen tall
  active: boolean;
  onEnded: (watchedSeconds: number) => void;
};

// One full-screen page of the vertical feed: the video, or the lock card, plus the overlay
export function EpisodePage({ series, index, height, active, onEnded }: Props) {
  const dispatch = useAppDispatch();
  const locked = useAppSelector((state) => isEpisodeLocked(state, series.id, index));

  return (
    <View style={[styles.page, { height }]}>
      {locked ? (
        <LockedEpisode series={series} index={index} onUnlock={() => dispatch(openLockSheet())} />
      ) : (
        <EpisodeVideo episode={series.episodes[index]} active={active} onEnded={onEnded} />
      )}
      <EpisodeOverlay series={series} index={index} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, overflow: "hidden" },
});
