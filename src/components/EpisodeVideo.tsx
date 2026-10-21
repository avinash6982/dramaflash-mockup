import { Ionicons } from "@expo/vector-icons";
import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { durationToSeconds } from "@/data/series";
import type { Episode } from "@/data/series";
import { colors } from "@/theme/colors";

import { EpisodeProgress } from "./EpisodeProgress";

type Props = {
  episode: Episode;
  active: boolean;
  onEnded: () => void;
  onScrubbingChange: (scrubbing: boolean) => void;
};

// The short clip loops for the whole listed episode length. "elapsed" is the time in the episode;
// "lastClipTime" is where the clip was at the last update, to notice when the clip wraps around.
type Timeline = { elapsed: number; lastClipTime: number };
const START: Timeline = { elapsed: 0, lastClipTime: 0 };

// Seconds the episode moved since the last update, even when the clip just looped back to its start
function advance(timeline: Timeline, clipTime: number, clipLength: number): Timeline {
  let delta = clipTime - timeline.lastClipTime;
  if (delta < 0) delta += clipLength;
  if (delta > 1) delta = 0; // a seek, not playback
  return { elapsed: timeline.elapsed + delta, lastClipTime: clipTime };
}

// One playable episode. Only the active page plays; the others stay paused at the start.
export function EpisodeVideo({ episode, active, onEnded, onScrubbingChange }: Props) {
  const total = durationToSeconds(episode.duration);
  const player = useVideoPlayer(episode.video, (p) => {
    p.loop = true; // the clip repeats until the episode length is reached
    p.muted = true; // browsers only autoplay muted video; the mock-up clips are silent anyway
    p.timeUpdateEventInterval = 0.05; // seconds between progress updates
  });
  const { status } = useEvent(player, "statusChange", { status: player.status });

  const [timeline, setTimeline] = useState<Timeline>(START);
  const [userPaused, setUserPaused] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null); // null: not scrubbing
  const [wasActive, setWasActive] = useState(active);

  // Leaving the page resets it, so swiping back starts the episode again (state adjusted while rendering)
  if (active !== wasActive) {
    setWasActive(active);
    if (!active) {
      setTimeline(START);
      setUserPaused(false);
      setScrubTime(null);
    }
  }

  const scrubbing = scrubTime !== null;
  const ended = timeline.elapsed >= total;
  const ready = status === "readyToPlay";
  // One rule decides playback: dragging, a tap-pause or the end of the episode all stop it
  const shouldPlay = active && ready && !userPaused && !scrubbing && !ended;

  useEffect(() => {
    // Always call, never compare with player.playing: that value lags behind a quick pause/play
    if (shouldPlay) player.play();
    else player.pause();
  }, [shouldPlay, player]);

  // play() inside the setup callback does not start playback on web, hence the effect above.
  useEffect(() => {
    if (!active) player.seekBy(-player.currentTime);
  }, [active, player]);

  useEffect(() => {
    onScrubbingChange(scrubbing);
  }, [scrubbing, onScrubbingChange]);

  const clipPosition = (seconds: number) => seconds % (player.duration || 1);

  // Live preview while the finger moves: show the frame for that moment
  useEffect(() => {
    if (scrubTime === null) return;
    const clipLength = player.duration || 1;
    player.seekBy((scrubTime % clipLength) - player.currentTime);
  }, [scrubTime, player]);

  useEventListener(player, "timeUpdate", (event) => {
    if (!active || scrubbing) return;
    const next = advance(timeline, event.currentTime, player.duration || 1);
    setTimeline(next);
    if (next.elapsed >= total && !ended) onEnded();
  });

  const finishScrub = (seconds: number) => {
    setTimeline({ elapsed: seconds, lastClipTime: clipPosition(seconds) });
    setScrubTime(null);
    if (seconds >= total - 0.1) onEnded(); // dragged to the very end: same as finishing
  };

  const togglePlayback = () => {
    if (ended) {
      player.seekBy(-player.currentTime);
      setTimeline(START);
      setUserPaused(false);
    } else {
      setUserPaused((paused) => !paused);
    }
  };

  const showPlayBadge = active && ready && !scrubbing && (userPaused || ended);

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        nativeControls={false}
        contentFit="cover"
        playsInline
      />
      <Pressable
        style={styles.tapArea}
        onPress={togglePlayback}
        accessibilityRole="button"
        accessibilityLabel={shouldPlay ? "Pause" : "Play"}
      >
        {showPlayBadge && (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={32} color={colors.textPrimary} />
          </View>
        )}
      </Pressable>
      {active && ready && (
        <EpisodeProgress
          total={total}
          current={scrubTime ?? timeline.elapsed}
          scrubbing={scrubbing}
          onScrub={setScrubTime}
          onScrubEnd={finishScrub}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tapArea: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  playBadge: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
