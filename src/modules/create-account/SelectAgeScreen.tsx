import {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Animated,
  View,
  Platform,
} from 'react-native';
import WheelPicker from './WheelPicker';
import {useDispatch} from 'react-redux';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import {setUser} from 'src/store/reducers/auth';
import AgePicker from 'src/components/AgePicker';
import AuthBackHeader from 'src/components/AuthBackHeader';
import GradientButton from 'src/components/GradientButton';

const WIDTH = Dimensions.get('window').width;

const SelectAgeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [selectedAge, setAge] = useState<number>(17);

  const bgScaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const scaleValue = useMemo(() => {
    return new Animated.Value(0);
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
  }, [bgScaleValue, scaleValue]);

  const onSelectAge = async (age: number) => {
    setAge(age);
    await dispatch(
      setUser({
        age,
      }),
    );
  };

  const onContinue = async () => {
    await dispatch(
      setUser({
        age: selectedAge,
      }),
    );
    navigation.navigate('PermissionScreen');
  };

  return (
    <View style={styles.container}>
      <AuthBackHeader />
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
      <View>
        <Text style={styles.ageInfoTextStyle}>
          By entering your age you agree to our Terms and Privacy Policy
        </Text>
        <Text style={styles.selectedAgeStyle}>{selectedAge}</Text>
        {Platform.OS === 'ios' ? (
          <AgePicker selectedAge={selectedAge} onValueChange={onSelectAge} />
        ) : (
          <WheelPicker selectedAge={selectedAge} onSelectAge={onSelectAge} />
        )}
        <GradientButton style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Next</Text>
        </GradientButton>
      </View>
    </View>
  );
};

export default SelectAgeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 32,
    paddingBottom: 65,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shadowImage: {
    position: 'absolute',
  },
  logo: {
    height: '80%',
    width: 135,
    resizeMode: 'contain',
  },
  ageInfoTextStyle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 40,
    fontWeight: '600',
  },
  selectedAgeStyle: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 40,
    fontFamily: fonts.SF_REGULAR,
    marginTop: 24,
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
});
