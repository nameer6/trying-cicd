import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  loader: {
    marginTop: 20,
  },
  content: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  flatListStyle: {
    // marginTop: 20,
    paddingTop: 8,
  },
  streakTagStyle: {
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 4,
  },
  blockButtonText: {
    color: 'red',
  },
  loadeMoreStyle: {
    marginTop: 16,
  },
});
