import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 12,
  },
  doneButton: {
    width: 66,
    height: 32,
  },
  doneButtonText: {
    fontWeight: '600',
    color: colors.bgColor,
    fontSize: 15,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  profileImageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderRadius: 38,
    borderColor: colors.bgColor,
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBackgroundStyle: {
    position: 'absolute',
  },
  imageStyle: {
    height: 123,
    width: 123,
    borderRadius: 123,
  },
  nameContainer: {
    marginTop: 50,
    paddingHorizontal: 16,
  },
  nameLabel: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 14,
    fontWeight: '600',
  },
  inputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 45,
    height: 54,
    marginTop: 10,
    color: '#fff',
    fontFamily: fonts.SF_REGULAR,
    fontSize: 18,
    paddingHorizontal: 16,
    marginBottom: 17,
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
});
