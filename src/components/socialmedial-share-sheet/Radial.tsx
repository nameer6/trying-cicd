import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Rect, Defs, RadialGradient, Stop} from 'react-native-svg';

const Radial = () => {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%">
            <Stop offset="100%" stopColor="#000" stopOpacity="1" />
            <Stop offset="80%" stopColor="#403b3b" stopOpacity="1" />
            <Stop offset="20%" stopColor="#0d0e0f" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect
          x="0%" // Adjust as needed
          y="0%" // Adjust as needed
          width="100%" // Adjust as needed
          height="100%" // Adjust as needed
          rx="0" // Border radius, adjust as needed
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
});

export default Radial;
