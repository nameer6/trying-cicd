import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import GradientText from './GradientText';

type Props = {
  text: string;
  style?: any;
  textStyle?: any;
  duration?: number;
  textColors?: string[];
  delay?: number; // In miliseconds
  loading?: boolean;
};
const TypeWritterText = ({
  text,
  style,
  duration,
  textColors,
  textStyle,
  delay = 0,
  loading = false,
}: Props) => {
  const [banner1Text, setBanner1Text] = useState<string>('');
  const animateText1 = useCallback(async () => {
    for (let i = 0; i <= text.length; i++) {
      setBanner1Text(text.substring(0, i));
      await new Promise(resolve =>
        setTimeout(resolve, duration ? duration : 800 / text.length),
      );
    }
  }, [duration, text]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        animateText1();
      }, delay);
    }
  }, [animateText1, delay, loading]);

  return (
    <View style={style}>
      <GradientText
        colors={
          textColors || [colors.gradientGreenColor, colors.gradientLimeColor]
        }
        style={[styles.gradientText, textStyle]}>
        {banner1Text}
      </GradientText>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientText: {
    fontSize: 24,
    fontFamily: fonts.SF_ROUNDED_MEDIUM,
    minHeight: 60,
  },
});

export default TypeWritterText;
