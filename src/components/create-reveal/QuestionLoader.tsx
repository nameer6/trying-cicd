import {useCallback, useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {fonts} from 'src/common/fonts';

const QUESTION = 'Something I’ve never told someone is...';

const QuestionLoader = () => {
  const [questionText, setQuestionText] = useState<string>('');

  const animateText = useCallback(async () => {
    for (let i = 0; i <= QUESTION.length; i++) {
      setQuestionText(QUESTION.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 1000 / QUESTION.length));
      if (i === QUESTION.length) {
        await setQuestionText('');
        animateText();
      }
    }
  }, []);

  useEffect(() => {
    animateText();
  }, [animateText]);
  return (
    <View>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={8}
        blurRadius={10}
        reducedTransparencyFallbackColor="white"
      />
      <Text style={styles.textStyle}>{questionText}</Text>
    </View>
  );
};

export default QuestionLoader;

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 99,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  textStyle: {
    fontSize: 30,
    marginLeft: 37,
    marginRight: 16,
    fontFamily: fonts.HELVETICA_MEDIUM,
    minHeight: 80,
  },
});
