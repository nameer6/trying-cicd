import {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Sound from 'react-native-sound';
import PlayIcon from 'src/assets/images/play.svg';
import PauseIcon from 'src/assets/images/pause.svg';
import WavesImage from 'src/assets/images/waves.svg';
import {fonts} from 'src/common/fonts';
import Feather from 'react-native-vector-icons/Feather';
import GradientButton from 'src/components/GradientButton';
import {secondsToMMSS, showSuccessToast} from 'src/helpers/mics';
import general from 'src/helpers/http/general';

type Props = {
  soundUri: string;
  uploading?: boolean;
  handleSubmit: (soundUrl: string) => void;
  durationSeconds: number;
};

const RecordingPlayer = ({soundUri, handleSubmit, durationSeconds}: Props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const soundRef = useRef<Sound | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const duration = useMemo(() => {
    return secondsToMMSS(durationSeconds);
  }, [durationSeconds]);

  const toggleRecording = () => {
    if (!isPlaying) {
      playRecording();
    } else {
      stopPlaying();
    }
    setIsPlaying(prev => !prev);
  };

  const stopPlaying = () => {
    soundRef.current?.getCurrentTime(seconds => {
      soundRef.current?.pause(() => {
        setPlaybackPosition(seconds);
      });
    });
  };

  const playRecording = () => {
    Sound.setCategory('Playback', false);
    if (playbackPosition !== 0) {
      soundRef.current?.setCurrentTime(playbackPosition);
    }
    console.log('duration: ', soundRef?.current?.getDuration());
    soundRef?.current?.play(() => {
      soundRef?.current?.release();
      setIsPlaying(false);
      setPlaybackPosition(0);
    });
  };

  async function getBlob(fileUri: string) {
    try {
      const resp = await fetch(fileUri);
      const imageBody = await resp.blob();
      return imageBody;
    } catch (error) {
      console.log('Err: ', error);
      setUploading(false);
      return null;
    }
  }

  const handleUpload = async () => {
    setUploading(true);
    const path = Platform.OS === 'android' ? 'file://' + soundUri : soundUri;
    const imageBody = await getBlob(path);
    let fileName = new Date().getTime();
    if (!imageBody) return;
    const file = {
      uri: path,
      name: fileName,
      type: imageBody['type'],
    };
    console.log('generating url');
    general
      .generateAwsUrl({
        folder: 'audio',
        file_name: fileName + '',
        content_type: imageBody['type'],
      })
      .then(res => {
        const {uploadURL} = res;
        console.log('res:', res);
        uploadImageToBucket(uploadURL, imageBody['type'], file);
      })
      .catch(err => {
        console.log(err);
        showSuccessToast('Error uploading image');
        setUploading(false);
      });
  };

  const uploadImageToBucket = (
    s3BucketUrl: string,
    imageType: string,
    file: any,
  ) => {
    console.log('imageType: ' + imageType);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', imageType);

    const requestOptions: any = {
      method: 'PUT',
      headers: myHeaders,
      body: file,
      redirect: 'follow',
    };
    console.log('requestOptions: ' + JSON.stringify(requestOptions));

    fetch(s3BucketUrl, requestOptions)
      .then(response => {
        console.log('S# bucket upload response: ' + JSON.stringify(response));
        if (response.ok) {
          const uploadedUrl = s3BucketUrl.split('?X-Amz-Algorithm')[0];
          console.log('s3BucketUrl: ', s3BucketUrl);
          console.log('uploadedUrl: ', uploadedUrl);
          //   setUploading(false);
          handleSubmit(uploadedUrl);
        } else {
          console.log('Error with s3bucket');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <Pressable style={styles.playIcon} onPress={toggleRecording}>
        {!isPlaying ? <PlayIcon /> : <PauseIcon />}
      </Pressable>
      <View style={{width: '50%'}}>
        <WavesImage style={styles.wavesImage} />
      </View>
      <Text style={styles.durationText}>{duration}</Text>
      <GradientButton
        onPress={handleUpload}
        style={styles.sendButton}
        disabled={uploading}
        secondColorOffset="0.4">
        {!uploading ? (
          <Feather name="arrow-up" color="#000" size={30} />
        ) : (
          <ActivityIndicator color="#fff" />
        )}
      </GradientButton>
    </>
  );
};

export default RecordingPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(13, 12, 12, 0.17)',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 20,
  },
  playIcon: {
    width: '15%',
  },
  wavesImage: {
    width: '100%',
    fill: '#000',
  },
  durationText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: fonts.SF_REGULAR,
  },
  sendButton: {
    height: 44,
    width: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
