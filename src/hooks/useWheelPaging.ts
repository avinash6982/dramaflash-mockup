import { useEffect, useRef } from "react";
import type { FlatList } from "react-native";
import { Platform } from "react-native";

type Options = {
  listRef: React.RefObject<FlatList | null>;
  activeIndex: number;
  itemCount: number;
  listMounted: boolean; // the list exists only after it has been measured, so look again then
};

// A pause this long in the wheel events means the user's scroll gesture is over
const GESTURE_GAP_MS = 150;

// Web only: one scroll gesture (a wheel notch or a whole trackpad swipe, including its momentum)
// moves the feed by exactly one page. Touch drags on phones are handled natively by the list.
export function useWheelPaging({ listRef, activeIndex, itemCount, listMounted }: Options) {
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (Platform.OS !== "web" || !listMounted) return;
    const node = listRef.current?.getScrollableNode() as HTMLElement | undefined;
    if (!node) return;

    let lastWheelAt = 0;
    let handledThisGesture = false;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault(); // the browser's own scrolling would skip pages
      const now = Date.now();
      if (now - lastWheelAt > GESTURE_GAP_MS) handledThisGesture = false;
      lastWheelAt = now;
      if (handledThisGesture || Math.abs(event.deltaY) < 4) return;

      handledThisGesture = true;
      const next = activeIndexRef.current + (event.deltaY > 0 ? 1 : -1);
      if (next >= 0 && next < itemCount)
        listRef.current?.scrollToIndex({ index: next, animated: true });
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [listRef, itemCount, listMounted]);
}
