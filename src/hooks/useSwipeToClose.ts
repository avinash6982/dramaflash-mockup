import { Gesture } from "react-native-gesture-handler";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Options = {
  enabled: boolean; // only on the first episode, and not while the progress bar is being dragged
  height: number; // screen height
  onClose: () => void;
};

const CLOSE_DISTANCE = 120; // dragged this far down, release closes
const CLOSE_VELOCITY = 900; // or flicked down this fast
const SLIDE_OUT_MS = 180;

// Pull the screen down to close it: the screen follows the finger, then either slides away and
// closes, or springs back. Dragging up does nothing here, so the feed scrolls as usual.
export function useSwipeToClose({ enabled, height, onClose }: Options) {
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(enabled)
    .activeOffsetY(15) // start only after a clear downward move
    .failOffsetY(-15) // an upward move first means "scroll", so give up
    .failOffsetX([-25, 25]) // sideways means the progress bar or nothing
    .onUpdate((event) => {
      translateY.value = Math.max(event.translationY, 0);
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_DISTANCE || event.velocityY > CLOSE_VELOCITY) {
        translateY.value = withTiming(height, { duration: SLIDE_OUT_MS });
        setTimeout(onClose, SLIDE_OUT_MS);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(translateY.value, [0, height || 1], [1, 0.5]),
  }));

  return { gesture, style };
}
