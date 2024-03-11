import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Keyboard, Text, View} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {Easing} from 'react-native-reanimated';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import CommentsList from './CommentsList';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import {styles} from './styles';
import {useQueryClient} from '@tanstack/react-query';
import {CommentType} from 'src/helpers/types/reveal.types';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import CommentItem from './CommentItem';
import NoCommentsView from './NoCommentsView';
import CommentBox from './CommentBox';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'src/helpers/statusbar-height';

const LIMIT = 10;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  answerId?: string;
  show: boolean;
  closeCommentsModal: () => void;
  total_comments?: number;
};

const CommentsSheet = ({
  show,
  answerId,
  closeCommentsModal,
  total_comments,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (show) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [show]);

  // Handlers
  const handleSheetChange = (index: number) => {
    if (index === -1) {
      closeCommentsModal();
    }
  };

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 80,
    easing: Easing.linear,
  });

  const [statusbarHeight, setStatusbarHeight] = useState<number>(0);

  // const insets = useSafeAreaInsets();

  useEffect(() => {
    const height = getStatusBarHeight(true);
    setStatusbarHeight(height);
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={[HEIGHT / 1.7]}
      onChange={handleSheetChange}
      style={sheetShadowStyle}
      backgroundStyle={sheetContainerStyle}
      handleIndicatorStyle={sheetIndicatorStyle}
      enableHandlePanningGesture
      enablePanDownToClose
      enableDismissOnClose
      topInset={statusbarHeight}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}>
      <CommentsList
        answerId={answerId}
        commentBoxStyle={styles.commentBoxStyle}
        total_comments={total_comments}
      />
    </BottomSheetModal>
  );
};

export default CommentsSheet;
