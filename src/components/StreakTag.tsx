import {View, Text, StyleSheet} from 'react-native';
import GradientText from './GradientText';
import {colors} from 'src/common/colors';
import {getStrekTextEmoji} from 'src/helpers/mics';

type Props = {
  days: number;
  style?: any;
};

const StreakTag = ({days, style}: Props) => {
  return (
    <View style={[styles.streakView, style]}>
      <GradientText
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        colors={[colors.gradientGreenColor, colors.gradientLimeColor]}>
        <Text style={styles.streakTextStyle}>
          {getStrekTextEmoji(days)?.duration}
        </Text>
      </GradientText>
      <Text style={[styles.streakTextStyle, styles.emojiStyle]}>
        {getStrekTextEmoji(days)?.emoji}
      </Text>
    </View>
  );
};

export default StreakTag;

const styles = StyleSheet.create({
  streakView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    marginTop: 2,
  },
  streakTextStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emojiStyle: {
    marginBottom: 2,
  },
});
