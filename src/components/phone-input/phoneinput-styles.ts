import {StyleSheet} from 'react-native';
import {fonts} from 'src/common/fonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginHorizontal: 40,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.11)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  flagStyle: {
    fontSize: 22,
  },
  countryCodeTextStyle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.50)',
    fontFamily: fonts.SF_REGULAR,
  },
  inputStyle: {
    fontFamily: fonts.SF_REGULAR,
    fontSize: 26,
    marginHorizontal: 10,
    minWidth: 200,
  },
});
