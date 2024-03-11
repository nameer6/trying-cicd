import {StyleSheet, Dimensions} from 'react-native';
import {fonts} from 'src/common/fonts';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  outerBg: {
    paddingVertical: 45,
    height: 'auto',
  },
  gradientBgImageStyle: {
    opacity: 0.7,
  },
  innerBg: {
    height: ((WIDTH - 32) * 50) / 343,
    width: WIDTH - 32,
    marginHorizontal: 15,
    borderRadius: 48,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  revealButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: 48,
    margin: 2,
    paddingVertical: 15,
  },
  bgImageGradient: {
    borderRadius: 48,
  },
  container: {
    borderRadius: 35,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#fff',
    height: '100%',
  },
  header: {
    padding: 20,
    paddingHorizontal: 18,
    paddingBottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 35,
    marginHorizontal: 8,
  },
  sharSheetHeader: {
    padding: 22,
    paddingBottom: 0,
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitleText: {
    fontSize: 17,
    color: '#000',
    fontFamily: fonts.HELVETICA_BOLD,
  },
  headerButton: {
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 54, 63, 0.80)',
  },
  headerButtonImgStyle: {
    fontSize: 18,
    color: '#000',
  },
  question: {
    fontSize: 30,
    marginLeft: 37,
    marginRight: 16,
    fontFamily: fonts.HELVETICA_MEDIUM,
    marginBottom: 30,
    color: '#000',
  },
  placeholderText: {
    color: 'rgba(72, 72, 72, 0.66)',
    fontSize: 18,
    fontFamily: fonts.SF_REGULAR,
  },
  rollingDice: {
    height: 40,
    width: 40,
  },
  shadow: {
    zIndex: 999,
    position: 'absolute',
    top: HEIGHT - (HEIGHT * 2) / 3 - 40,
    height: 60,
    width: WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: '#000',
    borderRadius: 24,
  },
  sheetWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  sheetContainer: {
    borderRadius: 24,
    backgroundColor: '#33363F',
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  sheetDraggableIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  boxContainerView: {
    marginTop: 0,
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
  boxInnerContainerRevealAgain: {
    paddingTop: 18,
    paddingHorizontal: 15,
  },
  revealToSeeThemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 34,
  },
  revealAgainBoxHeader: {
    marginBottom: 18,
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
    maxWidth: '90%',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
