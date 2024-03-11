import {useEffect, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  InteractionManager,
  View,
} from 'react-native';
import {colors} from 'src/common/colors';
import GradientButton from 'src/components/GradientButton';
import LottieView from 'lottie-react-native';
import TypeWritterText from 'src/components/TypeWritterText';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const OnBoarding5 = ({navigation}: any) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      ref?.current?.play();
    });
  }, []);

  const onContinue = () => {
    navigation.navigate('OnBoarding6');
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={ref}
        style={styles.lottieStyle}
        source={require('src/assets/lottie/flow-5.json')}
        loop={false}
        autoPlay={false}
      />

      <TypeWritterText
        text="Decide who gets to reveal your response..."
        style={styles.gradientText1}
      />

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
    // paddingTop: 32,
    // paddingBottom: 65,
  },
  content: {
    flex: 1,
  },
  gradientText1: {
    position: 'absolute',
    top: 22,
    zIndex: 99,
    maxWidth: '89%',
    marginHorizontal: 20,
    minHeight: 60,
  },
  button: {
    width: WIDTH - 78,
    height: 57,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    position: 'absolute',
    bottom: 60,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#33363F',
  },
  lottieStyle: {
    height: HEIGHT - 100,
    width: WIDTH,
  },
});
