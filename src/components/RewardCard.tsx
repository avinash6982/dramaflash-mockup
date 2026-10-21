import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

const FLIP_MS = 520;
const GOLD = ["#FFF2B8", "#F5C542", "#B8860B", "#F5C542", "#FFE08A"] as const;
const GOLD_DARK = "#7A5200";

type Props = {
  bonusLabel: string; // "+10 Coins", shown on the face
  revealed: boolean; // flips to the face when it turns true, back to the gold side when it turns false
  chosen: boolean; // the card the user picked (it pops and glows)
  revealDelay: number; // ms to wait before flipping, so the picked card turns first and the others follow
  index: number; // 0 to 2, staggers the floating
  accessibilityLabel: string;
  onPress: () => void;
};

// One reward card. Face down it is gold art with a moving shine and a gentle float; flipping squeezes it
// edge-on and opens it as the face. All of it runs on the UI thread. It is not a 3D rotation, because
// those are unreliable on Android and web.
export function RewardCard({
  bonusLabel,
  revealed,
  chosen,
  revealDelay,
  index,
  accessibilityLabel,
  onPress,
}: Props) {
  const [width, setWidth] = useState(0);
  const flip = useSharedValue(0); // 0 gold side, 1 face
  const shine = useSharedValue(0);
  const float = useSharedValue(0);
  const pop = useSharedValue(1);

  // idle motion: the shine sweeps across every few seconds and the card floats up and down
  useEffect(() => {
    shine.set(
      withRepeat(
        withDelay(
          index * 500,
          withSequence(
            withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
            withDelay(1600, withTiming(0, { duration: 0 })),
          ),
        ),
        -1,
      ),
    );
    float.set(
      withDelay(
        index * 300,
        withRepeat(
          withSequence(
            withTiming(-4, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
        ),
      ),
    );
  }, [index, shine, float]);

  useEffect(() => {
    if (revealed) {
      flip.set(
        withDelay(
          revealDelay,
          withTiming(1, { duration: FLIP_MS, easing: Easing.out(Easing.cubic) }),
        ),
      );
      if (chosen)
        pop.set(
          withDelay(revealDelay + FLIP_MS / 2, withSpring(1.07, { damping: 8, stiffness: 160 })),
        );
    } else {
      flip.set(0);
      pop.set(1);
    }
  }, [revealed, chosen, revealDelay, flip, pop]);

  // the card narrows to a line at the middle of the flip, and the faces swap there
  const card = useAnimatedStyle(() => ({
    transform: [
      { translateY: revealed ? 0 : float.value },
      { scaleX: Math.abs(1 - 2 * flip.value) },
      { scale: pop.value },
    ],
  }));
  const back = useAnimatedStyle(() => ({ opacity: flip.value < 0.5 ? 1 : 0 }));
  const face = useAnimatedStyle(() => ({ opacity: flip.value < 0.5 ? 0 : 1 }));
  const sweep = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shine.value, [0, 1], [-width * 0.6, width * 1.2]) },
      { rotate: "20deg" },
    ],
    opacity: interpolate(shine.value, [0, 0.15, 0.85, 1], [0, 0.85, 0.85, 0]),
  }));

  return (
    <Pressable
      style={({ pressed }) => [styles.slot, pressed && !revealed && pressedStyle]}
      onPress={onPress}
      disabled={revealed}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[styles.card, chosen && styles.glow, card]}>
        <Animated.View style={[StyleSheet.absoluteFill, back]}>
          <LinearGradient
            colors={GOLD}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gold}
          >
            <View style={styles.frame} />
            <Ionicons name="diamond" size={11} color={GOLD_DARK} style={styles.cornerTop} />
            <Ionicons name="diamond" size={11} color={GOLD_DARK} style={styles.cornerBottom} />
            <View style={styles.emblem}>
              <Ionicons name="sparkles" size={34} color={GOLD_DARK} />
            </View>
            <Animated.View style={[styles.shine, sweep]} pointerEvents="none">
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.75)", "transparent"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, face]}>
          <LinearGradient
            colors={["#262445", "#14132A"]}
            style={[styles.face, chosen && styles.faceChosen]}
          >
            <Ionicons name="flash" size={26} color="#F5C542" />
            <Text style={[styles.bonus, chosen && styles.bonusChosen]}>{bonusLabel}</Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1, height: 150 },
  card: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#F5C542",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  glow: { shadowOpacity: 0.9, shadowRadius: 16, elevation: 12 },
  gold: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    ...StyleSheet.absoluteFill,
    margin: 7,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(122,82,0,0.55)",
  },
  cornerTop: { position: "absolute", top: 12, alignSelf: "center" },
  cornerBottom: { position: "absolute", bottom: 12, alignSelf: "center" },
  emblem: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: "rgba(122,82,0,0.6)",
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  shine: { position: "absolute", top: -20, bottom: -20, width: 46 },
  face: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(245,197,66,0.45)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  faceChosen: { borderColor: colors.primary },
  bonus: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textMuted },
  bonusChosen: { color: colors.textPrimary },
});
