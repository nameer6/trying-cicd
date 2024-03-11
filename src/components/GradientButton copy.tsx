import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Rect,
  LinearGradient as SvgLinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';
import {colors} from 'src/common/colors';

type Props = {
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  radius?: number;
  secondColorOffset?: string;
  colorsArray?: string[];
};

const WIDTH = Dimensions.get('window').width;

const GradientButton = ({
  style,
  children,
  onPress,
  disabled,
  loading,
  radius,
  secondColorOffset,
  colorsArray,
}: Props) => {
  const isDisabled = useMemo(() => {
    return loading || disabled;
  }, [loading, disabled]);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.buttonStyle, style]}
      onPress={onPress}
      disabled={isDisabled}>
      <Svg height={'100%'} width="100%" style={styles.background}>
        <Rect
          width="100%"
          height={'100%'}
          rx={radius || 28.5}
          fill="url(#paint0_linear_672_31649)"
        />
        <Defs>
          <SvgLinearGradient
            id="paint0_linear_672_31649"
            x1="-1.15741e-06"
            y1="-3.18881"
            x2="34.9654"
            y2="124.671"
            gradientUnits="userSpaceOnUse">
            <Stop
              stopColor={
                !isDisabled
                  ? colorsArray
                    ? colorsArray[0]
                    : colors.gradientGreenColor
                  : '#4B4F5D'
              }
            />
            <Stop
              offset={secondColorOffset || '1'}
              stopColor={
                !isDisabled
                  ? colorsArray
                    ? colorsArray[1]
                    : colors.gradientLimeColor
                  : '#4B4F5D'
              }
            />
          </SvgLinearGradient>
        </Defs>
      </Svg>
      {loading ? <ActivityIndicator /> : children}
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  buttonStyle: {
    width: WIDTH - 40,
    height: 57,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
  },
});
