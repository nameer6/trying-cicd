import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Modal,
  View,
  Pressable,
  ImageBackground,
  ScrollView,
  Animated,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import ComposeHeader from './ComposeHeader';
import ComoseModalRevealHeader from './ComoseModalRevealHeader';
import TransparentInput from 'src/components/TransparentInput';
import MicIcon from 'src/assets/icons/mic.svg';
import GradientButton from 'src/components/GradientButton';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import Recorder from './Recorder';
import {styles} from './compose-reveal.styles';
import {BackgroundGradient} from './BackgroundGradient';

const WIDTH = Dimensions.get('window').width;

type Props = {
  show: boolean;
  onClose: () => void;
  handleShare: (answer_id: string) => void;
  refreshQuestion: () => void;
};

const ComposeReveal = ({
  show,
  onClose,
  handleShare,
  refreshQuestion,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const fontAnimatedValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const [answer, setAnswer] = useState<string>('');
  const {create_reveal_state} = useSelector((state: any) => state.createReveal);
  const [showRecorder, setShowRecorder] = useState<boolean>(false);

  const animateZoomOutQuestion = useCallback(() => {
    Animated.timing(
      fontAnimatedValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 200, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
  }, [fontAnimatedValue]);

  const animateZoomInQuestion = useCallback(() => {
    Animated.timing(
      fontAnimatedValue, // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 1 (opaque)
        duration: 200, // Make it take a while
        useNativeDriver: false,
      },
    ).start();
  }, [fontAnimatedValue]);

  const handleClearInput = () => {
    setAnswer('');
  };

  useEffect(() => {
    if (answer?.length > 40) {
      animateZoomOutQuestion();
    } else {
      animateZoomInQuestion();
    }
  }, [animateZoomInQuestion, animateZoomOutQuestion, answer]);

  const fontSize = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 22],
  });
  const questionLeftMargin = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 20],
  });
  const answerBoxMarginTop = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });
  const headerHeight = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 16],
  });
  const headerOpacity = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const questionOpacity = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const handleSubmitAnswer = (data: {uploadUrl: string; duration: number}) => {
    setLoading(true);
    const audio_url = data?.uploadUrl;
    const duration = data?.duration;
    const payload: any = {
      question_id: create_reveal_state?.questionToReveal?.question_id,
      answer_text: answer,
    };
    if (typeof audio_url === 'string' && audio_url) {
      delete payload.answer_text;
      payload.answer_audio_url = audio_url;
      payload.answer_audio_duration = duration;
    }
    reveals
      .saveReveal(payload)
      .then(res => {
        console.log('save reveal res: ' + JSON.stringify(res));
        setLoading(false);
        if (res?.status) {
          triggerHapticFeedback('rigid');
          Keyboard.dismiss();
          const answer_id = res?.data?.answer_id;
          handleShare(answer_id);
          refreshQuestion();
          handleClose();
        } else {
          console.log('compose reveal error: ' + JSON.stringify(res?.message));
          showErrorToast(res?.message + '');
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('compose reveal server error: ' + JSON.stringify(error));
        showErrorToast(error + '');
      });
  };

  const submitAudio = (data: {uploadUrl: string; duration: number}) => {
    handleSubmitAnswer(data);
  };

  const handleClose = () => {
    setAnswer('');
    setShowRecorder(false);
    onClose();
  };

  const toggleRecorder = () => {
    if (!showRecorder) {
      animateZoomOutQuestion();
    } else {
      animateZoomInQuestion();
    }
    setShowRecorder(prev => !prev);
  };

  useEffect(() => {
    if (show) {
      animateZoomInQuestion();
    }
  }, [animateZoomInQuestion, show]);

  const [contentHeight, setContentHeight] = useState(0);

  const onContentLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const scrollViewRef = useRef(null);

  const onInputContentSizeChanged = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={styles.centeredView}>
        <KeyboardAvoidingView
          style={styles.modalView}
          behavior="padding"
          keyboardVerticalOffset={40}>
          <ScrollView keyboardShouldPersistTaps={'handled'} ref={scrollViewRef}>
            <ComoseModalRevealHeader
              answer={answer}
              onClose={handleClose}
              onClear={handleClearInput}
            />

            <View style={styles.outerBg}>
              <BackgroundGradient
                height={contentHeight}
                width={WIDTH}
                type="blue"
              />
              <ImageBackground
                onLayout={onContentLayout}
                source={require('src/assets/images/compose-gradient-bg.png')}
                style={styles.innerBg}
                imageStyle={styles.container}>
                <Animated.View
                  style={{
                    maxHeight: headerHeight,
                    overflow: 'hidden',
                    opacity: headerOpacity,
                  }}>
                  <ComposeHeader />
                </Animated.View>
                <Animated.Text
                  style={[
                    styles.question,
                    {
                      fontSize: fontSize,
                      marginLeft: questionLeftMargin,
                      opacity: questionOpacity,
                    },
                  ]}>
                  {create_reveal_state?.questionToReveal?.question_text}
                </Animated.Text>
                {!showRecorder && (
                  <Animated.View
                    style={[
                      styles.answerBox,
                      {
                        marginTop: answerBoxMarginTop,
                        paddingLeft: questionLeftMargin,
                      },
                    ]}>
                    <TransparentInput
                      value={answer}
                      placeholder="Type Answer..."
                      style={styles.answerInput}
                      multiline
                      onChangeText={setAnswer}
                      autoFocus
                      placeholderTextColor="rgba(72, 72, 72, 0.66)"
                      onContentSizeChange={onInputContentSizeChanged}
                    />
                    {!answer ? (
                      <Pressable
                        style={styles.sendButton}
                        onPress={toggleRecorder}>
                        <MicIcon fill="#fff" />
                      </Pressable>
                    ) : (
                      <GradientButton
                        onPress={handleSubmitAnswer}
                        style={styles.sendButton}
                        disabled={loading}
                        secondColorOffset="0.4">
                        {!loading ? (
                          <Feather name="arrow-up" color="#000" size={30} />
                        ) : (
                          <ActivityIndicator color="#fff" />
                        )}
                      </GradientButton>
                    )}
                  </Animated.View>
                )}
                {!!showRecorder && (
                  <Recorder
                    onClose={toggleRecorder}
                    handleSubmit={submitAudio}
                  />
                )}
              </ImageBackground>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ComposeReveal;
