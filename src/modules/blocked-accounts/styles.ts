import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
export const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.bgColor,
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  noDataStyle: {
    flex: 1,
  },
  noDataImage: {
    height: 200,
    width: '90%',
  },
  noDataTextStyle: {
    // marginTop: -20,
  },
  listStyle: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  imageStyle: {
    height: 46,
    width: 46,
    borderRadius: 46,
  },
  userItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userNameTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  switchIconView: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveArrowIconStyle: {},
  revealButtonView: {
    width: 78,
    height: 32,
  },
  revealTextStyle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});
