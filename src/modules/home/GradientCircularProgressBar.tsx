import {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Defs, LinearGradient, Stop, Svg, Circle} from 'react-native-svg';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface GradientCircularProgressBarProps {
  progress?: number; // Make progress prop optional
  size: number;
  strokeWidth: number;
  colors: string[];
}

const GradientCircularProgressBar = ({
  progress = 0,
  size,
  strokeWidth,
  colors,
}: GradientCircularProgressBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue<number>(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 500,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  }, [animatedProgress, progress]);

  const circleStyle = useAnimatedStyle(() => {
    const stokeDashoffset =
      circumference - (animatedProgress.value / 100) * circumference;
    return {
      strokeDashoffset: stokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {colors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index * 100) / (colors.length - 1)}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          style={circleStyle}
        />
      </Svg>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
});

export default GradientCircularProgressBar;
