import { Ionicons } from "@expo/vector-icons";
import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { durationToSeconds } from "@/data/series";
import type { Episode } from "@/data/series";
import { colors } from "@/theme/colors";

import { EpisodeProgress } from "./EpisodeProgress";

type Props = {
  episode: Episode;
  active: boolean;
  onEnded: () => void;
};

// The short clip loops for the whole listed episode length. "elapsed" is the time in the episode;
// "lastClipTime" is where the clip was at the last update, to notice when the clip wraps around.
type Timeline = { elapsed: number; lastClipTime: number };
const START: Timeline = { elapsed: 0, lastClipTime: 0 };

// While dragging, the picture follows the finger this often (seeking on every move would flood the player)
const PREVIEW_INTERVAL_MS = 100;

// Seconds the episode moved since the last update, even when the clip just looped back to its start
function advance(timeline: Timeline, clipTime: number, clipLength: number): Timeline {
  let delta = clipTime - timeline.lastClipTime;
  if (delta < 0) delta += clipLength;
  if (delta > 1) delta = 0; // a seek, not playback
  return { elapsed: timeline.elapsed + delta, lastClipTime: clipTime };
}

// One playable episode. Only the active page plays; the others stay paused at the start.
export function EpisodeVideo({ episode, active, onEnded }: Props) {
  const total = durationToSeconds(episode.duration);
  const player = useVideoPlayer(episode.video, (p) => {
    p.loop = true; // the clip repeats until the episode length is reached
    p.muted = true; // browsers only autoplay muted video; the mock-up clips are silent anyway
    p.timeUpdateEventInterval = 0.05; // seconds between progress updates
  });
  const { status } = useEvent(player, "statusChange", { status: player.status });
  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

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

  // Keep the player in step with the rule above. It compares with what the player reports
  // (isPlaying comes from its events, so this runs again whenever it changes), which makes it heal
  // itself: a play() that was interrupted by a quick pause during a seek is simply asked again.
  useEffect(() => {
    if (shouldPlay && !isPlaying) player.play();
    else if (!shouldPlay && isPlaying) player.pause();
  }, [shouldPlay, isPlaying, player]);

  // play() inside the setup callback does not start playback on web, hence the effect above.
  useEffect(() => {
    if (!active) player.seekBy(-player.currentTime);
  }, [active, player]);

  // The drag handlers below never change between renders (see EpisodeProgress), so they read the
  // newest values through refs. The position being dragged to lives in scrubRef.
  const scrubRef = useRef<number | null>(null);
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  });

  const handleScrub = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return;
    scrubRef.current = seconds;
    setScrubTime(seconds);
  }, []);

  const handleScrubEnd = useCallback(() => {
    const seconds = scrubRef.current;
    scrubRef.current = null;
    setScrubTime(null); // always leave the dragging state, whatever else happened
    if (seconds === null) return; // nothing was being dragged
    const clipLength = player.duration || 1;
    player.seekBy((seconds % clipLength) - player.currentTime);
    setTimeline({ elapsed: seconds, lastClipTime: seconds % clipLength });
    if (seconds >= total - 0.1) onEndedRef.current(); // dragged to the very end: same as finishing
  }, [player, total]);

  // Live preview while the finger moves: show the frame for that moment, at a steady pace
  useEffect(() => {
    if (!scrubbing) return;
    const timer = setInterval(() => {
      const seconds = scrubRef.current;
      if (seconds !== null) player.seekBy((seconds % (player.duration || 1)) - player.currentTime);
    }, PREVIEW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [scrubbing, player]);

  useEventListener(player, "timeUpdate", (event) => {
    if (!active || scrubbing) return;
    const next = advance(timeline, event.currentTime, player.duration || 1);
    setTimeline(next);
    if (next.elapsed >= total && !ended) onEnded();
  });

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
      {active && (
        <EpisodeProgress
          total={total}
          current={scrubTime ?? timeline.elapsed}
          scrubbing={scrubbing}
          onScrub={handleScrub}
          onScrubEnd={handleScrubEnd}
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
