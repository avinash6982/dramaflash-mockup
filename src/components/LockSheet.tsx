import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";

import { useAppSelector } from "@/store/hooks";

import { AppBottomSheet } from "./AppBottomSheet";
import { RechargeFooter } from "./RechargeFooter";
import { RechargeStep } from "./RechargeStep";
import { UnlockChoiceStep } from "./UnlockChoiceStep";

type Step = "choose" | "recharge";

// The one sheet for unlocking. It opens when the user taps the lock card and has two steps that swap
// inside the same sheet (no closing and reopening): choose what to unlock, and, if the coins are not
// enough, buy a pack or take the membership. Unlocking closes it and the episode starts playing.
export function LockSheet() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [step, setStep] = useState<Step>("choose");
  const [chosenPackId, setChosenPackId] = useState<string | null>(null); // null: the recommended pack
  const openRequest = useAppSelector((state) => state.player.lockSheetRequest);

  const close = () => sheetRef.current?.dismiss();
  const reset = () => {
    setStep("choose"); // always start from the choice next time
    setChosenPackId(null);
  };

  return (
    <AppBottomSheet
      sheetRef={sheetRef}
      openRequest={openRequest}
      onDismiss={reset}
      scrollable
      footer={
        step === "recharge" ? (
          <RechargeFooter chosenPackId={chosenPackId} onUnlocked={close} />
        ) : undefined
      }
    >
      {step === "choose" ? (
        <UnlockChoiceStep
          onUnlocked={close}
          onNeedCoins={() => setStep("recharge")}
          onMaybeLater={close}
        />
      ) : (
        <RechargeStep
          chosenPackId={chosenPackId}
          onChoosePack={setChosenPackId}
          onBack={() => setStep("choose")}
          onUnlocked={close}
        />
      )}
    </AppBottomSheet>
  );
}
