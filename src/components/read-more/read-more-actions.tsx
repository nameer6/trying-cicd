import {StyleSheet, Text} from 'react-native';
import BounceButton from '../BounceButton';

export const RenderViewMore = (onPress: any) => (
  <BounceButton onPress={onPress}>
    <Text style={styles.seeMoreTextStyle}>See more</Text>
  </BounceButton>
);
export const RenderViewLess = (onPress: any) => (
  <BounceButton onPress={onPress}>
    <Text style={styles.seeMoreTextStyle}>See less</Text>
  </BounceButton>
);

const styles = StyleSheet.create({
  seeMoreTextStyle: {
    color: 'rgba(0, 0, 0, 0.50)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 12,
    paddingVertical: 8,
  },
});
