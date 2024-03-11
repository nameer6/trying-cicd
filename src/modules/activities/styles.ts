import {StyleSheet} from 'react-native';
import {colors} from 'src/common/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgColor,
    flex: 1,
  },
  topNotifications: {
    marginVertical: 24,
  },
  notificationsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  labelStyle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#fff',
  },
  seeMoreStyle: {
    marginTop: 45,
  },
  seeMoreTextStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  loadeMoreStyle: {
    marginTop: 16,
  },
});
