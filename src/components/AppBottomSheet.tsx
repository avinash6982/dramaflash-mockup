import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

import { useBottomInset } from "@/hooks/useBottomInset";
import { colors } from "@/theme/colors";

type Props = {
  sheetRef: React.RefObject<BottomSheetModal | null>; // the owner closes it with sheetRef.current?.dismiss()
  openRequest: number; // the sheet opens whenever this number goes up (0 means never asked)
  onDismiss?: () => void; // after it closed, however it was closed
  scrollable?: boolean; // tall content scrolls inside the sheet
  children: React.ReactNode;
};

const MAX_HEIGHT_SHARE = 0.92;

// The one bottom sheet every sheet in the app uses: dark surface, dim backdrop that closes it, sized to
// its content, with the bottom spacing rule built in (see useBottomInset). Buttons are part of the
// content, at its end, in every sheet: they move with the sheet when it is dragged. There is no
// separate footer.
export function AppBottomSheet({
  sheetRef,
  openRequest,
  onDismiss,
  scrollable = false,
  children,
}: Props) {
  const bottomInset = useBottomInset();
  const { height } = useWindowDimensions();

  // Every new request presents the sheet again. Nothing here calls dismiss(): a dismiss() before the
  // first present() makes gorhom ignore that present(), and a flag could disagree with the real sheet.
  useEffect(() => {
    if (openRequest > 0) sheetRef.current?.present();
  }, [openRequest, sheetRef]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  const bottomSpace = bottomInset + 16;

  return (
    <BottomSheetModal
      ref={sheetRef}
      onDismiss={onDismiss}
      enableDynamicSizing
      maxDynamicContentSize={height * MAX_HEIGHT_SHARE}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      {scrollable ? (
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: bottomSpace }}>
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView style={{ paddingBottom: bottomSpace }}>{children}</BottomSheetView>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: colors.surface, borderRadius: 28 },
  handle: { backgroundColor: colors.border, width: 44 },
});
