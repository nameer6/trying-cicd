import {useState} from 'react';
import {KeyboardAvoidingView, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import PhoneInput from 'src/components/phone-input/PhoneInput';
import AuthBackHeader from 'src/components/AuthBackHeader';
import GradientButton from 'src/components/GradientButton';
import auth from 'src/helpers/http/auth';
import {setUser} from 'src/store/reducers/auth';
import {styles} from './styles';
import {showErrorToast, showSuccessToast} from 'src/helpers/mics';
import {CountryCodeType} from 'src/helpers/types/countrycode.types';

const PhoneNumberScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCountrycode, setSelectedCountrycode] = useState<{
    dial_code: string;
    flag: string;
  }>({
    dial_code: '+1',
    flag: '🇺🇸',
  });

  const onNext = () => {
    setLoading(true);
    const payload = {
      country_code: selectedCountrycode.dial_code,
      phone_number: mobileNumber,
    };

    auth
      .sendOtp(payload)
      .then(async (res: any) => {
        console.log('phone number res: ' + JSON.stringify(res));
        if (res.status) {
          showSuccessToast(res.message);
          const permissions = {
            settings: {
              notification:
                route?.params?.selectedPermissions.includes('notification'),
              contacts: route?.params?.selectedPermissions.includes('contacts'),
            },
          };
          await dispatch(setUser({...payload, ...permissions}));
          navigation.navigate('OtpScreen', {
            is_onboarded: res?.data?.is_onboarded,
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

  const onChangeCountryCode = (item: CountryCodeType) => {
    setSelectedCountrycode(item);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <AuthBackHeader title="Your phone number" />
        <PhoneInput
          value={mobileNumber}
          onChangeText={setMobileNumber}
          selectedCountrycode={selectedCountrycode}
          onChangeCountryCode={onChangeCountryCode}
        />
        <GradientButton
          onPress={onNext}
          style={styles.button}
          loading={loading}
          disabled={mobileNumber.match(/^\d{10}$/) === null}>
          <Text
            style={[
              styles.buttonText,
              mobileNumber.match(/^\d{10}$/) === null && styles.disabledText,
            ]}>
            Next
          </Text>
        </GradientButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PhoneNumberScreen;
