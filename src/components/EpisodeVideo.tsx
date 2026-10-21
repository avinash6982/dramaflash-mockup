import { Ionicons } from "@expo/vector-icons";
import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { Episode } from "@/data/series";
import { colors } from "@/theme/colors";

import { EpisodeProgress } from "./EpisodeProgress";

type Props = {
  episode: Episode;
  active: boolean;
  onEnded: () => void;
  onScrubbingChange: (scrubbing: boolean) => void;
};

// One playable episode. Only the active page plays; the others stay paused at the start.
export function EpisodeVideo({ episode, active, onEnded, onScrubbingChange }: Props) {
  const player = useVideoPlayer(episode.video, (p) => {
    p.loop = false;
    p.muted = true; // browsers only autoplay muted video; the mock-up clips are silent anyway
    p.timeUpdateEventInterval = 0.1; // seconds between progress updates
  });
  const { status } = useEvent(player, "statusChange", { status: player.status });
  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  // play() inside the setup callback does not start playback on web, so wait for readyToPlay
  useEffect(() => {
    if (active && status === "readyToPlay") {
      player.play();
    } else if (!active) {
      player.pause();
      player.seekBy(-player.currentTime); // swiping back to an episode starts it from the beginning
    }
  }, [active, status, player]);

  useEventListener(player, "playToEnd", () => {
    if (active) onEnded();
  });

  const togglePlayback = () => {
    if (isPlaying) {
      player.pause();
      return;
    }
    const atEnd = player.duration > 0 && player.currentTime >= player.duration - 0.1;
    if (atEnd) player.replay();
    else player.play();
  };

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
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
      >
        {active && status === "readyToPlay" && !isPlaying && (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={32} color={colors.textPrimary} />
          </View>
        )}
      </Pressable>
      {active && <EpisodeProgress player={player} onScrubbingChange={onScrubbingChange} />}
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
