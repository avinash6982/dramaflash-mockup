// Web spike: one video and one bottom sheet. Temporary, replaced by the real Home screen.
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { setLanguage } from "@/i18n";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const videoSource =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// Minimum gap under the sheet content; on web and on phones without a home indicator the inset is 0
const MIN_BOTTOM_PADDING = 16;

export default function Index() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const sheetRef = useRef<BottomSheetModal>(null);

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = true; // browsers only allow autoplay when muted
  });
  const { status } = useEvent(player, "statusChange", { status: player.status });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // On web the player is not ready inside the setup callback, so start it once it is
  useEffect(() => {
    if (status === "readyToPlay") player.play();
  }, [status, player]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  );

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
        contentFit="cover"
        playsInline
      />
      <Text style={styles.status}>{isPlaying ? "Playing" : "Paused"}</Text>
      <Text style={styles.title}>{t("home.watchNow")}</Text>
      <Pressable
        style={styles.button}
        onPress={() => setLanguage(i18n.language === "en" ? "de" : "en")}
      >
        <Text style={styles.buttonText}>{i18n.language.toUpperCase()}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => sheetRef.current?.present()}>
        <Text style={styles.buttonText}>Open sheet</Text>
      </Pressable>

      <BottomSheetModal ref={sheetRef} backdropComponent={renderBackdrop}>
        <BottomSheetView
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING) },
          ]}
        >
          <Text style={styles.sheetText}>Hello from the sheet</Text>
          <Pressable style={styles.button} onPress={() => sheetRef.current?.dismiss()}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  video: { width: 270, height: 480 },
  status: { fontSize: 16, color: colors.textPrimary, fontFamily: fonts.body },
  title: { fontSize: 28, color: colors.textPrimary, fontFamily: fonts.display },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  buttonText: { color: colors.onPrimary, fontFamily: fonts.bodySemiBold },
  sheet: { alignItems: "center", gap: 16, paddingTop: 16 },
  sheetText: { fontSize: 18 },
});
