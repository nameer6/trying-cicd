import {useCallback, useEffect, useMemo, useState} from 'react';
import {Animated, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {styles} from './styles';
import GradientButton from 'src/components/GradientButton';
import {getToken} from 'src/helpers/storage';
import {resetFlow} from 'src/helpers/mics';
import profile from 'src/helpers/http/profile';
import {updateUserProfile} from 'src/store/reducers/profileStore';
import {setSettings} from 'src/store/reducers/app-settings';
import settings from 'src/helpers/http/settings';
import SplashScreen from 'react-native-splash-screen';

const Splash = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  // const bgScaleValue = useMemo(() => {
  //   return new Animated.Value(0);
  // }, []);
  const scaleValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const checkProfile = useCallback(() => {
    profile
      .getProfile()
      .then(async res => {
        console.log('auth res: ' + JSON.stringify(res));
        if (res?.status) {
          await dispatch(updateUserProfile(res?.data));

          SplashScreen.hide();
          setLoading(false);
          resetFlow({
            navigation,
            screenName: 'Home',
          });
        } else {
          SplashScreen.hide();
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Error: ', error);
      });
  }, [dispatch, navigation]);

  const authenticateUser = useCallback(async () => {
    const token = await getToken();
    if (token) {
      checkProfile();
    } else {
      setLoading(false);
      SplashScreen.hide();
    }
  }, [checkProfile]);

  const getAppSettings = useCallback(() => {
    settings.getAppSettings().then(res => {
      dispatch(setSettings(res?.data));
    });
  }, [dispatch]);

  useEffect(() => {
    authenticateUser();
    getAppSettings();
  }, [authenticateUser, getAppSettings]);

  useEffect(() => {
    // Animated.timing(
    //   bgScaleValue, // The animated value to drive
    //   {
    //     toValue: 1, // Animate to opacity: 1 (opaque)
    //     duration: 700, // Make it take a while
    //     useNativeDriver: true,
    //   },
    // ).start(() => {
    //   Animated.timing(
    //     scaleValue, // The animated value to drive
    //     {
    //       toValue: 1, // Animate to opacity: 1 (opaque)
    //       duration: 1000, // Make it take a while
    //       useNativeDriver: true,
    //     },
    //   ).start();
    // });
    Animated.timing(
      scaleValue, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
        useNativeDriver: true,
      },
    ).start();
  }, [scaleValue]);

  const onGetStarted = () => {
    navigation.navigate('OnBoarding1');
    // navigation.navigate('Home');
  };

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('src/assets/images/green-shadow-bg.png')}
          style={[
            styles.shadowImage,
            // {
            //   opacity: bgScaleValue,
            // },
            // {
            //   transform: [
            //     {
            //       scale: bgScaleValue,
            //     },
            //   ],
            // },
          ]}
        />
        <Animated.Image
          source={require('src/assets/images/Reveal.png')}
          style={[
            styles.logo,
            {
              opacity: scaleValue,
            },
            // {
            //   transform: [
            //     {
            //       scale: scaleValue,
            //     },
            //   ],
            // },
          ]}
        />
      </View>
      {!loading && (
        <GradientButton
          style={styles.button}
          onPress={onGetStarted}
          disabled={loading}>
          <Text style={styles.buttonText}>Get Started</Text>
        </GradientButton>
      )}
    </View>
  );
};

export default Splash;
