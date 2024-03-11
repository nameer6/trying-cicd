import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Sound from 'react-native-sound';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from 'src/modules/splash/Splash';
import OnBoarding1 from 'src/modules/onboarding/OnBoarding1';
import OnBoarding2 from 'src/modules/onboarding/OnBoarding2';
import OnBoarding3 from 'src/modules/onboarding/OnBoarding3';
import OnBoarding4 from 'src/modules/onboarding/OnBoarding4';
import OnBoarding5 from 'src/modules/onboarding/OnBoarding5';
import OnBoarding6 from 'src/modules/onboarding/OnBoarding6';
import OnBoarding7 from 'src/modules/onboarding/OnBoarding7';
import CreateAccStart from 'src/modules/create-account/CreateAccStart';
import SelectAgeScreen from 'src/modules/create-account/SelectAgeScreen';
import PermissionScreen from 'src/modules/permission-screen/PermissionScreen';
import PhoneNumberScreen from 'src/modules/phone-number-screen/PhoneNumberScreen';
import OtpScreen from 'src/modules/otp-screen/OtpScreen';
import EnterName from 'src/modules/enter-name-screen/EnterName';
import AddPicture from 'src/modules/add-profile-picture/AddPicture';
import Home from 'src/modules/home/Home';
import Profile from 'src/modules/profile/Profile';
import EditProfile from 'src/modules/edit-profile/EditProfile';
import Settings from 'src/modules/settings/Settings';
import RevealPostScreen from 'src/modules/reveal-post/RevealPostScreen';
import BlockedAccounts from 'src/modules/blocked-accounts/BlockedAccounts';
import ManageAccountScreen from 'src/modules/manage-account/ManageAccountScreen';
import NotificationSettings from 'src/modules/notification-settings/NotificationSettings';
import RevealsWithOthers from 'src/modules/reveals-with-others/RevealsWithOthers';
import Activities from 'src/modules/activities/Activities';
import {navigationRef} from './RootNavigation.js';
import ShareRevealComponent from '../components/global/ShareRevealComponent';
import {stopAudio} from 'src/store/reducers/audioSlice';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

Sound.setCategory('Playback');

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const whooshRef = useRef<Sound | null>(null);
  const dispatch = useDispatch();

  const {currentAudio, currentAnswerId} = useSelector(
    (state: any) => state.audio,
  );
  useEffect(() => {
    if (currentAnswerId) {
      whooshRef.current = new Sound(currentAudio, '', error => {
        if (error) {
          console.error('Error loading sound:', error);
        }
        whooshRef?.current?.play(() => {
          whooshRef?.current?.release();
          dispatch(stopAudio());
        });
      });

      // Cleanup when the component unmounts
      return () => {
        if (whooshRef.current) {
          whooshRef.current.release();
        }
      };
    }
  }, [currentAnswerId, currentAudio, dispatch]);
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <BottomSheetModalProvider>
          <ShareRevealComponent />
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name="OnBoarding1"
              component={OnBoarding1}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OnBoarding2"
              component={OnBoarding2}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OnBoarding3"
              component={OnBoarding3}
              options={{
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name="OnBoarding4"
              component={OnBoarding4}
              options={{
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name="OnBoarding5"
              component={OnBoarding5}
              options={{
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name="OnBoarding6"
              component={OnBoarding6}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OnBoarding7"
              component={OnBoarding7}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CreateAccStart"
              component={CreateAccStart}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SelectAgeScreen"
              component={SelectAgeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PermissionScreen"
              component={PermissionScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PhoneNumberScreen"
              component={PhoneNumberScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OtpScreen"
              component={OtpScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EnterName"
              component={EnterName}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddPicture"
              component={AddPicture}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
                animation: 'fade_from_bottom',
                // animation: 'fade_from_bottom',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="RevealPostScreen"
              component={RevealPostScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="BlockedAccounts"
              component={BlockedAccounts}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ManageAccountScreen"
              component={ManageAccountScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettings}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="RevealsWithOthers"
              component={RevealsWithOthers}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Activities"
              component={Activities}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </>
  );
};
export default AppNavigation;
