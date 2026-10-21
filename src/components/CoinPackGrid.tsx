import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { coinPacks } from "@/data/coinPacks";

import { CoinPackCard } from "./CoinPackCard";

const COLUMNS = 2;
const SIDE_PADDING = 20;
const GAP = 12;

type Props = { selectedId: string; onSelect: (packId: string) => void };

// The four coin packs, two per row, measured so the cards always fill the row
export function CoinPackGrid({ selectedId, onSelect }: Props) {
  const [width, setWidth] = useState(0);
  const cardWidth = Math.floor((width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <View style={styles.grid}>
          {coinPacks.map((pack) => (
            <CoinPackCard
              key={pack.id}
              pack={pack}
              width={cardWidth}
              selected={pack.id === selectedId}
              onPress={() => onSelect(pack.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP, paddingHorizontal: SIDE_PADDING },
});
