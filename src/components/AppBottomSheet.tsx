import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps, BottomSheetFooterProps } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import { useBottomInset } from "@/hooks/useBottomInset";
import { colors } from "@/theme/colors";

type Props = {
  sheetRef: React.RefObject<BottomSheetModal | null>; // the owner closes it with sheetRef.current?.dismiss()
  openRequest: number; // the sheet opens whenever this number goes up (0 means never asked)
  onDismiss?: () => void; // after it closed, however it was closed
  scrollable?: boolean; // tall content scrolls inside the sheet
  footer?: React.ReactNode; // stays fixed at the bottom while the content scrolls
  children: React.ReactNode;
};

const MAX_HEIGHT_SHARE = 0.92;

// The one bottom sheet every sheet in the app uses: dark surface, dim backdrop that closes it, sized to
// its content, with the bottom spacing rule built in (see useBottomInset).
export function AppBottomSheet({
  sheetRef,
  openRequest,
  onDismiss,
  scrollable = false,
  footer,
  children,
}: Props) {
  const bottomInset = useBottomInset();
  const { height } = useWindowDimensions();
  const [footerHeight, setFooterHeight] = useState(0);

  // Every new request presents the sheet again. Nothing here calls dismiss(): a dismiss() before the
  // first present() makes gorhom ignore that present(), and a flag could disagree with the real sheet.
  useEffect(() => {
    if (openRequest > 0) sheetRef.current?.present();
  }, [openRequest, sheetRef]);

  // The footer floats over the bottom of the sheet, so the content gets that much room below it
  const renderFooter = (props: BottomSheetFooterProps) => (
    <BottomSheetFooter {...props}>
      <View
        style={[styles.footer, { paddingBottom: bottomInset + 8 }]}
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
      >
        {footer}
      </View>
    </BottomSheetFooter>
  );
  const bottomSpace = footer ? footerHeight + 8 : bottomInset + 16;

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      onDismiss={onDismiss}
      enableDynamicSizing
      maxDynamicContentSize={height * MAX_HEIGHT_SHARE}
      backdropComponent={renderBackdrop}
      footerComponent={footer ? renderFooter : undefined}
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
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
