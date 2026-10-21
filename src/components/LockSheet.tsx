import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";

import { EPISODE_UNLOCK_COST, SEASON_UNLOCK_COST } from "@/data/coinPacks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUnlockChoice } from "@/store/playerSlice";

import { AppBottomSheet } from "./AppBottomSheet";
import { RechargeStep } from "./RechargeStep";
import { UnlockChoiceStep } from "./UnlockChoiceStep";
import { UnlockConfirmStep } from "./UnlockConfirmStep";

type Step = "choose" | "recharge" | "confirm";

// The one sheet for unlocking. It opens when the user taps the lock card and has three steps that swap
// inside the same sheet (no closing and reopening): choose what to unlock; buy coins if they are not
// enough (or take the membership); and a last confirmation before anything is spent. Unlocking closes
// it and the episode starts playing.
export function LockSheet() {
  const dispatch = useAppDispatch();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [step, setStep] = useState<Step>("choose");
  const [confirmBack, setConfirmBack] = useState<Step>("choose"); // where Back on the confirm step goes
  const [chosenPackId, setChosenPackId] = useState<string | null>(null); // null: the recommended pack
  const openRequest = useAppSelector((state) => state.player.lockSheetRequest);
  const unlockChoice = useAppSelector((state) => state.player.unlockChoice);
  const coins = useAppSelector((state) => state.wallet.coins);

  const close = () => sheetRef.current?.dismiss();
  const reset = () => {
    setStep("choose"); // always start from the choice next time
    setChosenPackId(null);
  };

  // Unlock Now: premium and coin unlocks that the balance covers ask for confirmation first;
  // too few coins go to the recharge step (nothing is spent there until its own Buy button)
  const onContinue = () => {
    const price = unlockChoice === "season" ? SEASON_UNLOCK_COST : EPISODE_UNLOCK_COST;
    if (unlockChoice === "premium" || coins >= price) {
      setConfirmBack("choose");
      setStep("confirm");
    } else {
      setStep("recharge");
    }
  };

  // The membership card on the recharge step: same confirmation, Back returns to the recharge step
  const onChooseMembership = () => {
    dispatch(setUnlockChoice("premium"));
    setConfirmBack("recharge");
    setStep("confirm");
  };

  return (
    <AppBottomSheet sheetRef={sheetRef} openRequest={openRequest} onDismiss={reset} scrollable>
      {step === "choose" && <UnlockChoiceStep onContinue={onContinue} onMaybeLater={close} />}
      {step === "recharge" && (
        <RechargeStep
          chosenPackId={chosenPackId}
          onChoosePack={setChosenPackId}
          onChooseMembership={onChooseMembership}
          onBack={() => setStep("choose")}
          onUnlocked={close}
        />
      )}
      {step === "confirm" && (
        <UnlockConfirmStep
          onBack={() => setStep(confirmBack)}
          onUnlocked={close}
          onNeedCoins={() => setStep("recharge")}
        />
      )}
    </AppBottomSheet>
  );
}
