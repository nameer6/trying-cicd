import {useMemo, useRef, useState} from 'react';
import {View, Pressable, StyleSheet, Text} from 'react-native';
import Sound from 'react-native-sound';
import PlayIcon from 'src/assets/images/play.svg';
import PauseIcon from 'src/assets/images/pause.svg';
import WavesImage from 'src/assets/images/waves.svg';
import {fonts} from 'src/common/fonts';
import {secondsToMMSS} from 'src/helpers/mics';
import LottieView from 'lottie-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {startAudio, stopAudio} from 'src/store/reducers/audioSlice';

type Props = {
  audioUrl: string;
  answer_id: string;
  answer_audio_duration?: string;
};

const AudioAnswerPlayer = ({
  audioUrl,
  answer_id,
  answer_audio_duration,
}: Props) => {
  const dispatch = useDispatch();
  const {currentAudio, currentAnswerId} = useSelector(
    (state: any) => state.audio,
  );
  const [progress, setProgress] = useState(0);
  const soundRef = useRef<Sound | null>(null);

  const durationFormatted = useMemo(() => {
    return secondsToMMSS(Number(answer_audio_duration));
  }, [answer_audio_duration]);

  // const sound = useMemo(() => {
  //   return new Sound(audioUrl, '', error => {
  //     if (error) {
  //       console.error('Error loading sound:', error);
  //     }
  //   });
  // }, [audioUrl]);

  // useEffect(() => {
  //   if (currentAnswerId === answer_id) {
  //     const interval = setInterval(() => {
  //       setProgress(prevProgress => {
  //         const newProgress = prevProgress + 1 / duration;
  //         console.log('New animation progress:', newProgress);
  //         // if (newProgress >= 1) {
  //         //   clearInterval(interval);
  //         // }
  //         // if (animationRef.current) {
  //         //   animationRef.current.play(newProgress, 1);
  //         // }
  //         return newProgress;
  //       });
  //     }, 1000);

  //     // Cleanup the interval when the component unmounts
  //     return () => clearInterval(interval);
  //   }
  // }, [answer_id, currentAnswerId, duration]);

  const handlePlayPause = () => {
    if (currentAnswerId === answer_id) {
      setProgress(0);
      dispatch(stopAudio());
      soundRef.current?.release();
    } else {
      setProgress(0);
      dispatch(
        startAudio({
          currentAudio: audioUrl,
          currentAnswerId: answer_id,
        }),
      );
    }
  };

  const animationRef = useRef(null);

  // const updatePosition = (seconds: number) => {
  //   setPlaybackPosition(seconds);
  // };

  // const toggleRecording = async () => {
  //   if (!isPlaying) {
  //     // playRecording();
  //     await dispatch(updateCurrentAudio(audioUrl));
  //     audioService.playSound({
  //       soundUri: audioUrl,
  //       onStop: () => stopPlaying(),
  //     });
  //   } else {
  //     await dispatch(updateCurrentAudio(null));
  //     audioService.stopSound(updatePosition);
  //     // stopPlaying();
  //   }
  //   setIsPlaying(prev => !prev);
  // };

  // const stopPlaying = async () => {
  //   setIsPlaying(false);
  //   await dispatch(updateCurrentAudio(null));
  //   audioService.stopSound();
  //   // soundRef.current?.getCurrentTime(seconds => {
  //   //   if (duration === seconds) {
  //   //     soundRef.current?.pause(() => {
  //   //       setPlaybackPosition(0);
  //   //       soundRef.current?.setCurrentTime(0);
  //   //       soundRef.current?.release();
  //   //     });
  //   //   } else {
  //   //     soundRef.current?.pause(() => {
  //   //       setPlaybackPosition(seconds);
  //   //     });
  //   //   }
  //   // });
  // };

  // const playRecording = () => {
  //   Sound.setCategory('Playback', false);
  //   if (playbackPosition !== 0) {
  //     // alert(playbackPosition);
  //     soundRef.current?.setCurrentTime(playbackPosition);
  //   } else {
  //     soundRef.current?.setCurrentTime(0);
  //   }
  //   console.log('duration: ', soundRef?.current?.getDuration());
  //   soundRef?.current?.play(() => {
  //     soundRef?.current?.pause();
  //     soundRef?.current?.release();
  //     setIsPlaying(false);
  //     setPlaybackPosition(0);
  //   });
  // };

  // useEffect(() => {
  //   return () => {
  //     // soundRef?.current?.stop();
  //     // soundRef?.current?.release();
  //     audioService.stopSound();
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Text>Remaining Duration: {localRemainingDuration}s</Text>
      <TouchableOpacity onPress={handlePlayPause}>
        <Text>{answer_id === currentAnswerId ? 'Stop' : 'Play'}</Text>
      </TouchableOpacity> */}
      <Pressable style={styles.playIcon} onPress={handlePlayPause}>
        {currentAudio !== audioUrl ? <PlayIcon /> : <PauseIcon />}
      </Pressable>
      <View style={{width: '65%'}}>
        {answer_id !== currentAnswerId ? (
          <WavesImage style={styles.wavesImage} />
        ) : (
          <LottieView
            style={{height: 40, width: '100%'}}
            source={require('src/assets/lottie/audio_wave.json')}
            autoPlay
            loop={true}
            ref={animationRef}
            speed={0.5}
            // progress={progress}
            // duration={4000}
            // duration={Number(duration) * 1000}
            // speed={1 / Number(duration)}
          />
        )}
      </View>
      <Text style={styles.durationText}>{durationFormatted || '00:00'}</Text>
    </View>
  );
};

export default AudioAnswerPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(13, 12, 12, 0.17)',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 23,
  },
  playIcon: {
    width: '15%',
  },
  wavesImage: {
    width: '100%',
    fill: '#000',
  },
  durationText: {
    color: 'rgba(0, 0, 0, 0.50)',
    fontSize: 13,
    fontFamily: fonts.SF_REGULAR,
  },
});

// 00FFB3
// F0FF44
