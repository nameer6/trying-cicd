import {fonts} from 'src/common/fonts';
import {StyleSheet, Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  // Gradient Imge Background
  outerBg: {
    paddingVertical: 45,
    height: 'auto',
  },
  gradientBgImageStyle: {
    opacity: 0.7,
  },

  // Bubble Image Style
  buttonBg: {
    width: WIDTH - 16,
    height: ((WIDTH - 16) * 91) / 360,
    alignSelf: 'center',
    borderRadius: 36,
    justifyContent: 'center',
  },
  buttonBgImage: {
    borderRadius: 36,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
    borderRadius: 36,
    flex: 1,
  },
  userDetailsStyle: {
    gap: 4,
    flex: 1,
  },
  usernameBoldStyle: {
    fontFamily: fonts.HELVETICA_BOLD,
    fontSize: 16,
  },
  usernameMediumStyle: {
    fontFamily: fonts.HELVETICA_MEDIUM,
    fontSize: 16,
  },
  revealToSeeStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revealToSeeTextStyle: {
    fontSize: 14,
    fontFamily: fonts.HELVETICA_MEDIUM,
    color: 'rgba(0, 0, 0, 0.50)',
  },
  arrowIcon: {
    marginLeft: -2,
  },
});
