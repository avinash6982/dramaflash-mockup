import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useBottomInset } from "@/hooks/useBottomInset";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

type Props = {
  total: number; // episode length in seconds
  current: number; // seconds shown by the bar
  scrubbing: boolean;
  onScrub: (seconds: number) => void; // finger down or moving
  onScrubEnd: () => void; // finger lifted, or the touch was taken away
};

const TOUCH_HEIGHT = 28; // easy to hit, the visible line is much thinner
const THUMB_SIZE = 14;
// Gap between the bottom inset and the bar, so it does not sit on the screen edge
export const PROGRESS_BAR_LIFT = 8;
export const PROGRESS_BAR_SPACE = TOUCH_HEIGHT + PROGRESS_BAR_LIFT;

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

// Progress line near the bottom of the video. Tap or drag to seek. It only reports positions;
// the video decides what to do with them.
//
// The bar sits inside a vertical list. A gesture that starts on the bar must win over the list's
// scroll, or on Android a little upward drift of the finger turns the drag into a swipe to another
// episode. That works because the list is the gesture-handler FlatList (see the watch screen), so the
// two negotiate: the bar's Pan activates on the first move, which cancels the scroll.
// The gesture is built once (useMemo) and the callbacks it gets never change between renders: a
// gesture rebuilt in the middle of a drag can be dropped by the phone.
export function EpisodeProgress({ total, current, scrubbing, onScrub, onScrubEnd }: Props) {
  const bottomInset = useBottomInset();
  const [width, setWidth] = useState(1);

  const scrub = useMemo(() => {
    const secondsAt = (x: number) => Math.min(Math.max(x / width, 0), 1) * total;
    return Gesture.Pan()
      .runOnJS(true)
      .minDistance(0) // starts on the first move, before the list's scroll can
      .shouldCancelWhenOutside(false) // keep dragging when the finger leaves the bar sideways or up
      .onBegin((event) => onScrub(secondsAt(event.x)))
      .onUpdate((event) => onScrub(secondsAt(event.x)))
      .onFinalize(() => onScrubEnd());
  }, [width, total, onScrub, onScrubEnd]);

  const fraction = Math.min(current / total, 1);

  return (
    <GestureDetector gesture={scrub}>
      <View
        style={[styles.touchArea, { bottom: bottomInset + PROGRESS_BAR_LIFT }]}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        aria-valuemin={0}
        aria-valuemax={Math.round(total)}
        aria-valuenow={Math.round(current)}
      >
        {scrubbing && (
          <Text style={styles.time} pointerEvents="none">
            {formatTime(current)} / {formatTime(total)}
          </Text>
        )}
        <View style={[styles.track, scrubbing && styles.trackActive]} pointerEvents="none">
          <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
        </View>
        {scrubbing && (
          <View style={[styles.thumb, { left: `${fraction * 100}%` }]} pointerEvents="none" />
        )}
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
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
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
