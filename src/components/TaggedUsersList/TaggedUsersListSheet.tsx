import {useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import TaggedUserListing from './TaggedUserListing';
import {updateShareDirectlyWith} from 'src/store/reducers/createReveal';
import {ContactCardType} from 'src/helpers/types/profile.types';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  sheetContainerStyle,
  sheetShadowStyle,
  transparentSheetIndicatorStyle,
} from 'src/common/common-styles';

const HEIGHT = Dimensions.get('window').height;
type UserData = {
  full_name: string;
  user_image: string;
};

type Props = {
  show: boolean;
  closeUserListModal: () => void;
  sharedWith: UserData[];
};

const TaggedUsersListSheet = ({
  show,
  closeUserListModal,
  sharedWith,
}: Props) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => bottomSheetRef.current?.close();

  useEffect(() => {
    show ? openSheet() : closeSheet();
  }, [show]);

  // Handlers
  const handleSheetChange = (index: number) => {
    if (index === -1) {
      closeUserListModal();
    }
  };

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  const onReveal = async (item: ContactCardType) => {
    closeSheet();
    // setTimeout(() => {
    dispatch(updateShareDirectlyWith(item));
    // }, 500);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={[HEIGHT / 2.2, HEIGHT]}
      onChange={handleSheetChange}
      topInset={50}
      enablePanDownToClose
      enableDismissOnClose
      style={sheetShadowStyle}
      backgroundStyle={sheetContainerStyle}
      handleIndicatorStyle={transparentSheetIndicatorStyle}
      keyboardBehavior="extend"
      backdropComponent={renderBackdrop}>
      <>
        <TaggedUserListing
          TaggedUserListData={sharedWith}
          onReveal={onReveal}
        />
      </>
    </BottomSheetModal>
  );
};

export default TaggedUsersListSheet;
