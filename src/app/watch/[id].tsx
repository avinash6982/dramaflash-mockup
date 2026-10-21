import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { LayoutChangeEvent, ViewToken } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EpisodePage } from "@/components/EpisodePage";
import { LockSheet } from "@/components/LockSheet";
import { SwipeHint } from "@/components/SwipeHint";
import { clampEpisodeIndex, findSeries } from "@/data/series";
import type { Series } from "@/data/series";
import { useGoBack } from "@/hooks/useGoBack";
import { useWheelPaging } from "@/hooks/useWheelPaging";
import { useAppDispatch } from "@/store/hooks";
import { setEpisode } from "@/store/playerSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";

// A page counts as the active one once at least 80% of it is on screen
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 80 };

export default function WatchScreen() {
  const { id, episode } = useLocalSearchParams<{ id: string; episode?: string }>();
  const series = findSeries(id);

  // Unknown or missing id (bad link): show nothing instead of crashing
  if (!series) return null;
  return <Feed series={series} startIndex={clampEpisodeIndex(episode, series.episodes.length)} />;
}

function Feed({ series, startIndex }: { series: Series; startIndex: number }) {
  const dispatch = useAppDispatch();
  const goBack = useGoBack();
  const insets = useSafeAreaInsets();
  // One page is exactly as tall as the list itself. The window height is not the same on phones with
  // system bars (edge-to-edge), and a page that is too short lets the next episode peek in at the bottom.
  const [height, setHeight] = useState(0);
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [swiped, setSwiped] = useState(false); // the "swipe up" cue goes away after the first swipe

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index == null) return;
      setActiveIndex(first.index);
      if (first.index !== startIndex) setSwiped(true);
    },
    [startIndex],
  );

  // Keep the player slice in step with the page on screen. The lock sheet opens when the user taps the
  // lock card, never by itself: an automatic pop-up fights swiping through locked episodes.
  useEffect(() => {
    dispatch(setEpisode({ seriesId: series.id, index: activeIndex }));
  }, [dispatch, series.id, activeIndex]);

  // web: one wheel or trackpad gesture moves exactly one episode
  useWheelPaging({
    listRef,
    activeIndex,
    itemCount: series.episodes.length,
    listMounted: height > 0,
  });

  const goToNext = (index: number) => {
    if (index + 1 < series.episodes.length) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  };

  return (
    <View
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height)}
    >
      {height > 0 && (
        <FlatList
          ref={listRef}
          data={series.episodes}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ index }) => (
            <EpisodePage
              series={series}
              index={index}
              height={height}
              active={index === activeIndex}
              onEnded={() => goToNext(index)}
            />
          )}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          disableIntervalMomentum // one swipe moves exactly one episode, however hard you flick
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          initialScrollIndex={startIndex}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY_CONFIG}
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
        />
      )}

      {height > 0 && series.episodes.length > 1 && <SwipeHint hidden={swiped} />}

      <LockSheet />

      <Pressable
        style={({ pressed }) => [styles.back, { top: insets.top + 8 }, pressed && pressedStyle]}
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: {
    position: "absolute",
    left: 20,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
