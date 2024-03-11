import {StyleSheet, Dimensions} from 'react-native';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    backgroundColor: colors.bgColor,
    justifyContent: 'space-between',
    paddingBottom: 65,
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
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', // Flash color
  },
});
