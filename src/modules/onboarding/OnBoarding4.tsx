import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Animated,
  View,
  InteractionManager,
} from 'react-native';
import {colors} from 'src/common/colors';
import GradientButton from 'src/components/GradientButton';

const WIDTH = Dimensions.get('window').width;

const OnBoarding4 = ({navigation}: any) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const skewValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const startAnimating = useCallback(() => {
    Animated.timing(
      skewValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 650, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
  }, [skewValue]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (imageLoaded) {
        startAnimating();
      }
    });
  }, [imageLoaded, startAnimating]);

  const onImageLoaded = () => {
    setImageLoaded(true);
  };

  const translateY = skewValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1000, 0],
  });
  // const skew = skewValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['10deg', '0deg'],
  // });

  const onContinue = () => {
    navigation.navigate('OnBoarding5');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image
          onLoadEnd={onImageLoaded}
          source={require('src/assets/images/onboarding/4.png')}
          style={[
            styles.gradientImage,
            {
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        />
      </View>
      <GradientButton style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </GradientButton>
    </View>
  );
};

export default OnBoarding4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 32,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
  },
  gradientImage: {
    width: WIDTH,
    height: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  button: {
    width: WIDTH - 78,
    height: 57,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#33363F',
  },
});
