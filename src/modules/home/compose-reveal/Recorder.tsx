import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import LottieView from 'lottie-react-native';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import GradientButton from 'src/components/GradientButton';
import {secondsToMMSS, triggerHapticFeedback} from 'src/helpers/mics';
import RecordingPlayer from './RecordingPlayer';
import {fonts} from 'src/common/fonts';

type Props = {
  onClose: () => void;
  handleSubmit: (data: {uploadUrl: string; duration: number}) => void;
};

const Recorder = ({onClose, handleSubmit}: Props) => {
  const intervalIdRef = useRef<any>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [recordedpath, setRecorderPath] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(true);

  const onStartRecord = useCallback(() => {
    triggerHapticFeedback();
    SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.mp4').then(
      function () {
        const startInterval = () => {
          intervalIdRef.current = setInterval(() => {
            setSeconds(prevCount => prevCount + 1);
          }, 1000); // Increment every 1000 milliseconds (1 second)
        };

        startInterval(); // Start the interval on mount

        console.log('started recording');
      },
    );
  }, []);

  const askMicPersmission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (grants === PermissionsAndroid.RESULTS.GRANTED) {
        onStartRecord();
      }
    } else {
      onStartRecord();
    }
  }, [onStartRecord]);

  useEffect(() => {
    askMicPersmission();
    return () => {
      SoundRecorder?.stop();
      clearInterval(intervalIdRef.current);
    };
  }, [askMicPersmission]);

  const onStopRecord = async () => {
    clearInterval(intervalIdRef.current);
    triggerHapticFeedback();
    setIsRecording(false);
    console.log('Seconds: ', seconds);
    SoundRecorder.stop().then(function (result: any) {
      //   uploadToApi(result.path);
      console.log('stopped recording, audio file saved at: ' + result.path);
      setRecorderPath(result.path);
    });
  };

  const onSubmit = (uploadUrl: string) => {
    handleSubmit({
      uploadUrl,
      duration: seconds,
    });
  };

  const duration = useMemo(() => {
    return secondsToMMSS(seconds);
  }, [seconds]);

  return (
    <ImageBackground
      source={require('src/assets/images/recorderBg.png')}
      imageStyle={styles.bgImageStyle}
      style={styles.container}>
      {isRecording ? (
        <>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Icon name="close" color="#fff" size={24} />
          </Pressable>
          <View style={styles.waveContainer}>
            <LottieView
              style={{height: 40, width: '75%'}}
              source={require('src/assets/lottie/audio_wave.json')}
              autoPlay
              loop={true}
            />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
          <GradientButton
            onPress={onStopRecord}
            style={styles.sendButton}
            secondColorOffset="0.4">
            <Svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}>
              <Path
                d="M20 7L10 17L5 12"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
          </GradientButton>
        </>
      ) : (
        <RecordingPlayer
          soundUri={recordedpath}
          handleSubmit={onSubmit}
          durationSeconds={seconds}
        />
      )}
    </ImageBackground>
  );
};

export default Recorder;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginHorizontal: 24,
    marginTop: 132,
    borderRadius: 45,
    resizeMode: 'cover',
    padding: 10,
    paddingRight: 20,
    marginBottom: 28,
  },
  bgImageStyle: {
    borderRadius: 45,
  },
  closeButton: {
    backgroundColor: '#33363F',
    height: 46,
    width: 46,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    height: 44,
    width: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '65%',
  },
  waveImage: {
    fill: '#000',
    width: '75%',
  },
  durationText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: fonts.SF_REGULAR,
  },
});
