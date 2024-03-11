import {StyleSheet, View} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome6';

const CheckBox = ({
  isChecked,
  yellowOffset,
}: {
  isChecked: boolean;
  yellowOffset?: string;
}) => {
  if (!isChecked) {
    return <View style={styles.uncheckedBox} />;
  } else {
    return (
      <View style={styles.container}>
        <Svg height="32" width="32">
          <Defs>
            <LinearGradient
              id="grad"
              x1="0"
              y1="-2.57343"
              x2="52.1474"
              y2="34.0238"
              gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#00FFB3" />
              <Stop offset={yellowOffset || '1'} stopColor="#F0FF44" />
            </LinearGradient>
          </Defs>
          <Circle cx="16" cy="16" r="16" fill="url(#grad)" />
        </Svg>
        <Icon name="check" size={18} style={styles.checkIconStyle} />
      </View>
    );
  }
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  uncheckedBox: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderColor: '#727272',
    borderWidth: 2,
  },
  checkIconStyle: {
    position: 'absolute',
    top: 6.8,
    left: 7.4,
  },
});
