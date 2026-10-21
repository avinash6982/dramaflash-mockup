import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatNumber } from "@/i18n/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { claimReward } from "@/store/rewardsSlice";
import { colors } from "@/theme/colors";
import { pressedStyle } from "@/theme/interaction";
import { fonts } from "@/theme/typography";

import { AppBottomSheet } from "./AppBottomSheet";
import { RewardCard } from "./RewardCard";

// The picked card turns first; the other two follow a moment later, one after the other
const OTHERS_DELAY_MS = 650;

type Props = { onDone: () => void }; // the sheet closed, however it was closed

// Shown when an episode that was really watched ends: three gold face-down cards, flip one to take its
// coin bonus (see RewardCard for the animation). Every card holds a bonus, and they are listed in the
// text, so there is no losing card.
export function RewardSheet({ onDone }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const sheetRef = useRef<BottomSheetModal>(null);
  const openRequest = useAppSelector((state) => state.rewards.rewardSheetRequest);
  const offer = useAppSelector((state) => state.rewards.offer);
  const [picked, setPicked] = useState<number | null>(null); // the card that was flipped

  const flip = (cardIndex: number) => {
    if (!offer || picked !== null) return;
    setPicked(cardIndex);
    dispatch(claimReward({ episodeId: offer.episodeId, coins: offer.bonuses[cardIndex] }));
  };

  const close = () => sheetRef.current?.dismiss();
  const handleDismissed = () => {
    setPicked(null); // fresh cards next time
    onDone();
  };

  return (
    <AppBottomSheet sheetRef={sheetRef} openRequest={openRequest} onDismiss={handleDismissed}>
      <View style={styles.content}>
        <View style={styles.token}>
          <Ionicons name="flame" size={28} color={colors.lockCoin} />
        </View>
        <Text style={styles.title}>{t("reward.title")}</Text>
        <Text style={styles.subtitle}>
          {picked === null
            ? t("reward.subtitle")
            : t("reward.claimed", { amount: offer?.bonuses[picked] ?? 0 })}
        </Text>

        <View style={styles.cards}>
          {(offer?.bonuses ?? [0, 0, 0]).map((bonus, index) => (
            <RewardCard
              key={index}
              index={index}
              bonusLabel={t("reward.bonus", { amount: formatNumber(bonus, i18n.language) })}
              revealed={picked !== null} // one flip shows what all three held
              chosen={picked === index}
              revealDelay={picked === index ? 0 : OTHERS_DELAY_MS + index * 140}
              accessibilityLabel={t("reward.flip", { number: index + 1 })}
              onPress={() => flip(index)}
            />
          ))}
        </View>

        <Text style={styles.odds}>{t("reward.odds")}</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && pressedStyle]}
          onPress={close}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {picked === null ? t("reward.skip") : t("reward.next")}
          </Text>
        </Pressable>
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
  },
  token: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: colors.surfaceRaised,
  },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: colors.textMuted,
  },
  cards: { flexDirection: "row", gap: 12, marginTop: 14, marginBottom: 4, alignSelf: "stretch" },
  odds: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 12,
    textAlign: "center",
    color: colors.textMuted,
  },
  button: {
    alignSelf: "stretch",
    height: 52,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: colors.primary,
  },
  buttonText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.onPrimary },
});
