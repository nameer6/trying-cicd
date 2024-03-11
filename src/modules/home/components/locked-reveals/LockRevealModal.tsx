import {useEffect, useMemo, useRef} from 'react';
import {View, Text, ImageBackground, Pressable} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {styles} from './styles';
import Header from './Header';
import Icon from 'react-native-vector-icons/Entypo';
import {transparentSheetIndicatorStyle} from 'src/common/common-styles';
import GradientText from 'src/components/GradientText';
import UserImages from './UserImages';
import CreateRevealWidget from 'src/components/create-reveal/create-reveal-widget/CreateRevealWidget';
import {RevealTimelineType, SharedByType} from 'src/helpers/types/reveal.types';
type Props = {
  show: boolean;
  onClose: () => void;
  lockedDataCount: number;
  dataCount: number;
  lockedData: RevealTimelineType[];
};

const LockRevealModal = ({
  show,
  onClose,
  lockedDataCount,
  dataCount,
  lockedData = [],
}: Props) => {
  const handleClose = () => {
    closeSheet();
  };

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => bottomSheetRef.current?.close();

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
      onClose();
    }
  };

  useEffect(() => {
    console.log('Locked datat? ' + JSON.stringify(lockedData));
  }, [lockedData]);

  const sharedBy = useMemo(() => {
    const sharedByData: SharedByType[] = lockedData?.map(
      item => item.shared_by,
    );
    const uniqueSharedBy: SharedByType[] = sharedByData?.filter(
      (obj, index, self) =>
        index === self.findIndex(item => item.user_id === obj.user_id),
    );
    return uniqueSharedBy;
  }, [lockedData]);

  const closeLockedModal = () => {
    onClose();
  };

  const renderProfileName = () => {
    let text;
    switch (sharedBy.length) {
      case 1:
        text = sharedBy[0]?.full_name?.split(' ')[0]?.trim()?.trim();
        break;
      case 2:
        text =
          sharedBy[0]?.full_name?.split(' ')[0]?.trim() +
          ' and ' +
          sharedBy[1]?.full_name?.split(' ')[0]?.trim();
        break;
      case 3:
        text =
          sharedBy[0]?.full_name?.split(' ')[0]?.trim() +
          ', ' +
          sharedBy[1]?.full_name?.split(' ')[0]?.trim() +
          ' and ' +
          sharedBy[2]?.full_name?.split(' ')[0]?.trim();
        break;
      case 4:
        text =
          sharedBy[0]?.full_name?.split(' ')[0]?.trim() +
          ', ' +
          sharedBy[1]?.full_name?.split(' ')[0]?.trim() +
          ', ' +
          sharedBy[2]?.full_name?.split(' ')[0]?.trim() +
          ' and ' +
          sharedBy[3]?.full_name?.split(' ')[0]?.trim();
        break;
      default:
        text =
          sharedBy[0]?.full_name?.split(' ')[0]?.trim() +
          ', ' +
          sharedBy[1]?.full_name?.split(' ')[0]?.trim() +
          ', ' +
          sharedBy[2]?.full_name?.split(' ')[0]?.trim() +
          ', ' +
          sharedBy[3]?.full_name?.split(' ')[0]?.trim() +
          ` and ${sharedBy?.length - 4} ${
            sharedBy?.length - 4 === 1 ? 'other' : 'others'
          }`;
        break;
    }
    const [first, ...rest] = text.split(',');
    return {first, rest: rest.join(',')};
  };
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={['100%']}
      onChange={handleSheetChange}
      enablePanDownToClose={false}
      enableDismissOnClose
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={transparentSheetIndicatorStyle}
      keyboardBehavior="extend">
      <View style={styles.mainContainer}>
        <Header onClose={handleClose} />
        <View style={styles.lockedDataContainer}>
          {show && <UserImages lockedData={lockedData} />}

          <View style={styles.newRevealTextContainer}>
            <GradientText>
              <Text style={styles.revealLengthTextStyle}>
                {lockedData.length} new reveal{lockedData.length > 1 ? 's' : ''}{' '}
              </Text>
            </GradientText>
            <Text style={styles.revealUserNamesTextStyle}>
              from {renderProfileName()?.first}
              {sharedBy?.length > 2 ? ',' : ''}
            </Text>
          </View>
          <Text style={styles.revealUserNamesTextStyle2}>
            {renderProfileName()?.rest}
          </Text>
        </View>
        {/* reveal content end */}
        <ImageBackground
          source={require('src/assets/images/lockedmodal-gradient-bg.png')}
          style={styles.gradientBg}
          imageStyle={styles.gradientBgImageStyle}>
          <CreateRevealWidget
            lockedDataCount={lockedDataCount}
            dataCount={dataCount}
            closeLockedModal={closeLockedModal}
            inModal
          />

          {/* Unlock them instantly container strat */}
          <View style={styles.unLockRevealTextContainer}>
            <Pressable
              onPress={() => alert('Coming soon')}
              style={styles.unLockRevealTextView}>
              <Text style={styles.unLockRevealTextStyle}>
                Unlock {lockedData.length > 1 ? 'them' : 'it'} instantly
              </Text>
              <Icon name="chevron-right" color="#fff" size={18} />
            </Pressable>
          </View>
          {/* Unlock them instantly container end */}
        </ImageBackground>
      </View>
    </BottomSheetModal>
  );
};

export default LockRevealModal;
