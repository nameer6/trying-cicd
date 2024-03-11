import Sound from 'react-native-sound';

class AudioService {
  constructor() {
    this.currentSound = null;
    this.isPlaying = false;
    this.onPlaybackStateChanged = null; // Callback for playback state changes
    this.onStop = null;
  }

  setOnPlaybackStateChangedCallback = callback => {
    this.onPlaybackStateChanged = callback;
  };

  playSound = ({soundUri, playBackPosition = 0, onStop}) => {
    this.isPlaying = true;

    // this.onStop = onStop;

    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.release();
    }

    const newSound = new Sound(soundUri, '', error => {
      if (error) {
        console.error('Error loading sound:', error);
      } else {
        // newSound.setCurrentTime(0);
        newSound.play(() => {
          this.isPlaying = false;
          this.currentSound = null;
          newSound.release();
          if (onStop) {
            onStop();
          }
        });
        this.currentSound = newSound;
      }
    });
  };

  stopSound = setPlayBackPosition => {
    this.isPlaying = false;
    if (this.onPlaybackStateChanged) {
      this.onPlaybackStateChanged(this.isPlaying);
    }

    this.currentSound.pause();
    this.currentSound.getCurrentTime(seconds => {
      if (setPlayBackPosition) {
        setPlayBackPosition(seconds);
      }
    });
  };

  getIsPlaying = () => {
    return this.isPlaying;
  };
}

const audioService = new AudioService();
export default audioService;
