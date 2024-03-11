import {Dimensions, StyleSheet} from 'react-native';
import {fonts} from 'src/common/fonts';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    zIndex: 999,
    justifyContent: 'space-between',
  },
  sharSheetHeader: {
    padding: 22,
    paddingTop: 18,
    paddingBottom: 0,
    alignItems: 'center',
  },
  shareHeaderTextStyle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 7,
    marginTop: 5,
  },
  shareInfoText: {
    fontSize: 16,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
    marginBottom: 7,
    marginTop: 31,
    opacity: 0.5,
    textAlign: 'center',
  },
  shareHeaderSubtextStyle: {
    fontSize: 15,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
    opacity: 0.5,
  },
  postMoreOptionsSheetWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  sheetWrapperStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
    zIndex: 999,
  },
  sheetContainerStyle: {
    borderRadius: 24,
    backgroundColor: '#33363F',
    paddingBottom: 0,
    zIndex: 999,
  },
  draggableIconStyle: {
    backgroundColor: '#686868',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.5,
    marginTop: 26,
  },
  shareOptions: {
    flexDirection: 'row',
    gap: 64,
    justifyContent: 'center',
    marginTop: 37,
    paddingBottom: 100,
    alignItems: 'center',
  },
  shareOption: {
    gap: 9,
    alignItems: 'center',
  },
  instaIconStyle: {
    height: 56,
    width: 56,
  },
  shareOptionTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  absolute: {
    // position: 'absolute',
    top: 0,
    height: HEIGHT,
    width: '100%',
    backgroundColor: '#000',
  },
  loader: {
    position: 'absolute',
    top: -25,
    left: 0,
    right: 0,
    height: '100%',
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  deleteButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  deleteButtonTextStyle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EF2D2D',
    textAlign: 'center',
    paddingVertical: 20,
  },
  deleteShareOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 26,
  },
  deleteContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingVertical: 16,
  },
  reportContainer: {
    flex: 1,
    zIndex: 999,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  optionsViewContainer: {
    width: '100%',
    backgroundColor: '#2C2C2D',
    borderRadius: 15,
  },
  btnOptionContainerView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTextStyle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.40)',
    fontWeight: '600',
  },
  blockButtonTextStyle: {
    fontSize: 20,
    fontFamily: fonts.SF_REGULAR,
    textAlign: 'center',
    color: '#FF382C',
  },
  borderView: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  btnOptionTextStyle: {
    fontSize: 20,
    fontFamily: fonts.SF_REGULAR,
    textAlign: 'center',
    color: '#007AFF',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  cancelBtnView: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#2C2C2D',
    borderRadius: 15,
  },
  cancelBtnOptionContainerView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  RBsheetContainerStyle: {
    borderRadius: 24,
    backgroundColor: 'transparent',
    paddingBottom: 0,
  },
  loaderStyle: {
    position: 'absolute',
    top: 0,
    zIndex: 999999,
    marginTop: HEIGHT / 2 - 80,
    left: '40%',
  },
  reportResonLoader: {
    position: 'absolute',
    top: 0,
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
