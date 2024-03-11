import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {fonts} from 'src/common/fonts';

type Props = {
  title?: string;
  rightComponent?: React.ReactNode;
  style?: any;
  translateY?: number;
};

const BackHeader = ({title, rightComponent, style, translateY}: Props) => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <Animated.View
      style={[
        styles.container,
        style,
        translateY && {
          transform: [{translateY: translateY}],
        },
      ]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBack}
        activeOpacity={0.99}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M16.62 2.99028C16.5039 2.87387 16.366 2.78152 16.2141 2.7185C16.0622 2.65548 15.8994 2.62305 15.735 2.62305C15.5706 2.62305 15.4078 2.65548 15.2559 2.7185C15.1041 2.78152 14.9661 2.87387 14.85 2.99028L6.54 11.3003C6.4473 11.3928 6.37375 11.5027 6.32357 11.6237C6.27339 11.7446 6.24756 11.8743 6.24756 12.0053C6.24756 12.1362 6.27339 12.2659 6.32357 12.3869C6.37375 12.5079 6.4473 12.6178 6.54 12.7103L14.85 21.0203C15.34 21.5103 16.13 21.5103 16.62 21.0203C17.11 20.5303 17.11 19.7403 16.62 19.2503L9.38 12.0003L16.63 4.75028C17.11 4.27028 17.11 3.47028 16.62 2.99028Z"
            fill="white"
          />
        </Svg>
      </TouchableOpacity>
      {!!title && <Text style={styles.titleStyle}>{title}</Text>}
      {!!rightComponent && (
        <View style={styles.rightComponent}>{rightComponent}</View>
      )}
    </Animated.View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
    zIndex: 9,
  },
  backButton: {
    position: 'absolute',
    left: 13,
  },
  titleStyle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
  },
  rightComponent: {
    position: 'absolute',
    right: 13,
  },
});
