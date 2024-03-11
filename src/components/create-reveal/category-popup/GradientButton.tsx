import React, {useEffect, useMemo, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
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

  const bounceValue = useRef(new Animated.Value(1)).current;
  let timeoutId = useRef<any>(null);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceValue, {
        duration: 60,
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      onPress && onPress();
    }, 60);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <Animated.View
      style={[styles.buttonStyle, style, {transform: [{scale: bounceValue}]}]}>
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
      <TouchableOpacity
        activeOpacity={1}
        style={styles.catergoryItem}
        onPress={handlePress}
        disabled={isDisabled}>
        {loading ? <ActivityIndicator /> : children}
      </TouchableOpacity>
    </Animated.View>
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
  catergoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E5058',
    paddingHorizontal: 17,
    paddingVertical: 17,
    gap: 10,
    borderRadius: 28,
    flex: 1,
    margin: 2,
  },
});
