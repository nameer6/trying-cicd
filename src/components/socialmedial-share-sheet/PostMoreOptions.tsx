import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  transparentSheetIndicatorStyle,
  transparentSheetStyle,
} from 'src/common/common-styles';
import Spinner from 'src/components/Spinner';
import settings from 'src/helpers/http/settings';
import {showErrorToast} from 'src/helpers/mics';
import {RevealTimelineType} from 'src/helpers/types/reveal.types';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import {styles} from './styles';

type Props = {
  postItem?: RevealTimelineType;
  show: boolean;
  onClose: () => void;
  onReportPost: (postItem?: any) => void;
  afterBlockUser: () => void;
};

const HEIGHT = Dimensions.get('window').height;

const PostMoreOptions = ({
  show,
  postItem,
  onClose,
  onReportPost,
  afterBlockUser,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [hideContent, setHideContent] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => bottomSheetRef.current?.close();

  useEffect(() => {
    if (show) {
      openSheet();
      setHideContent(false);
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

  const blockUserApi = () => {
    setLoading(true);
    postItem?.shared_by?.user_id &&
      settings
        .blockUnblockUser({
          action: 'block',
          userId: postItem?.shared_by?.user_id,
        })
        .then(() => {
          Toast.show({
            type: 'infoToast',
            props: {
              title: `${postItem?.shared_by?.full_name} has been added to your block list.`,
              description: 'Go to Settings → Manage Account → Blocked Account',
            },
          });
          setLoading(false);
          afterBlockUser();
        })
        .catch(error => {
          console.log('error ', error);
          setLoading(false);
          showErrorToast(error);
        });
  };

  const onBlock = () => {
    setHideContent(true);
    Alert.alert(
      'Block this user?',
      'You will no longer be able to reveal or receive reveals from people you block.',
      [
        {
          text: 'Cancel',
          onPress: closeSheet,
          style: 'default',
        },
        {
          text: 'Block',
          onPress: blockUserApi,
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      },
    );
  };

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={[HEIGHT]}
      onChange={handleSheetChange}
      enablePanDownToClose
      enableDismissOnClose
      backgroundStyle={transparentSheetStyle}
      handleIndicatorStyle={transparentSheetIndicatorStyle}
      keyboardBehavior="extend"
      backdropComponent={renderBackdrop}>
      <>
        <Spinner
          loading={loading}
          spinnerContainerStyle={styles.reportResonLoader}
        />
        {!loading && !hideContent && (
          <Pressable onPress={onClose} style={styles.reportContainer}>
            <View style={styles.optionsViewContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onBlock}
                style={styles.btnOptionContainerView}>
                <Text style={styles.blockButtonTextStyle}>Block</Text>
              </TouchableOpacity>
              <View style={styles.borderView} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => postItem && onReportPost(postItem)}
                style={styles.btnOptionContainerView}>
                <Text style={styles.btnOptionTextStyle}>Report</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cancelBtnView}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeSheet}
                style={styles.cancelBtnOptionContainerView}>
                <Text
                  style={[styles.btnOptionTextStyle, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        )}
      </>
    </BottomSheetModal>
  );
};

export default PostMoreOptions;
