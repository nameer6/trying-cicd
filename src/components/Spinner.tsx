import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';

interface SpinnerProps {
  loading: boolean;
  spinnerContainerStyle?: any;
}

const Spinner = ({loading, spinnerContainerStyle}: SpinnerProps) => {
  if (loading) {
    return (
      <View style={spinnerContainerStyle}>
        <View style={styles.loaderContainer}>
          <BlurView
            style={styles.blurView}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <ActivityIndicator style={styles.indicatorStyle} color="#fff" />
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export default Spinner;

const styles = StyleSheet.create({
  loaderContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: 68,
    width: 68,
    borderRadius: 15,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    height: 68,
    width: 68,
    borderRadius: 15,
  },
  indicatorStyle: {
    transform: [
      {
        scale: 1.4,
      },
    ],
  },
});
