import {useEffect, useMemo} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import GradientButton from 'src/components/GradientButton';
import ProfileThumbnail from 'src/components/ProfileThumbnail';
import {BackgroundGradient} from './BackgroundGradient';
import {fonts} from 'src/common/fonts';
import {useQueryClient} from '@tanstack/react-query';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type Props = {
  onClose: () => void;
  unlockData: {
    total_unlocked_reveals: number;
    unlocked_users: {
      user_id: string;
      full_name: string;
      user_image: string;
    }[];
  };
};

const UnlockedRevealsFrom = ({unlockData, onClose}: Props) => {
  const queryClient = useQueryClient();
  const unlockedUser = useMemo(() => {
    let unlockedText = '';
    const top3 = unlockData?.unlocked_users?.slice(0, 3);
    if (top3?.length === 2) {
      top3?.map(
        (i, index) =>
          (unlockedText +=
            index !== top3?.length - 1 ? i.full_name + ' and ' : i.full_name),
      );
    } else {
      top3?.map(
        (i, index) =>
          (unlockedText +=
            index !== top3?.length - 1 ? i.full_name + ', ' : i.full_name),
      );
    }
    return unlockedText;
  }, [unlockData]);

  const scaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(
        scaleValue, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 300, // Make it take a while
          useNativeDriver: true,
        },
      ).start();
    }, 300);
  }, [scaleValue]);

  const onUnlock = () => {
    onClose();
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.animatedWrapperStyle,
          {
            opacity: scaleValue,
          },
        ]}>
        <BackgroundGradient width={WIDTH} height={HEIGHT / 2.2} />
        <Animated.View style={[styles.container]}>
          {unlockData?.unlocked_users?.length > 0 && (
            <View style={styles.userImages}>
              {unlockData?.unlocked_users[0]?.user_image && (
                <ProfileThumbnail
                  style={[
                    styles.userImage,
                    unlockData?.unlocked_users?.length === 2 &&
                      styles.largerImage,
                  ]}
                  image={unlockData?.unlocked_users[0]?.user_image}
                />
              )}
              {unlockData?.unlocked_users[2]?.user_image && (
                <View style={styles.centerImageContainer}>
                  <ProfileThumbnail
                    style={styles.centerImage}
                    image={unlockData?.unlocked_users[2].user_image}
                  />
                </View>
              )}
              {unlockData?.unlocked_users[1]?.user_image && (
                <View
                  style={
                    unlockData?.unlocked_users?.length !== 2
                      ? styles.userImage2
                      : styles.userImage2SmallGap
                  }>
                  <ProfileThumbnail
                    style={[
                      styles.userImage,
                      unlockData?.unlocked_users?.length === 2 &&
                        styles.largerImage,
                    ]}
                    image={unlockData?.unlocked_users[1].user_image}
                  />
                </View>
              )}
            </View>
          )}
          {unlockData?.unlocked_users?.length > 0 ? (
            <Text style={styles.sharedWithText}>
              You’ve unlocked {unlockData?.total_unlocked_reveals}{' '}
              {unlockData?.total_unlocked_reveals > 1 ? 'reveals' : 'reveal'}{' '}
              from {unlockedUser}{' '}
              {unlockData?.unlocked_users?.length > 3
                ? `and ${unlockData?.unlocked_users?.length - 3} others`
                : ''}
            </Text>
          ) : (
            <Text style={styles.sharedWithText}>
              Share your reveal with your friends!
            </Text>
          )}
          {unlockData?.unlocked_users?.length > 0 && (
            <GradientButton
              onPress={onUnlock}
              style={styles.unlockButton}
              secondColorOffset="0.8">
              <Text style={styles.unlockButtonText}>Unlock Now</Text>
            </GradientButton>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default UnlockedRevealsFrom;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#0d0e0f',
    height: HEIGHT - HEIGHT / 2.2,
  },
  animatedWrapperStyle: {
    width: '100%',
    height: '100%',
  },
  container: {
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 80,
  },
  userImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerImageContainer: {
    height: 34,
    width: 34,
    borderRadius: 34,
    position: 'absolute',
    left: 16,
    zIndex: 99,
    borderWidth: 2,
    borderColor: '#26282F',
  },
  centerImage: {
    height: 34,
    width: 34,
    borderRadius: 34,
  },
  userImage: {
    height: 24,
    width: 24,
    borderRadius: 24,
  },
  largerImage: {
    height: 32,
    width: 32,
    borderRadius: 32,
  },
  userImage2: {
    marginLeft: 18,
  },
  userImage2SmallGap: {
    marginLeft: 9,
  },
  sharedWithText: {
    color: '#fff',
    opacity: 1,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    maxWidth: '80%',
    fontWeight: '500',
  },
  unlockButton: {
    maxWidth: '50%',
    alignSelf: 'center',
    marginTop: 16,
  },
  unlockButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
