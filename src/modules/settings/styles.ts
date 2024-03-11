import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 12,
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  headerStyle: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
    paddingTop: 20,
  },
  setingsBlock: {
    marginTop: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.SF_REGULAR,
    color: 'rgba(235, 235, 245, 0.60)',
    marginLeft: 16,
  },
  settingsOptionContainer: {
    backgroundColor: '#454549',
    marginTop: 8,
    borderRadius: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    marginLeft: 16,
    paddingVertical: 12,
    borderColor: '#545458',
  },
  settingsOptoinText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: fonts.SF_REGULAR,
  },
  settingsOptionBorder: {
    borderBottomWidth: 1,
  },
  footer: {
    marginBottom: 46,
    paddingHorizontal: 16,
  },
  footerButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#454549',
    borderRadius: 10,
    marginBottom: 24,
    gap: 8,
    height: 44,
  },
  footerButtonTextStyle: {
    fontSize: 17,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
  },
  versionTextStyle: {
    fontSize: 12,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
    opacity: 0.5,
    textAlign: 'center',
  },
});
