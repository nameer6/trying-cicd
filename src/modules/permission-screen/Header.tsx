import {useEffect, useMemo} from 'react';
import {Animated, Text, View} from 'react-native';
import {colors} from 'src/common/colors';
import AuthBackHeader from 'src/components/AuthBackHeader';
import GradientText from 'src/components/GradientText';
import InfoToast from 'src/components/InfoToast';
import {styles} from './styles';

type Props = {
  onlyContactPermissionPending: boolean;
};

const Header = ({onlyContactPermissionPending}: Props) => {
  const opacityValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  useEffect(() => {
    if (onlyContactPermissionPending) {
      Animated.timing(
        opacityValue, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 800, // Make it take a while
          useNativeDriver: false,
        },
      ).start();
    } else {
      Animated.timing(
        opacityValue, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: 800, // Make it take a while
          useNativeDriver: false,
        },
      ).start();
    }
  }, [onlyContactPermissionPending, opacityValue]);

  return (
    <View style={styles.header}>
      <AuthBackHeader title="Permissions" />
      {!onlyContactPermissionPending && (
        <Text style={styles.infoText}>
          On Reveal, you answer questions then decide who gets to reveal your
          response.
        </Text>
      )}
      {onlyContactPermissionPending && (
        <Animated.View style={{opacity: opacityValue}}>
          <InfoToast
            style={styles.infoToast}
            title="Reveal requires contact permissions "
            description="We require access to your contacts in order to send your reveals, and for you to invite others to join you on the app. Your contacts are saved on a secure server."
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Header;
