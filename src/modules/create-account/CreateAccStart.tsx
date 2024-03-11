import {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Animated,
  View,
  TouchableOpacity,
} from 'react-native';
import {colors} from 'src/common/colors';
import GradientText from 'src/components/GradientText';
import GradientButton from 'src/components/GradientButton';
import {fonts} from 'src/common/fonts';
import BounceButton from 'src/components/BounceButton';

const WIDTH = Dimensions.get('window').width;

const BANNER1_TEXT = 'Now, it’s your turn to send your \nfirst Reveal...';

const CreateAccStart = ({navigation}: any) => {
  const [banner1Text, setBanner1Text] = useState<string>('');
  const opacityValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const bgScaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const scaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const translateYValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const animateText1 = async () => {
    for (let i = 0; i <= BANNER1_TEXT.length; i++) {
      setBanner1Text(BANNER1_TEXT.substring(0, i));
      await new Promise(resolve =>
        setTimeout(resolve, 500 / BANNER1_TEXT.length),
      );
    }
  };

  useEffect(() => {
    animateText1();
  }, []);

  useEffect(() => {
    Animated.timing(
      bgScaleValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 700, // Make it take a while
        useNativeDriver: true,
      },
    ).start(() => {
      Animated.timing(
        scaleValue, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 1000, // Make it take a while
          useNativeDriver: true,
        },
      ).start();
    });
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
  }, [scaleValue, translateYValue, opacityValue]);

  const onContinue = () => {
    navigation.navigate('SelectAgeScreen');
  };

  const onLogin = () => {
    navigation.navigate('PhoneNumberScreen');
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
        <GradientText
          colors={[colors.gradientGreenColor, colors.gradientLimeColor]}
          style={styles.gradientText1}>
          {banner1Text}
        </GradientText>
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('src/assets/images/green-shadow-bg.png')}
            style={[
              styles.shadowImage,
              {
                opacity: bgScaleValue,
              },
              {
                transform: [
                  {
                    scale: bgScaleValue,
                  },
                ],
              },
            ]}
          />
          <Animated.Image
            source={require('src/assets/images/Reveal.png')}
            style={[
              styles.logo,
              {
                opacity: scaleValue,
              },
              {
                transform: [
                  {
                    scale: scaleValue,
                  },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>
      <BounceButton style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </BounceButton>
      <GradientButton style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Create Account</Text>
      </GradientButton>
    </View>
  );
};

export default CreateAccStart;

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
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowImage: {
    position: 'absolute',
  },
  gradientText1: {
    fontSize: 24,
    fontFamily: fonts.SF_ROUNDED_MEDIUM,
    marginHorizontal: 20,
    minHeight: 60,
  },
  logo: {
    height: '100%',
    width: 135,
    resizeMode: 'contain',
  },
  button: {
    width: WIDTH - 78,
    height: 57,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#33363F',
  },
  loginButton: {
    width: WIDTH - 78,
    height: 57,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    borderColor: '#979797',
    borderWidth: 1,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8D8D8D',
  },
});
