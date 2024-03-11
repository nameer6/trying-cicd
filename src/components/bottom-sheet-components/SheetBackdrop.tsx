import {StyleSheet, Keyboard, Pressable} from 'react-native';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';

const SheetBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    opacity={0.3}
    enableTouchThrough={false}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    style={styles.sheetbackdropStyle}>
    <Pressable onPress={Keyboard.dismiss} style={{flex: 1}} />
  </BottomSheetBackdrop>
);

export default SheetBackdrop;

const styles = StyleSheet.create({
  sheetbackdropStyle: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    ...StyleSheet.absoluteFillObject,
  },
});
