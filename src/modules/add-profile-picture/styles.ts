import {StyleSheet, Dimensions} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    justifyContent: 'space-between',
    paddingBottom: 65,
    paddingVertical: 10,
  },
  profilePictureContainer: {
    height: 158,
    width: 158,
    borderRadius: 158,
    alignSelf: 'center',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputPlaceHolderColor,
  },
  profilePicture: {
    height: 158,
    width: 158,
    borderRadius: 158,
    resizeMode: 'cover',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 158,
    width: 158,
    borderRadius: 158,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fonts.SF_REGULAR,
    textAlign: 'center',
    opacity: 0.5,
  },
  buttons: {
    gap: 16,
  },
  changePhotoButton: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 20,
  },
  changePhotoButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  button: {
    width: WIDTH - 40,
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
  disabledText: {
    color: '#fff',
    opacity: 0.5,
  },
});
