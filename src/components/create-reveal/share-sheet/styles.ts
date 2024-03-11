import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  revealToSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollviewStyle: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.5,
    marginTop: 30,
    marginBottom: 13,
  },
  loader: {
    marginTop: 20,
  },
  /* Contact item */
  flatListStyle: {
    // marginTop: 20,
    flex: 1,
  },
  noSearchFound: {
    fontFamily: fonts.SF_REGULAR,
    color: colors.inputPlaceHolderColor,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  shareSearchStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    height: 40,
    paddingHorizontal: 12,
  },
  inputStyle: {
    fontWeight: '400',
  },
  submitButtonText: {
    color: colors.bgColor,
    fontSize: 19,
    fontFamily: fonts.HELVETICA_BOLD,
  },
  submitButtonStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    height: 64,
    borderRadius: 200,
    width: WIDTH - 40,
  },
  arrowButton: {
    backgroundColor: '#050505',
    height: 48,
    width: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
  },
  sharSheetHeader: {
    padding: 22,
    paddingTop: 12,
    paddingBottom: 0,
    alignItems: 'center',
    marginBottom: 24,
  },
  shareHeaderTextStyle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  shareHeaderSubtextStyle: {
    fontSize: 14,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
    opacity: 0.5,
    marginTop: 5,
  },
  shareIconStyle: {
    height: 44,
    width: 44,
  },
  DMIconStyle: {
    height: 44,
    width: 44,
  },
  sheetWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  sheetContainer: {
    backgroundColor: colors.sheetBgColor,
  },
});
