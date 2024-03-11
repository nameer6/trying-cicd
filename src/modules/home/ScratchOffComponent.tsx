import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import MaskedView, {
  Svg,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const ScratchOffComponent = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 3000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Svg height="100%" width="100%">
            <Rect x="0" y="0" width="100%" height="100%" fill="black" />
          </Svg>
        }>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="white" stopOpacity="0" />
              <Stop offset={animatedValue} stopColor="white" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" />
        </Svg>
        <View style={styles.content}>
          {/* Your content goes here */}
          <Text>Scratch me!</Text>
        </View>
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'red',
    height: 200,
  },
  maskedView: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default ScratchOffComponent;
