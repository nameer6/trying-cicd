import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
  Keyboard,
  StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import UnlockedRevealsFrom from './UnlockedRevealsFrom';
import {styles} from './styles';
import {imageUrlToBase64, showErrorToast} from 'src/helpers/mics';
import {ShareDataType} from 'src/helpers/types/reveal.types';
import UnlockIcon from 'src/assets/icons/unlock.svg';
import InstaStoryIcon from 'src/assets/images/insta-story.svg';
import SnapStoryIcon from 'src/assets/images/snapchat.svg';
import {useQueryClient} from '@tanstack/react-query';
import {CreativeKit} from '@snapchat/snap-kit-react-native';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';

const HEIGHT = Dimensions.get('window').height;

type Props = {
  shareData?: ShareDataType;
  onClose: () => void;
  show: boolean;
};

const SocialMediaShareSheet = ({shareData, onClose, show}: Props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const refRBSheet = useRef<any>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => bottomSheetRef.current?.close();

  useEffect(() => {
    show ? openSheet() : closeSheet();
  }, [show]);

  // Handlers
  const handleSheetChange = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  // const openSheet = () => {
  //   refRBSheet.current.open();
  // };

  useEffect(() => {
    if (show) {
      openSheet();
      setLoading(false);
    } else {
      closeSheet();
      setLoading(false);
    }
  }, [show]);

  const handleClose = () => {
    queryClient.invalidateQueries(['get-locked-reveals'] as never);
    queryClient.invalidateQueries(['get-reveals'] as never);
    // onClose();
    closeSheet();
  };

  const copyLink = (type: string) => async () => {
    if (shareData?.share_url) {
      await Clipboard.setString(shareData?.share_url);
      Alert.alert('🔗 Link Copied!', shareData?.share_url, [
        {
          text: 'OK',
          onPress: () => handleShare(type),
          style: 'default',
        },
      ]);
    }
  };

  const handleShare = async (type: string) => {
    if (shareData?.story_image_url) {
      if (type === 'insta-story') {
        console.log('shareData?.story_image_url: ', shareData?.story_image_url);
        const base64 = await imageUrlToBase64(shareData?.story_image_url);
        const shareOptions: any = {
          title: 'Share via',
          message: 'hello',
          url: 'data:image/png;base64,' + base64,
          social: Share.Social.INSTAGRAM,
          // type: 'url',
        };

        Share.shareSingle(shareOptions)
          .then(res => {
            setLoading(false);
            console.log(res);
          })
          .catch(err => {
            setLoading(false);
            showErrorToast(err + '');
            err && console.log(err);
          });
      } else {
        shareData?.story_image_url &&
          shareToSnapchat(shareData?.story_image_url);
      }
    }
  };

  const shareToSnapchat = async (uri: string) => {
    console.log('shareData?.story_image_url: ' + shareData?.story_image_url);
    try {
      const photoContent: any = {
        content: {
          uri: uri,
        },
      };

      CreativeKit.sharePhoto(photoContent)
        .then(res => {
          // handle success
          console.log('snap res: ', res);
        })
        .catch(error => {
          // handle error
          console.log('Error: ', error);

          // Log more details about the error
          if (error.response) {
            console.log('Response data: ', error.response.data);
            console.log('Response status: ', error.response.status);
          } else if (error.request) {
            console.log('Request details: ', error.request);
          } else {
            console.log('Error message: ', error.message);
          }
        });
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      enableTouchThrough={false}
      appearsOnIndex={0}
      opacity={
        show && shareData?.unlockData?.total_unlocked_reveals !== 0 ? 1 : 0.7
      }
      disappearsOnIndex={-1}
      style={{
        ...StyleSheet.absoluteFillObject,
      }}>
      <Pressable style={{flex: 1}}>
        {show && shareData?.unlockData?.total_unlocked_reveals !== 0 && (
          <View style={styles.absolute}>
            <UnlockedRevealsFrom
              unlockData={shareData?.unlockData}
              onClose={handleClose}
            />
          </View>
        )}
      </Pressable>
    </BottomSheetBackdrop>
  );

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={show ? 0 : -1}
        snapPoints={[HEIGHT / 2]}
        onChange={handleSheetChange}
        topInset={50}
        enablePanDownToClose={
          shareData?.unlockData?.total_unlocked_reveals === 0
        }
        enableDismissOnClose
        style={{borderRadius: 30}}
        backgroundStyle={sheetContainerStyle}
        handleIndicatorStyle={sheetIndicatorStyle}
        keyboardBehavior="extend"
        backdropComponent={renderBackdrop}>
        <View style={styles.container}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color="#fff" size={40} />
            </View>
          )}
          <View style={styles.sharSheetHeader}>
            <UnlockIcon />
            <Text style={styles.shareHeaderTextStyle}>Revealed!</Text>
          </View>
          <Text style={styles.shareInfoText}>Share to friends elsewhere</Text>
          <View style={styles.shareOptions}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={copyLink('snap')}>
              <SnapStoryIcon style={styles.instaIconStyle} />
              <View>
                <Text style={styles.shareOptionTextStyle}>Snapchat</Text>
                <Text style={styles.shareOptionTextStyle}>Story</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={copyLink('insta-story')}>
              <InstaStoryIcon />
              <View>
                <Text style={styles.shareOptionTextStyle}>Instagram</Text>
                <Text style={styles.shareOptionTextStyle}>Story</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
};

export default SocialMediaShareSheet;
