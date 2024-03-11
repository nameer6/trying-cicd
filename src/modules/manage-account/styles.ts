import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.bgColor,
    flex: 1,
  },
  setingsBlock: {
    paddingHorizontal: 16,
  },
  settingsOptionContainer: {
    marginTop: 10,
    borderRadius: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'rgba(235, 235, 245, 0.1)',
    backgroundColor: '#454549',
    paddingLeft: 16,
    paddingRight: 11,
    paddingVertical: 11,
    marginVertical: 10,
    borderRadius: 10,
  },
  settingsOptoinText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.SF_REGULAR,
  },
  blockedAccountCountTextStyle: {
    color: '#fff',
    fontSize: 17,
    fontFamily: fonts.SF_REGULAR,
    opacity: 0.5,
  },
  switchIconView: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveArrowIconStyle: {},
});
