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
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import ComposeHeader from './ComposeHeader';
import ComoseModalRevealHeader from './ComoseModalRevealHeader';
import MicIcon from 'src/assets/icons/mic.svg';
import GradientButton from 'src/components/GradientButton';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import Recorder from './Recorder';
import {styles} from './compose-reveal.styles';
import {BackgroundGradient} from './BackgroundGradient';
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {transparentSheetIndicatorStyle} from 'src/common/common-styles';
import {colors} from 'src/common/colors';
import useContacts from './useContacts';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  show: boolean;
  onClose: () => void;
  handleShare: (answer_id: string) => void;
  refreshQuestion: () => void;
  keyboardCount?: number;
};

const ComposeReveal = ({
  show,
  onClose,
  handleShare,
  refreshQuestion,
  keyboardCount = 0,
}: Props) => {
  useContacts(show);
  const [loading, setLoading] = useState<boolean>(false);
  const fontAnimatedValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);
  const [answer, setAnswer] = useState<string>('');
  const {create_reveal_state} = useSelector((state: any) => state.createReveal);
  const [showRecorder, setShowRecorder] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [answerId, setAnswerId] = useState<string | null>(null);

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
    inputRef?.current?.clear();
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

  const questionOpacity = fontAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const handleSubmitAnswer = (data: {uploadUrl: string; duration: number}) => {
    setLoading(true);
    triggerHapticFeedback();
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
    if (answerId) {
      payload.answer_id = answerId;
    }
    reveals
      .saveReveal(payload)
      .then(res => {
        console.log('save reveal res: ' + JSON.stringify(res));
        if (res?.status) {
          Keyboard.dismiss();
          const answer_id = res?.data?.answer_id;
          handleShare(answerId || answer_id);
          if (!answerId) {
            setAnswerId(answer_id);
          }
          // refreshQuestion();
          // handleClose();
          setShowRecorder(false);
        } else {
          console.log('compose reveal error: ' + JSON.stringify(res?.message));
          showErrorToast(res?.message + '');
        }
        setTimeout(() => {
          setLoading(false);
        }, 700);
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
    Keyboard.dismiss();
    setAnswer('');
    setShowRecorder(false);
    closeSheet();
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => bottomSheetRef.current?.close();

  useEffect(() => {
    if (show) {
      openSheet();
      inputRef?.current?.focus();
    } else {
      setAnswerId(null);
      closeSheet();
    }
  }, [show]);

  // Handlers
  const handleSheetChange = (index: number) => {
    if (index === -1) {
      setAnswerId(null);
      onClose();
    }
  };

  useEffect(() => {
    if (show && create_reveal_state?.questionToReveal?.question_text) {
      handleClearInput();
    }
  }, [create_reveal_state?.questionToReveal?.question_text, show]);

  const [keyboardHeight, setKeyboardHeight] = useState(320);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      event => {
        // `event.endCoordinates.height` will give you the keyboard height
        setKeyboardHeight(event.endCoordinates.height);
      },
    );
    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const onCategoryPopoupClosed = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    if (keyboardCount) {
      inputRef.current.focus();
    }
  }, [keyboardCount]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={['100%']}
      onChange={handleSheetChange}
      enablePanDownToClose={false}
      enableDismissOnClose={false}
      stackBehavior="push"
      // style={sheetShadowStyle}
      backgroundStyle={{
        backgroundColor: colors.bgColor,
      }}
      handleIndicatorStyle={transparentSheetIndicatorStyle}
      keyboardBehavior="extend"
      // backdropComponent={renderBackdrop}
    >
      <View style={styles.centeredView}>
        <KeyboardAvoidingView
          style={styles.modalView}
          // behavior="padding"
          keyboardVerticalOffset={0}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            scrollEnabled={false}
            ref={scrollViewRef}>
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
                style={[
                  styles.innerBg,
                  {
                    height: HEIGHT - keyboardHeight - 160,
                  },
                ]}
                imageStyle={[
                  styles.container,
                  // {borderWidth: 1, borderColor: 'red'},
                ]}>
                <View>
                  <ComposeHeader onClose={onCategoryPopoupClosed} />
                  <Animated.Text
                    style={[
                      styles.question,
                      {
                        fontSize: fontSize,
                        marginLeft: questionLeftMargin,
                        opacity: questionOpacity,
                      },
                    ]}>
                    {create_reveal_state?.questionToReveal?.question_text?.trim()}
                  </Animated.Text>
                </View>
                {!showRecorder && (
                  <Animated.View
                    style={[
                      styles.answerBox,
                      {
                        paddingLeft: questionLeftMargin,
                        flex: 2,
                      },
                    ]}>
                    <BottomSheetTextInput
                      ref={inputRef}
                      placeholder="Type Answer..."
                      style={[styles.answerInput]}
                      multiline
                      onChangeText={setAnswer}
                      autoFocus
                      placeholderTextColor="rgba(72, 72, 72, 0.66)"
                      onContentSizeChange={onInputContentSizeChanged}
                    />
                  </Animated.View>
                )}
                {!showRecorder ? (
                  answer?.trim() ? (
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
                  ) : (
                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={toggleRecorder}>
                      <MicIcon fill="#fff" />
                    </TouchableOpacity>
                  )
                ) : null}
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
    </BottomSheetModal>
  );
};

export default ComposeReveal;
