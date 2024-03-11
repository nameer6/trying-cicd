import {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from 'src/common/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {triggerHapticFeedback} from 'src/helpers/mics';
import {RevealTimelineType, SharedByType} from 'src/helpers/types/reveal.types';

type Props = {
  lockedData: RevealTimelineType[];
};

const UserImages = ({lockedData}: Props) => {
  const sharedBy = useMemo(() => {
    const sharedByData: SharedByType[] = lockedData?.map(
      item => item.shared_by,
    );
    const uniqueSharedBy: SharedByType[] = sharedByData?.filter(
      (obj, index, self) =>
        index === self.findIndex(item => item.user_id === obj.user_id),
    );
    return uniqueSharedBy;
  }, [lockedData]);

  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: offset.value}],
    opacity: offset.value,
  }));

  useEffect(() => {
    setTimeout(() => {
      offset.value = withSpring(1);
    }, 150);
    setTimeout(() => {
      triggerHapticFeedback('rigid');
    }, 500);
  }, [offset]);

  return (
    <View>
      {sharedBy?.length === 1 && (
        <View style={styles.firstProfileContainer}>
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[0]?.user_image}}
            style={[styles.firstProfileImgStyle]}
          />
        </View>
      )}
      {sharedBy?.length === 2 && (
        <View style={styles.secondProfileContainer}>
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[0]?.user_image}}
            style={[styles.second_first_img_style]}
            // style={[styles.second_first_img_style, animatedStyles]}
          />
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[1]?.user_image}}
            style={[styles.second_two_img_style]}
          />
        </View>
      )}
      {sharedBy?.length === 3 && (
        <View style={styles.thirdProfileContainer}>
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[0]?.user_image}}
            style={[styles.third_first_img_style]}
          />
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[1]?.user_image}}
            style={[styles.third_two_img_style]}
          />
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[2]?.user_image}}
            style={[styles.third_three_img_style]}
          />
        </View>
      )}
      {sharedBy?.length > 3 && (
        <View style={styles.ForuthProfileContainer}>
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[0]?.user_image}}
            style={[styles.foruth_first_img_style]}
          />
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[1]?.user_image}}
            style={[styles.foruth_two_img_style]}
          />
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[2]?.user_image}}
            style={[styles.foruth_three_img_style]}
          />
          <Animated.Image
            // entering={ZoomIn}
            // exiting={ZoomOut}
            source={{uri: sharedBy[3]?.user_image}}
            style={[styles.foruth_four_img_style]}
          />
        </View>
      )}
    </View>
  );
};

export default UserImages;

const styles = StyleSheet.create({
  //   renderProfileViewContainer: {
  //     height: '35%',
  //   },
  // styles of dynamic profiles picture rounder image
  // one profile image
  firstProfileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 33,
  },
  firstProfileImgStyle: {
    height: 132,
    width: 132,
    borderRadius: 132,
    resizeMode: 'cover',
  },
  // two profile image
  secondProfileContainer: {
    width: 172,
    height: 152,
    alignSelf: 'center',
    marginBottom: 45,
  },
  second_first_img_style: {
    height: 80,
    width: 80,
    borderRadius: 80,
    resizeMode: 'cover',
    zIndex: 1,
  },
  second_two_img_style: {
    height: 104,
    width: 104,
    borderRadius: 104,
    resizeMode: 'cover',
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center',
    right: 0,
    bottom: 0,
  },
  //third profile view
  thirdProfileContainer: {
    height: 181,
    width: 170,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 35,
    marginTop: 24,
  },
  third_first_img_style: {
    height: 80,
    width: 80,
    borderRadius: 80,
    resizeMode: 'cover',
    position: 'absolute',
  },
  third_two_img_style: {
    height: 80,
    width: 80,
    borderRadius: 80,
    resizeMode: 'cover',
    position: 'absolute',
    alignSelf: 'center',
    right: 0,
    bottom: 0,
  },
  third_three_img_style: {
    height: 90,
    width: 90,
    borderRadius: 90,
    resizeMode: 'cover',
    position: 'absolute',
    alignSelf: 'center',
    right: 0,
    top: 0,
  },
  //Foruth profile view
  ForuthProfileContainer: {
    height: 187,
    width: 205,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 53,
  },
  foruth_first_img_style: {
    height: 80,
    width: 80,
    borderRadius: 80,
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: 1,
    borderWidth: 1,
    left: 3,
    borderColor: colors.bgColor,
  },
  foruth_two_img_style: {
    height: 80,
    width: 80,
    borderRadius: 80,
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: 2,
    right: 10,
    borderWidth: 3,
    borderColor: colors.bgColor,
  },
  foruth_three_img_style: {
    height: 84,
    width: 84,
    borderRadius: 84,
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    top: 0,
    borderWidth: 3,
    borderColor: colors.bgColor,
  },
  foruth_four_img_style: {
    height: 84,
    width: 84,
    borderRadius: 84,
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: 3,
    alignSelf: 'center',
    bottom: 5,
    borderWidth: 3,
    borderColor: colors.bgColor,
  },
});
