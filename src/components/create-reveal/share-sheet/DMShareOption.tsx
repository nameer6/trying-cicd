import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ShareIcon from 'src/assets/icons/share.svg';

type Props = {
  option: {
    title: string;
    icon: React.ReactNode;
  };
  shareUrl: string;
  handleShare: () => void;
};

const DMShareOption = ({option, handleShare, shareUrl}: Props) => {
  // const handleShare = () => {
  //   if (option.title === 'Instagram DM') {
  //     const shareOptions: any = {
  //       title: shareUrl,
  //       message: 'hello',
  //       url: shareUrl,
  //       social: Share.Social.INSTAGRAM,
  //       type: 'url',
  //       forceDialog: true,
  //     };

  //     Share.shareSingle(shareOptions)
  //       .then(res => {
  //         console.log(res);
  //       })
  //       .catch(err => {
  //         err && console.log(err);
  //       });

  //     // const instagramDMUrl = 'instagram://direct';
  //     // Linking.canOpenURL(instagramDMUrl)
  //     //   .then(supported => {
  //     //     if (supported) {
  //     //       return Linking.openURL(`instagram://sharesheet?text=${shareUrl}`);
  //     //     } else {
  //     //       // Fallback to opening Instagram in the browser if the app is not installed
  //     //       return Linking.openURL('https://www.instagram.com/direct/inbox/');
  //     //     }
  //     //   })
  //     //   .catch(error => {
  //     //     console.error('Error opening Instagram Direct Message:', error);
  //     //   });
  //   } else if (option.title === 'Messages') {
  //     const instagramDMUrl = 'messages://direct';

  //     Linking.canOpenURL(instagramDMUrl)
  //       .then(supported => {
  //         if (supported) {
  //           return Linking.openURL(`sms:&body=${encodeURIComponent(shareUrl)}`);
  //         } else {
  //           // Fallback to opening Instagram in the browser if the app is not installed
  //           alert('Not supported');
  //         }
  //       })
  //       .catch(error => {
  //         console.error('Error opening Instagram Direct Message:', error);
  //       });
  //   }
  // };
  return (
    <TouchableOpacity
      onPress={handleShare}
      style={styles.container}
      disabled={!shareUrl}>
      <View style={styles.content}>
        {option.icon}
        <Text style={styles.title}>{option.title}</Text>
      </View>
      <View>
        <ShareIcon />
      </View>
    </TouchableOpacity>
  );
};

export default DMShareOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
