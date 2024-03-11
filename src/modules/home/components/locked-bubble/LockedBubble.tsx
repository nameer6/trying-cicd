import {useCallback, useEffect, useMemo} from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import UserImages from './UserImages';
import Entypo from 'react-native-vector-icons/Entypo';
import {styles} from './styles';
import {RevealTimelineType, SharedByType} from 'src/helpers/types/reveal.types';
import BounceButton from 'src/components/BounceButton';

type Props = {
  onPress: () => void;
  lockedData: RevealTimelineType[];
};

const LockedBubble = ({lockedData, onPress}: Props) => {
  const offset = useSharedValue(500);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
    opacity: offset.value === 500 ? 0 : 1,
  }));

  useEffect(() => {
    offset.value = withSpring(1, {
      mass: 1,
      damping: 12,
      stiffness: 106,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    });
  }, [offset]);

  const renderProfileName = useMemo(() => {
    if (lockedData?.length > 0) {
      const sharedBy: SharedByType[] = lockedData?.map(item => item.shared_by);
      const uniqueSharedBy: SharedByType[] = sharedBy?.filter(
        (obj, index, self) =>
          index === self.findIndex(item => item.user_id === obj.user_id),
      );
      let prefix1 = uniqueSharedBy[0]?.full_name;
      let prefix2 = '';
      if (uniqueSharedBy?.length > 1) {
        prefix2 = '';
      }
      if (uniqueSharedBy?.length === 2) {
        prefix2 = uniqueSharedBy[1]?.full_name;
      }
      const othersCount = uniqueSharedBy?.length;
      const suffix = ' revealed to you';
      return (
        <Text>
          <Text style={styles.usernameBoldStyle}>{prefix1}</Text>
          {uniqueSharedBy?.length > 1 && (
            <Text style={styles.usernameMediumStyle}> and </Text>
          )}
          {!!prefix2 && <Text style={styles.usernameBoldStyle}>{prefix2}</Text>}
          {othersCount > 2 && (
            <Text style={styles.usernameBoldStyle}>
              {othersCount - 1} others
            </Text>
          )}
          <Text style={styles.usernameMediumStyle}>{suffix}</Text>
        </Text>
      );
    } else {
      return null;
    }
  }, [lockedData]);

  return (
    <>
      <Animated.View style={animatedStyles}>
        <ImageBackground
          source={require('src/assets/images/lockedBubbleBg.png')}
          style={styles.buttonBg}
          imageStyle={styles.buttonBgImage}>
          <TouchableOpacity style={styles.revealButton} onPress={onPress}>
            {lockedData && <UserImages lockedData={lockedData} />}
            <View style={styles.userDetailsStyle}>
              {renderProfileName}
              <View style={styles.revealToSeeStyle}>
                <Text style={styles.revealToSeeTextStyle}>
                  Reveal to see {lockedData?.length > 1 ? 'them' : 'it'}
                </Text>
                <Entypo
                  name="chevron-right"
                  size={18}
                  color="rgba(0, 0, 0, 0.35)"
                  style={styles.arrowIcon}
                />
              </View>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>
    </>
  );
};

export default LockedBubble;
