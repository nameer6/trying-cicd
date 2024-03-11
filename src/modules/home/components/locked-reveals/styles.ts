import {StyleSheet, Dimensions} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.bgColor,
  },
  mainContainer: {
    flex: 1,
    marginTop: 20,
  },
  lockedDataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  // profile content container
  newRevealTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: WIDTH - 80,
    gap: 4,
    alignSelf: 'center',
  },
  revealLengthTextStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gradientGreenColor,
    textAlign: 'center',
    lineHeight: 25,
  },
  revealUserNamesTextStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  revealUserNamesTextStyle2: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: WIDTH - 80,
    alignSelf: 'center',
  },
  // reveal content container
  gradientBg: {
    // flex: 1.4,
    width: WIDTH,
    borderRadius: 16,
    paddingTop: 55,
    paddingBottom: 10,
  },
  gradientBgImageStyle: {
    borderRadius: 16,
    resizeMode: 'stretch',
    width: WIDTH,
  },
  boxContainerView: {
    marginTop: 50,
    marginHorizontal: 8,
  },
  boxImgStyle: {
    borderRadius: 36,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  boxInnerContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  revealToSeeThemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 0,
  },
  boxheaderTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  revealTextStyle: {
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
    marginHorizontal: 6,
    minHeight: 80,
    maxWidth: '80%',
    marginBottom: 33,
  },
  textInputView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'space-between',
    padding: 4,
    paddingLeft: 23,
    alignItems: 'center',
    borderWidth: 1,
  },
  placeholderText: {
    color: 'rgba(72, 72, 72, 0.66)',
    fontSize: 18,
    fontFamily: fonts.SF_REGULAR,
  },
  // Unlock them instantly container
  unLockRevealTextContainer: {
    marginTop: 20,
  },
  unLockRevealTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 36,
  },
  unLockRevealTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
});
