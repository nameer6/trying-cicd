import {StyleSheet, Dimensions} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingVertical: 10,
    paddingBottom: 65,
  },
  topSection: {
    flex: 1.35,
    justifyContent: 'space-between',
  },
  header: {
    justifyContent: 'center',
    gap: 12,
  },
  gradientText1: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.50)',
    textAlign: 'center',
    marginHorizontal: 40,
    fontSize: 16,
    fontFamily: fonts.SF_REGULAR,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    width: WIDTH - 80,
    height: 57,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#33363F',
  },
  disabledButtonText: {
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    gap: 12,
    marginHorizontal: 40,
  },
  infoIcon: {
    marginTop: 3,
  },
  footerInfoText: {
    color: 'rgba(255, 255, 255, 0.50)',
    fontSize: 13,
    maxWidth: '94%',
    fontFamily: fonts.SF_REGULAR,
  },
  infoToast: {
    // marginBottom: 24,
    marginTop: 0,
  },
});
