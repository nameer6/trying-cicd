import {View, Text, NativeModules} from 'react-native';
import Share from 'react-native-share';
import DMShareOption from './DMShareOption';
import InstaIcon from 'src/assets/images/insta.svg';
// import MessageIcon from 'src/assets/images/message.svg';
import SnapchatIcon from 'src/assets/images/snapchat.svg';
import {styles} from './styles';

const {LNExtensionExecutorModule} = NativeModules;

const DM_SHARE_OPTIONS = [
  // {
  //   title: 'Reveal via iMessage',
  //   icon: <MessageIcon style={styles.DMIconStyle} />,
  //   key: 'imessage',
  // },
  {
    title: 'Reveal via Instagram DM',
    icon: <InstaIcon style={styles.DMIconStyle} />,
    key: 'insta',
  },
  {
    title: 'Reveal via Snapchat',
    icon: <SnapchatIcon style={styles.DMIconStyle} />,
    key: 'snap',
  },
];

type Props = {
  shareableUrl: string;
};

const ShareOnDMs = ({shareableUrl}: Props) => {
  const shareOnMessage = () => {
    Share.shareSingle({
      social: Share.Social.SMS,
      recipient: '',
      message: shareableUrl,
    });
  };

  const handleShare = (option: string) => async () => {
    if (shareableUrl) {
      if (option === 'imessage') {
        shareOnMessage();
      } else {
        const shareAppIdentifier =
          option === 'insta'
            ? 'com.burbn.instagram.shareextension'
            : 'com.toyopagroup.picaboo.share';
        LNExtensionExecutorModule.socialShare(
          shareAppIdentifier,
          'Checkout this website',
          shareableUrl,
        );
      }
    }
  };

  return (
    <View>
      <Text style={[styles.title, {marginTop: 14}]}>Other Contacts</Text>
      {DM_SHARE_OPTIONS?.map(item => (
        <DMShareOption
          handleShare={handleShare(item.key)}
          shareUrl={shareableUrl}
          option={item}
          key={item.title}
        />
      ))}
    </View>
  );
};

export default ShareOnDMs;
