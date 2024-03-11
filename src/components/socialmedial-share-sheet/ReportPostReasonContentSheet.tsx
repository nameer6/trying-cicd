import {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Spinner from 'components/Spinner';
import {RevealTimelineType} from 'src/helpers/types/reveal.types';
import settings from 'src/helpers/http/settings';
import {showErrorToast} from 'src/helpers/mics';
import {styles} from './styles';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  transparentSheetIndicatorStyle,
  transparentSheetStyle,
} from 'src/common/common-styles';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';

type Props = {
  postItem?: RevealTimelineType;
  show: boolean;
  closeReportReasonModal: () => void;
};

const HEIGHT = Dimensions.get('window').height;

const ReportPostReasonContentSheet = ({
  show,
  postItem,
  closeReportReasonModal,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {settings: settingsData} = useSelector(
    (state: any) => state.settingsStore,
  );
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
      closeReportReasonModal();
    }
  };

  const renderReortReason = ({item, index}: {item: string; index: number}) => {
    return (
      <>
        <TouchableOpacity
          onPress={handleSelectReason(item)}
          style={styles.btnOptionContainerView}>
          <Text
            style={[styles.blockButtonTextStyle, styles.btnOptionTextStyle]}>
            {item}
          </Text>
        </TouchableOpacity>
        {index !== settingsData?.report_messages?.length - 1 && (
          <View style={styles.borderView} />
        )}
      </>
    );
  };

  const handleSelectReason = (reason: string) => () => {
    setLoading(true);
    console.log('postItem: ' + JSON.stringify(postItem));
    postItem?.shared_by?.user_id &&
      settings
        .reportUser({
          reason,
          userId: postItem?.shared_by?.user_id,
          _user_revealed_answer_id: postItem?.answer_id,
        })
        .then(res => {
          console.log('res ', res);
          setLoading(false);
          showConfirmationMessage();
        })
        .catch(error => {
          console.log('error ', error);
          setLoading(false);
          showErrorToast(error);
        });
  };

  const showConfirmationMessage = () => {
    closeReportReasonModal();
    setTimeout(() => {
      Alert.alert(
        'We’re on it',
        'Our team will review the profile and deactivate it if it violates our terms of use.',
        [
          {
            text: 'Close',
            onPress: askForBlocking,
            style: 'default',
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
    }, 500);
  };

  const askForBlocking = () => {
    Alert.alert(
      'Block this user',
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

  const blockUserApi = () => {
    setLoading(true);
    postItem?.shared_by?.user_id &&
      settings
        .blockUnblockUser({
          action: 'block',
          userId: postItem?.shared_by?.user_id,
        })
        .then(res => {
          console.log('res ', res);
          Toast.show({
            type: 'infoToast',
            props: {
              title: `${postItem?.shared_by?.full_name} has been added to your block list.`,
              description: 'Go to Settings → Manage Account → Blocked Account',
            },
          });
          setLoading(false);
        })
        .catch(error => {
          console.log('error ', error);
          setLoading(false);
          showErrorToast(error);
        });
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
      <Spinner
        loading={loading}
        spinnerContainerStyle={styles.reportResonLoader}
      />
      {!loading && (
        <Pressable
          onPress={closeReportReasonModal}
          style={styles.reportContainer}>
          <View style={styles.optionsViewContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTextStyle}>
                Report {postItem?.shared_by?.full_name}
              </Text>
            </View>
            <View style={styles.borderView} />
            <FlatList
              data={settingsData?.report_messages || []}
              keyExtractor={(item: string) => item}
              renderItem={renderReortReason}
            />
          </View>
          <View style={styles.cancelBtnView}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={closeReportReasonModal}
              style={styles.cancelBtnOptionContainerView}>
              <Text
                style={[styles.btnOptionTextStyle, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
    </BottomSheetModal>
  );
};

export default ReportPostReasonContentSheet;
