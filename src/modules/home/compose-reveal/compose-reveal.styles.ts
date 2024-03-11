import {StyleSheet, Dimensions} from 'react-native';
// import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // paddingTop: 40,
    width: WIDTH,
    marginTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalView: {
    flex: 1,
    // backgroundColor: colors.bgColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // paddingBottom: 100,
  },
  outerBg: {
    // minHeight: 320,
    paddingBottom: 20,
    paddingTop: 20,
    height: HEIGHT / 2.4 + 40,
    borderRadius: 24,
    // paddingHorizontal: 10,
    marginTop: 15,
  },
  innerBg: {
    // minHeight: HEIGHT / 2.5,
    height: HEIGHT / 2.4,
    // marginTop: 10,
    borderRadius: 45,
    position: 'absolute',
    top: 40,
    left: 20,
    width: WIDTH - 40,
    justifyContent: 'space-between',
  },
  container: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: 0,
  },
  question: {
    fontSize: 30,
    marginLeft: 37,
    marginRight: 16,
    fontFamily: fonts.HELVETICA_MEDIUM,
    marginTop: 30,
    maxWidth: '80%',
    color: '#000',
  },
  answerBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
    // marginRight: 20,
  },
  answerInput: {
    textAlign: 'left',
    // borderWidth: 1,
    marginHorizontal: 0,
    fontSize: 26,
    fontWeight: '500',
    color: '#000',
    width: '80%',
    maxWidth: '80%',
    minHeight: 45,

    // maxHeight: 200,
    // textAlignVertical: 'flex-start',
  },
  sendButton: {
    height: 44,
    width: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});
