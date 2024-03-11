import {useState} from 'react';
import {KeyboardAvoidingView, Text, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {colors} from 'src/common/colors';
import AuthBackHeader from 'src/components/AuthBackHeader';
import GradientButton from 'src/components/GradientButton';
import TransparentInput from 'src/components/TransparentInput';
import auth from 'src/helpers/http/auth';
import {resetFlow, showErrorToast, showSuccessToast} from 'src/helpers/mics';
import {setToken} from 'src/helpers/storage';
import {VerifyOtpRequestType} from 'src/helpers/types/auth.types';
import {setUser} from 'src/store/reducers/auth';
import {styles} from './styles';
import {updateUserProfile} from 'src/store/reducers/profileStore';

const OtpScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state.user);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const onNext = () => {
    setLoading(true);
    const payload = {
      country_code: user?.country_code,
      phone_number: user?.phone_number,
      otp_code: otp,
    };
    if (!route.params.is_onboarded) {
      verifyOtp(payload);
    } else {
      loginWithAPI(payload);
    }
  };

  const verifyOtp = (payload: VerifyOtpRequestType) => {
    auth
      .verifyOtp(payload)
      .then(async (res: any) => {
        console.log('res: ' + JSON.stringify(res));
        if (res.status) {
          showSuccessToast(res.message);
          await dispatch(
            setUser({
              id: res.id,
            }),
          );
          navigation.navigate('EnterName');
        } else {
          showErrorToast(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        showErrorToast(err);
        console.log('err: ' + JSON.stringify(err));
        setLoading(false);
      });
  };

  const loginWithAPI = (payload: VerifyOtpRequestType) => {
    auth
      .login(payload)
      .then(async (res: any) => {
        console.log('res: ' + JSON.stringify(res));
        if (res.status) {
          await setToken(res?.data?.token);
          await dispatch(updateUserProfile(payload));
          // navigation.navigate('Home');
          resetFlow({
            screenName: 'Home',
            navigation,
          });
        } else {
          showErrorToast(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        showErrorToast(err);
        console.log('err: ' + JSON.stringify(err));
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <AuthBackHeader title="Verification Code" />
        <TransparentInput
          placeholder="Code"
          placeholderTextColor={colors.inputPlaceHolderColor}
          onChangeText={setOtp}
          value={otp}
          maxLength={6}
          keyboardType="numeric"
          autoFocus
          style={{fontSize: 26}}
        />
        <GradientButton
          style={styles.button}
          loading={loading}
          disabled={otp.length !== 6}
          onPress={onNext}>
          <Text
            style={[
              styles.buttonText,
              otp.length !== 6 && styles.disabledText,
            ]}>
            Next
          </Text>
        </GradientButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
