import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Animated,
  InteractionManager,
} from 'react-native';
import {colors} from 'src/common/colors';
import GradientText from 'src/components/GradientText';
import GradientButton from 'src/components/GradientButton';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

const OnBoarding1 = ({navigation}: any) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const opacityValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const scaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const degreeValue = useMemo(() => {
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
      degreeValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 300, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
  }, [degreeValue, opacityValue, scaleValue]);

  useEffect(() => {
    if (imageLoaded) {
      InteractionManager.runAfterInteractions(() => {
        startAnimating();
      });
    }
  }, [imageLoaded, startAnimating]);

  const onImageLoaded = () => {
    setImageLoaded(true);
  };

  const degree = degreeValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['40deg', '0deg'],
  });

  const onContinue = () => {
    navigation.navigate('OnBoarding2');
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Animated.View
          style={{
            opacity: opacityValue,
          }}>
          <GradientText
            colors={[colors.gradientGreenColor, colors.gradientLimeColor]}
            style={styles.gradientText1}>
            On Reveal - you answer
          </GradientText>
          <GradientText
            colors={[colors.gradientGreenColor, colors.gradientLimeColor]}
            style={styles.gradientText1}>
            questions then decide who gets
          </GradientText>
          <GradientText
            colors={[colors.gradientGreenColor, colors.gradientLimeColor]}
            style={styles.gradientText1}>
            to reveal your response.
          </GradientText>
          <GradientText
            start={{x: 0, y: 1}}
            end={{x: 0.7, y: 0.7}}
            colors={[colors.gradientGreenColor, colors.gradientLimeColor]}
            style={styles.gradientText2}>
            You can go deep....
          </GradientText>
        </Animated.View>
        <Animated.Image
          onLoadEnd={onImageLoaded}
          source={require('src/assets/images/onboarding/image.png')}
          style={[
            styles.gradientImage,
            {
              transform: [
                {
                  rotate: degree,
                },
                {
                  scale: scaleValue,
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

export default OnBoarding1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 32,
    paddingBottom: 65,
  },
  gradientText1: {
    fontSize: 24,
    fontFamily: fonts.SF_ROUNDED_MEDIUM,
    marginHorizontal: 20,
  },
  gradientText2: {
    fontSize: 24,
    fontFamily: fonts.SF_ROUNDED_MEDIUM,
    marginTop: 100,
    marginHorizontal: 20,
  },
  gradientImage: {
    width: WIDTH,
    height: 400,
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
