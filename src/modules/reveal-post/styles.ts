import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    // paddingBottom: 60,
  },
  headerStyle: {
    marginBottom: 12,
  },
  commentBoxStyle: {
    marginHorizontal: 20,
    marginBottom: 40,
    // flex: 1,
  },
  loaderStyle: {
    position: 'absolute',
    top: 0,
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
