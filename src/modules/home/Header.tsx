import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable, Image, Text, Animated} from 'react-native';
import {useSelector} from 'react-redux';
import {fonts} from 'src/common/fonts';
import Icon from 'react-native-vector-icons/Feather';
import GradientButton from 'src/components/GradientButton';
import {colors} from 'src/common/colors';
import BounceButton from 'src/components/BounceButton';

type Props = {
  unreadCounts: number;
  translateY: any;
};

const Header = ({unreadCounts, translateY}: Props) => {
  const navigation = useNavigation();
  const {user} = useSelector((state: any) => state.myProfile);
  // const {has_notification} = useSelector((state: any) => state.settingsStore);
  // const {unreadCounts} = useSelector((state: any) => state.revealTimeline);
  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  const goToActivities = () => {
    navigation.navigate('Activities');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY: translateY}],
        },
      ]}>
      <>
        <View style={styles.boxView}>
          <Pressable style={styles.profilePicContainer} onPress={goToProfile}>
            {user?.user_image && (
              <Image
                source={{uri: user.user_image}}
                style={styles.profilePic}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Inbox</Text>
          {unreadCounts > 0 && (
            <GradientButton
              style={styles.unreadCountBadge}
              secondColorOffset="0.2">
              <Text style={styles.unReadCount}>{unreadCounts}</Text>
            </GradientButton>
          )}
        </View>
        <View style={styles.boxView}>
          <BounceButton
            style={styles.notificationButton}
            onPress={goToActivities}>
            <Icon name="bell" color="#fff" size={22} />
            {/* {!!has_notification && <View style={styles.redDot} />} */}
          </BounceButton>
        </View>
      </>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.bgColor,
    width: '100%',
    height: 64,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    elevation: 4,
    zIndex: 100,
  },
  boxView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    height: 44,
    width: 44,
    borderRadius: 44,
    backgroundColor: 'gray',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.28,
    shadowRadius: 8.0,
    elevation: 24,
  },
  profilePic: {
    height: 44,
    width: 44,
    borderRadius: 44,
    resizeMode: 'cover',
  },
  headerTitle: {
    flexDirection: 'row',
    gap: 4,
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.SF_HEAVY,
    color: '#fff',
    fontWeight: '800',
  },
  unreadCountBadge: {
    height: 21,
    width: 21,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unReadCount: {
    fontSize: 12,
    color: '#292930',
    fontFamily: fonts.SF_BOLD,
    fontWeight: 'bold',
  },
  notificationButton: {
    height: 44,
    width: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3d3e43',
  },
  redDot: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: colors.gradientLimeColor,
    position: 'absolute',
    top: 0,
    right: 5,
  },
});
