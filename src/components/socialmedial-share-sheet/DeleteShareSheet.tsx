import {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
  NativeModules,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import reveals from 'src/helpers/http/reveals';
import {ShareDataType} from 'src/helpers/types/reveal.types';
import {imageUrlToBase64, showErrorToast} from 'src/helpers/mics';
import InstaIcon from 'src/assets/images/insta.svg';
import SnapIcon from 'src/assets/images/snapchat.svg';
import InstaStoryIcon from 'src/assets/images/insta-story.svg';
import SnapStoryIcon from 'src/assets/images/snapchat.svg';
import {styles} from './styles';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import {CreativeKit} from '@snapchat/snap-kit-react-native';
import Spinner from '../Spinner';

const {LNExtensionExecutorModule} = NativeModules;

const HEIGHT = Dimensions.get('window').height;

type Props = {
  answer_id?: string;
  shareData?: ShareDataType;
  onClose: () => void;
  show: boolean;
  onPressDeletePost: () => void;
};

const DeleteShareSheet = ({
  answer_id,
  onClose,
  show,
  onPressDeletePost,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [shareData, setShareData] = useState<ShareDataType | null>(null);
  const [processing, setProcessing] = useState<boolean>(null);

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

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  useEffect(() => {
    if (show) {
      openSheet();
    } else {
      setShareData(null);
      closeSheet();
    }
  }, [show]);

  const getShareData = useCallback(() => {
    if (answer_id) {
      setLoading(true);
      reveals
        .generateShareLink(answer_id)
        .then(async res => {
          console.log('Share link more: ', res.data);
          setLoading(false);
          // alert(JSON.stringify(res.data));
          setShareData(res.data);
        })
        .catch(err => {
          console.log('Share link error: ', err);
          setLoading(false);
          showErrorToast(err + '');
        });
    }
  }, [answer_id]);

  useEffect(() => {
    if (show && answer_id) {
      getShareData();
    }
  }, [answer_id, getShareData, show]);

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
    setProcessing(true);
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
            setProcessing(false);
            setLoading(false);
            console.log(res);
          })
          .catch(err => {
            setProcessing(false);
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
          setProcessing(false);
          console.log('snap res: ', res);
        })
        .catch(error => {
          setProcessing(false);
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
      setProcessing(false);
      console.log('Error: ', err);
    }
  };

  // const handleShare = (type: string) => {
  //   closeSheet();
  //   if (shareData?.share_url) {
  //     const shareAppIdentifier =
  //       type === 'insta'
  //         ? 'com.burbn.instagram.shareextension'
  //         : 'com.toyopagroup.picaboo.share';
  //     setTimeout(async () => {
  //       await LNExtensionExecutorModule.socialShare(
  //         shareAppIdentifier,
  //         'Checkout this website',
  //         shareData?.share_url,
  //       );
  //     }, 500);
  //   }
  // };

  return (
    <>
      <Spinner
        loading={processing}
        spinnerContainerStyle={styles.loaderStyle}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        index={show ? 0 : -1}
        snapPoints={[225]}
        onChange={handleSheetChange}
        enablePanDownToClose
        enableDismissOnClose
        style={sheetShadowStyle}
        backgroundStyle={sheetContainerStyle}
        handleIndicatorStyle={sheetIndicatorStyle}
        keyboardBehavior="extend"
        backdropComponent={renderBackdrop}>
        <View style={styles.deleteContainer}>
          <View style={[styles.deleteShareOptions, loading && styles.disabled]}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={copyLink('snap')}
              disabled={loading || !shareData}>
              <SnapStoryIcon style={styles.instaIconStyle} />
              <View>
                <Text style={styles.shareOptionTextStyle}>Snapchat</Text>
                {/* <Text style={styles.shareOptionTextStyle}>Story</Text> */}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={copyLink('insta-story')}
              disabled={loading || !shareData}>
              <InstaStoryIcon />
              <View>
                <Text style={styles.shareOptionTextStyle}>Instagram</Text>
                {/* <Text style={styles.shareOptionTextStyle}>Story</Text> */}
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onPressDeletePost}
            style={styles.deleteButtonView}>
            <Text style={styles.deleteButtonTextStyle}>Delete</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </>
  );
};

export default DeleteShareSheet;
