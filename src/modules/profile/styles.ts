import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  header: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
    backgroundColor: colors.bgColor,
    justifyContent: 'space-between',
  },
  flatListStyle: {},
  loaderStyle: {
    position: 'absolute',
    top: 0,
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  loadeMoreStyle: {
    marginTop: 16,
  },
  profileBanner: {
    marginBottom: 34,
  },
  noDataFound: {
    marginBottom: 34,
  },
  noDataTextStyle: {
    fontSize: 14,
  },
});
