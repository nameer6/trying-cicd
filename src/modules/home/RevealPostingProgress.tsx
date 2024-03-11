import {StyleSheet, Text, View} from 'react-native';
import GradientButton from 'src/components/GradientButton';
import Feather from 'react-native-vector-icons/Feather';
import GradientText from 'src/components/GradientText';
import {colors} from 'src/common/colors';
import GradientCircularProgressBar from './GradientCircularProgressBar';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  ZoomIn,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import {updateRevealToPost} from 'src/store/reducers/createReveal';
import {useQueryClient} from '@tanstack/react-query';
import Svg, {Path} from 'react-native-svg';

type Props = {
  unLockedReveals?: any;
};

const RevealPostingProgress = React.memo(({unLockedReveals}: Props) => {
  const [apiprogress, setApiProgress] = useState<number>(0);
  const [totalUnlocked, setTotalUnlocked] = useState<number>(0);
  const {revealToPost} = useSelector((state: any) => state.createReveal);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const intervalRef = useRef<any>(null);

  const statrtAnimating = () => {
    intervalRef.current = setInterval(() => {
      setApiProgress(prev => (prev < 95 ? prev + 5 : 95));
    }, 100);
  };
  useEffect(() => {
    if (apiprogress === 95) {
      clearInterval(intervalRef?.current);
    }
  }, [apiprogress]);

  const translateY = useSharedValue(-120);
  const height = useSharedValue(0);
  const marginTop = useSharedValue(30);

  const slideDown = () => {
    translateY.value = 0;
    height.value = 100;
    marginTop.value = 36;
  };

  const slideUp = () => {
    // translateY.value = withSpring(-100, {damping: 50, stiffness: 70});
    translateY.value = withTiming(-120, {duration: 500});
    height.value = withTiming(0, {duration: 500});
    marginTop.value = withTiming(24, {duration: 500});
  };

  const uploadPost = useCallback(async () => {
    slideDown();
    statrtAnimating();
    reveals
      .shareReveal(revealToPost)
      .then(async res => {
        console.log('Share reveal DATA: ' + JSON.stringify(res));
        if (res?.status) {
          setTotalUnlocked(res?.data?.total_unlocked_reveals);
          await clearInterval(intervalRef.current);
          setTimeout(() => {
            setApiProgress(100);
          }, 500);
          setTimeout(() => {
            setApiProgress(101);
            queryClient.invalidateQueries(['get-locked-reveals'] as never);
            queryClient.invalidateQueries(['get-reveals'] as never);
            triggerHapticFeedback();
            clearInterval(intervalRef.current);
          }, 1500);
          setTimeout(() => {
            slideUp();
            dispatch(updateRevealToPost(null));
          }, 3700);
          setTimeout(() => {
            setApiProgress(0);
          }, 4200);
          // setTimeout(() => {
          //   slideUp();
          // }, 2700);
        }
      })
      .catch(err => {
        setApiProgress(0);
        showErrorToast(err + '');
        setTimeout(() => {
          slideUp();
        }, 4700);
      });
  }, [dispatch, queryClient, revealToPost]);

  useEffect(() => {
    if (revealToPost) {
      setTimeout(() => {
        uploadPost();
      }, 500);
    }
  }, [revealToPost, uploadPost]);

  useEffect(() => {
    return () => {
      setApiProgress(0);
      clearInterval(intervalRef.current);
    };
  }, []);

  // if (!revealToPost) {
  //   return null;
  // }

  return (
    <Animated.View
      style={[
        styles.progressStatusContainer,
        {
          transform: [{translateY: translateY}],
          maxHeight: height,
          overflow: 'hidden',
          marginTop,
        },
      ]}>
      <View style={styles.roundBtnContainer}>
        {apiprogress !== 101 && (
          <GradientCircularProgressBar
            progress={apiprogress}
            size={50}
            strokeWidth={2}
            colors={[colors.gradientGreenColor, colors.gradientLimeColor]}
          />
        )}
        {apiprogress === 101 && (
          <GradientButton
            style={styles.progressSuccessRoundView}
            secondColorOffset="0.4">
            <Animated.View entering={ZoomIn}>
              {totalUnlocked > 0 ? (
                <Svg width="30" height="30" viewBox="0 0 25 24" fill="none">
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.033 3.81123C10.6153 3.87196 10.2138 4.01473 9.85149 4.23132C9.4892 4.4479 9.17334 4.73401 8.9221 5.07319C8.67086 5.41236 8.4892 5.79788 8.38758 6.20756C8.28597 6.61723 8.26641 7.04296 8.33002 7.46023L8.36002 7.66323C8.40002 7.91623 8.46602 8.16323 8.55902 8.40123L9.47402 10.7432C11.6633 10.5945 13.8606 10.6076 16.048 10.7822L17.544 10.9022C18.0143 10.9398 18.4585 11.1339 18.8056 11.4535C19.1527 11.773 19.3827 12.1996 19.459 12.6652C19.8206 14.8739 19.8206 17.1266 19.459 19.3352C19.383 19.801 19.153 20.2279 18.8059 20.5476C18.4587 20.8674 18.0145 21.0616 17.544 21.0992L16.048 21.2192C13.6858 21.4077 11.3123 21.4077 8.95002 21.2192L7.45402 21.0992C6.98358 21.0616 6.53931 20.8674 6.19219 20.5476C5.84506 20.2279 5.6151 19.801 5.53902 19.3352C5.17742 17.1266 5.17742 14.8739 5.53902 12.6652C5.61494 12.1991 5.84496 11.7719 6.19231 11.4519C6.53965 11.132 6.98425 10.9377 7.45502 10.9002L7.91202 10.8642L7.16202 8.94623C7.02941 8.60569 6.93484 8.25154 6.88002 7.89023L6.84902 7.68623C6.67507 6.54287 6.92879 5.37551 7.56162 4.4075C8.19446 3.43949 9.16198 2.73879 10.2791 2.43945C11.3962 2.14012 12.5845 2.26318 13.6165 2.78508C14.6486 3.30698 15.452 4.19108 15.873 5.26823L15.948 5.46123C16.081 5.80123 16.176 6.15623 16.231 6.51823L16.372 7.44623C16.382 7.51117 16.379 7.57744 16.3633 7.64124C16.3477 7.70504 16.3196 7.76513 16.2807 7.81807C16.2417 7.871 16.1928 7.91575 16.1366 7.94975C16.0803 7.98375 16.018 8.00634 15.953 8.01623L15.459 8.09123C15.3941 8.10118 15.3278 8.09823 15.264 8.08255C15.2002 8.06687 15.1401 8.03877 15.0872 7.99986C15.0343 7.96095 14.9895 7.91198 14.9555 7.85577C14.9215 7.79955 14.8989 7.73718 14.889 7.67223L14.749 6.74423C14.7105 6.49167 14.6441 6.24416 14.551 6.00623L14.476 5.81423C14.2129 5.14073 13.7294 4.57621 13.1043 4.21266C12.4793 3.84911 11.7496 3.70796 11.034 3.81223L11.033 3.81123Z"
                    fill="#000"
                  />
                </Svg>
              ) : (
                <Feather name="arrow-up" color="#000" size={30} />
              )}
            </Animated.View>
          </GradientButton>
        )}
      </View>
      <View style={styles.ProgressContentContainer}>
        {apiprogress !== 101 && (
          <View style={styles.revealSentContainer}>
            <Text style={styles.revealSentTextStyle}>Sending...</Text>
          </View>
        )}
        {apiprogress === 101 && (
          <View style={styles.revealSentContainer}>
            <Text style={styles.revealSentTextStyle}>Reveal sent!</Text>
            {!!totalUnlocked && (
              <GradientText>
                <Text style={styles.revealSentTextStyle}>
                  You unlocked {totalUnlocked} new reveal
                  {totalUnlocked > 1 ? 's' : ''}
                </Text>
              </GradientText>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
});

export default RevealPostingProgress;

const styles = StyleSheet.create({
  progressStatusContainer: {
    borderRadius: 44,
    backgroundColor: colors.sheetBgColor,
    flexDirection: 'row',
    marginHorizontal: 12,
    // marginTop: 24,
    // marginBottom: 20,
  },
  roundBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  ProgressContentContainer: {
    // flex: 2,
  },
  progressSuccessRoundView: {
    height: 48,
    width: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealSentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  revealSentTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  revealContentTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  revealSentTitleTextStyle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
