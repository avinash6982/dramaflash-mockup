import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Series } from "@/data/series";

import { PosterCard } from "./PosterCard";

const COLUMNS = 2;
const SIDE_PADDING = 20;
const GAP = 14;

// Posters two to a row, measured so they always fill the row. Tapping one opens its series.
// It does not scroll itself: put it inside a ScrollView.
export function PosterGrid({ series }: { series: Series[] }) {
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const cardWidth = Math.floor((width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <View style={styles.grid}>
          {series.map((item) => (
            <PosterCard
              key={item.id}
              series={item}
              width={cardWidth}
              onPress={() => router.push({ pathname: "/series/[id]", params: { id: item.id } })}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    rowGap: 20,
    paddingHorizontal: SIDE_PADDING,
  },
});
