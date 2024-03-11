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
    marginTop: 16,
    borderRadius: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'rgba(235, 235, 245, 0.1)',
    backgroundColor: '#454549',
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  settingsOptoinText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: fonts.SF_REGULAR,
  },
  contentView: {
    flex: 1,
  },
  switchIconView: {
    paddingLeft: 10,
  },
});
