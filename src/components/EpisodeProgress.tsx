import { useEventListener } from "expo";
import type { VideoPlayer } from "expo-video";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useBottomInset } from "@/hooks/useBottomInset";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

type Props = {
  player: VideoPlayer;
  // Called with true while the finger is on the bar, so the feed can pause its vertical scrolling
  onScrubbingChange: (scrubbing: boolean) => void;
};

const TOUCH_HEIGHT = 28; // easy to hit, the visible line is much thinner
const THUMB_SIZE = 14;

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

// Progress line at the bottom of the video. Tap or drag to seek.
export function EpisodeProgress({ player, onScrubbingChange }: Props) {
  const bottomInset = useBottomInset();
  const [width, setWidth] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrubFraction, setScrubFraction] = useState<number | null>(null); // null: not scrubbing

  useEventListener(player, "timeUpdate", (event) => setCurrentTime(event.currentTime));

  const fractionAt = (x: number) => Math.min(Math.max(x / width, 0), 1);

  // The thumb follows the finger; the video seeks once, when the finger lifts.
  // Playback is left as it was (playing stays playing, paused stays paused).
  const scrub = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((event) => {
      onScrubbingChange(true);
      setScrubFraction(fractionAt(event.x));
    })
    .onUpdate((event) => setScrubFraction(fractionAt(event.x)))
    .onFinalize((event) => {
      if (player.duration > 0) {
        player.seekBy(fractionAt(event.x) * player.duration - player.currentTime);
      }
      setScrubFraction(null);
      onScrubbingChange(false);
    });

  const duration = player.duration;
  if (!(duration > 0)) return null; // not loaded yet

  const scrubbing = scrubFraction !== null;
  const fraction = scrubFraction ?? Math.min(currentTime / duration, 1);

  return (
    <GestureDetector gesture={scrub}>
      <View
        style={[styles.touchArea, { bottom: Math.max(bottomInset - 12, 4) }]}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: Math.round(duration), now: Math.round(fraction * duration) }}
      >
        {scrubbing && (
          <Text style={styles.time}>
            {formatTime(fraction * duration)} / {formatTime(duration)}
          </Text>
        )}
        <View style={[styles.track, scrubbing && styles.trackActive]}>
          <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
        </View>
        {scrubbing && <View style={[styles.thumb, { left: `${fraction * 100}%` }]} />}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    position: "absolute",
    left: 20,
    right: 20,
    height: TOUCH_HEIGHT,
    justifyContent: "center",
  },
  track: { height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.3)", overflow: "hidden" },
  trackActive: { height: 6, borderRadius: 3 },
  fill: { height: "100%", backgroundColor: colors.primary },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -THUMB_SIZE / 2,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.primary,
  },
  time: {
    position: "absolute",
    top: -22,
    alignSelf: "center",
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
});
