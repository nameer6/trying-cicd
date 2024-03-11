import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from 'src/common/colors';
import ProfileThumbnail from 'src/components/ProfileThumbnail';
import profile from 'src/helpers/http/profile';
import {formatDate} from 'src/helpers/mics';
import {updateUserProfile} from 'src/store/reducers/profileStore';

const ProfileBanner = ({style}: any) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state.myProfile);
  const [loading, setLoading] = useState<boolean>(false);
  const getProfile = useCallback(() => {
    setLoading(true);
    profile
      .getProfile()
      .then(res => {
        if (res?.status) {
          dispatch(updateUserProfile(res?.data));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // console.log('Error: ', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
  }, [getProfile, isFocused]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const onEditProfile = () => {
    navigation.navigate(
      'EditProfile' as never,
      {
        profileData: user,
      } as never,
    );
  };

  return (
    <View style={[styles.container, style]}>
      {loading && !user && <ActivityIndicator color="#fff" />}
      {!!user && (
        <>
          <View>
            <ProfileThumbnail
              image={user?.user_image}
              style={styles.imageStyle}
              name={user?.full_name}
            />
            <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
              <EditBackground />
              <Icon name="edit" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.full_name}</Text>
          <Text style={styles.joinedOnStyle}>
            Joined {formatDate(user?.date_created)}
          </Text>
        </>
      )}
    </View>
  );
};

export default ProfileBanner;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  imageStyle: {
    height: 123,
    width: 123,
    borderRadius: 123,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  joinedOnStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.46,
    marginTop: 2,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderRadius: 38,
    borderColor: colors.bgColor,
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBackgroundStyle: {
    position: 'absolute',
  },
});

const EditBackground = () => (
  <Svg height="32" width="32" style={styles.editBackgroundStyle}>
    <Defs>
      <LinearGradient
        id="grad"
        x1="0"
        y1="-2.57343"
        x2="52.1474"
        y2="34.0238"
        gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#00FFB3" />
        <Stop offset="0.7" stopColor="#F0FF44" />
      </LinearGradient>
    </Defs>
    <Circle cx="16" cy="16" r="16" fill="url(#grad)" />
  </Svg>
);
