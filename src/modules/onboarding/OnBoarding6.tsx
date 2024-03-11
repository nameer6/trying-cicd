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

const OnBoarding5 = ({navigation}: any) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const opacityValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const skewValue = useMemo(() => {
    return new Animated.Value(1);
  }, []);

  const startAnimating = useCallback(() => {
    Animated.timing(
      opacityValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 800, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
    Animated.timing(
      skewValue, // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 1 (opaque)
        duration: 150, // Make it take a while
        useNativeDriver: false,
      },
    ).start(() => {
      Animated.timing(
        skewValue, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 200, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        Animated.timing(
          skewValue, // The animated value to drive
          {
            toValue: 0, // Animate to opacity: 1 (opaque)
            duration: 100, // Make it take a while
            useNativeDriver: false,
          },
        ).start(() => {
          Animated.timing(
            skewValue, // The animated value to drive
            {
              toValue: 1, // Animate to opacity: 1 (opaque)
              duration: 100, // Make it take a while
              useNativeDriver: false,
            },
          ).start();
        });
      });
    });
  }, [opacityValue, skewValue]);

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

  const skew = skewValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const onContinue = () => {
    navigation.navigate('OnBoarding7');
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
          duration={30}
        />

        <Animated.Image
          onLoadEnd={onImageLoaded}
          source={require('src/assets/images/onboarding/6.png')}
          style={[
            styles.gradientImage,
            {
              opacity: opacityValue,
            },
            {
              transform: [
                {
                  skewY: skew,
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

export default OnBoarding5;

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
    height: '80%',
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
