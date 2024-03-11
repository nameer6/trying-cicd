import {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import GradientButton from 'src/components/GradientButton';
import GradientText from 'src/components/GradientText';
import ProfileThumbnail from 'src/components/ProfileThumbnail';
import ContactItem from '../ContactItem';
import {ContactCardType} from 'src/helpers/types/profile.types';

type Props = {
  recentsData: ContactCardType[];
  onSelect: (item: ContactCardType) => void;
  onSelectAll: () => void;
  sendToGroup: () => void;
  isSentToGroup?: boolean;
  isGroup?: boolean;
};

const RecentGroup = ({
  recentsData,
  onSelect,
  onSelectAll,
  isSentToGroup,
  sendToGroup,
  isGroup = false,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const renderContactItem = ({item}: {item: ContactCardType}) => {
    return (
      <ContactItem
        item={item}
        isChecked={Boolean(item.isChecked)}
        onSelect={onSelect}
      />
    );
  };

  const sendToText = useMemo(() => {
    let title = 'to ';
    const sendTo = recentsData?.filter(i => i.isChecked);
    const to = sendTo
      ?.slice(0, 3)
      .map(i => i.full_name?.split(' ')[0])
      ?.join(', ');
    title += to;
    title += ` +${recentsData?.length - 3}`;
    return title;
  }, [recentsData]);

  // console.log('recentsDatarecentsData: ' + JSON.stringify(recentsData));

  const handleSendToGroup = () => {
    setLoading(true);
    sendToGroup();
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  if (recentsData?.length === 0) {
    return null;
  }

  if (!isGroup) {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>Reveal to Recents</Text>
          <Pressable onPress={onSelectAll}>
            <Text style={styles.title}>Select All</Text>
          </Pressable>
        </View>
        <FlatList
          renderItem={renderContactItem}
          data={recentsData}
          keyExtractor={(item: ContactCardType) => item.user_id}
        />
      </>
    );
  } else {
    return (
      <View style={styles.groupRow}>
        <ProfileThumbnail
          image={recentsData[0]?.user_image}
          name={recentsData[0]?.full_name}
          style={styles.groupImageStyle}
        />
        <View style={styles.groupFriendList}>
          <Text style={styles.sendAgainTextStyle}>Send Again</Text>
          <GradientText start={{x: 0, y: 0}} end={{x: 0.5, y: 0.5}}>
            <Text style={styles.groupFriendsNameStyle}>{sendToText}</Text>
          </GradientText>
        </View>
        {!isSentToGroup ? (
          !loading ? (
            <GradientButton
              style={styles.sendButton}
              radius={16}
              onPress={handleSendToGroup}
              secondColorOffset="0.4">
              <Text style={styles.sendButtonText}>Send</Text>
            </GradientButton>
          ) : (
            <ActivityIndicator />
          )
        ) : (
          <LottieView
            style={styles.lottieImage}
            source={require('src/assets/lottie/success.json')}
            autoPlay
            loop={false}
            duration={4000}
          />
        )}
      </View>
    );
  }
};

export default RecentGroup;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.5,
    marginBottom: 13,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupImageStyle: {
    height: 44,
    width: 44,
    borderRadius: 44,
  },
  sendAgainTextStyle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  groupFriendList: {
    flex: 1,
    gap: 2,
  },
  groupFriendsNameStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sendButton: {
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  sendButtonText: {
    fontSize: 15,
    color: '#26282F',
    fontWeight: '600',
  },
  lottieImage: {
    height: 60,
    width: 60,
    marginRight: -10,
  },
});
