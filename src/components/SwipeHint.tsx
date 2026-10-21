import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useBottomInset } from "@/hooks/useBottomInset";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

import { PROGRESS_BAR_SPACE } from "./EpisodeProgress";

const VISIBLE_MS = 6000;

// "There is a next episode": a small chevron that bounces for a few seconds on the first episode.
// The parent hides it as soon as the user swipes.
export function SwipeHint({ hidden }: { hidden: boolean }) {
  const { t } = useTranslation();
  const bottomInset = useBottomInset();
  const [expired, setExpired] = useState(false);
  const lift = useSharedValue(0);

  useEffect(() => {
    lift.value = withRepeat(
      withSequence(withTiming(-8, { duration: 500 }), withTiming(0, { duration: 500 })),
      -1,
    );
    const timer = setTimeout(() => setExpired(true), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [lift]);

  const bounce = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }] }));

  if (hidden || expired) return null;

  return (
    <Animated.View
      style={[styles.hint, { bottom: bottomInset + PROGRESS_BAR_SPACE + 90 }, bounce]}
      pointerEvents="none"
    >
      <Ionicons name="chevron-up" size={22} color={colors.textPrimary} />
      <Text style={styles.text}>{t("player.swipeUp")}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hint: { position: "absolute", alignSelf: "center", alignItems: "center" },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textPrimary },
});
