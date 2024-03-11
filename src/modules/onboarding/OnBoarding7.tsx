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
import {fonts} from 'src/common/fonts';
import TypeWritterText from 'src/components/TypeWritterText';

const WIDTH = Dimensions.get('window').width;

const OnBoarding7 = ({navigation}: any) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const opacityValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const scaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const translateYValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const startAnimating = useCallback(() => {
    Animated.timing(
      scaleValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 300, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
    Animated.timing(
      opacityValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 800, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
    Animated.timing(
      translateYValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 500, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
  }, [opacityValue, scaleValue, translateYValue]);

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

  const translateY = translateYValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1000, 0],
  });

  const onContinue = () => {
    navigation.navigate('CreateAccStart');
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityValue,
          },
        ]}>
        <TypeWritterText
          text="Decide who gets to reveal your response..."
          style={styles.gradientText1}
        />
        <Animated.Image
          onLoadEnd={onImageLoaded}
          source={require('src/assets/images/onboarding/7.png')}
          style={[
            styles.gradientImage,
            {
              transform: [
                {
                  translateY: translateY,
                },
                {
                  scale: scaleValue,
                },
              ],
            },
          ]}
        />
      </Animated.View>
      <GradientButton style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </GradientButton>
    </View>
  );
};

export default OnBoarding7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 32,
    paddingBottom: 65,
  },
  content: {
    flex: 1,
  },
  gradientText1: {
    fontSize: 24,
    fontFamily: fonts.SF_ROUNDED_MEDIUM,
    marginHorizontal: 20,
  },
  gradientImage: {
    width: WIDTH,
    height: '75%',
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
