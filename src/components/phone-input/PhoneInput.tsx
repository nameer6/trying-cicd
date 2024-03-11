import {useEffect, useState} from 'react';
import {InteractionManager, Text, TouchableOpacity, View} from 'react-native';
import {colors} from 'src/common/colors';
import TransparentInput from '../TransparentInput';
import CountryPicker from './CountryPicker';
import {CountryCodeType} from 'src/helpers/types/countrycode.types';
import {styles} from './phoneinput-styles';
import BounceButton from '../BounceButton';

type Props = {
  selectedCountrycode: CountryCodeType;
  onChangeText: (text: string) => void;
  value: string;
  onChangeCountryCode: (code: CountryCodeType) => void;
};

const PhoneInput = ({
  selectedCountrycode,
  onChangeText,
  value,
  onChangeCountryCode,
}: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showCountyPicker, setShowCountryPicker] = useState<boolean>(false);
  const toggleCountryPicker = () => {
    setShowCountryPicker(prev => !prev);
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setIsFocused(true);
      }, 300);
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <BounceButton
          style={styles.countryPickerButton}
          onPress={toggleCountryPicker}>
          <Text style={styles.flagStyle}>{selectedCountrycode.flag}</Text>
          <Text style={styles.countryCodeTextStyle}>
            {selectedCountrycode.dial_code}
          </Text>
        </BounceButton>
        {isFocused && (
          <TransparentInput
            placeholder="Phone number"
            placeholderTextColor={colors.inputPlaceHolderColor}
            keyboardType="numeric"
            style={styles.inputStyle}
            maxLength={10}
            onChangeText={onChangeText}
            value={value}
            autoFocus={true}
          />
        )}
      </View>
      <CountryPicker
        show={showCountyPicker}
        onClose={toggleCountryPicker}
        onSelect={onChangeCountryCode}
      />
    </>
  );
};

export default PhoneInput;
