import {useEffect, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
// import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import EmojiSelector, {Categories} from './EmojiSelector';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import {Easing} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'src/helpers/statusbar-height';

const HEIGHT = Dimensions.get('window').height;

type Props = {
  show: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
};

const EmojiPicker = ({show, onClose, onSelectEmoji}: Props) => {
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => bottomSheetRef.current?.close();

  useEffect(() => {
    if (show) {
      openSheet();
      setTimeout(() => {
        setShowEmojis(true);
      }, 500);
    }
  }, [show]);

  // Handlers
  const handleSheetChange = (index: number) => {
    if (index === -1) {
      setShowEmojis(false);
      onClose();
    }
  };

  const onSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    setShowEmojis(false);
    closeSheet();
  };

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 80,
    easing: Easing.linear,
  });

  const [statusbarHeight, setStatusbarHeight] = useState<number>(0);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const height = getStatusBarHeight(true);
    setStatusbarHeight(height);
  }, []);

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={[HEIGHT / 1.7]}
      onChange={handleSheetChange}
      enablePanDownToClose
      enableDismissOnClose
      topInset={statusbarHeight}
      style={sheetShadowStyle}
      backgroundStyle={sheetContainerStyle}
      handleIndicatorStyle={sheetIndicatorStyle}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}>
      {showEmojis && (
        <EmojiSelector
          category={Categories.all}
          onEmojiSelected={onSelect}
          placeholder="Search Emoji"
          showHistory
          columns={8}
        />
      )}
    </BottomSheetModal>
  );
};

export default EmojiPicker;
