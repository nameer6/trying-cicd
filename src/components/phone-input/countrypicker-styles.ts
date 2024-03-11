import {StyleSheet, Dimensions} from 'react-native';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    paddingVertical: 40,
    width: WIDTH,
    marginTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
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
  },
  button: {
    borderRadius: 20,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingHorizontal: 16,
    gap: 5,
    elevation: 5,
  },
  inputStyle: {
    flex: 1,
    height: 56,
    paddingHorizontal: 8,
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    gap: 16,
  },
  flagStyle: {
    fontSize: 16,
  },
  countryNameStyle: {
    fontSize: 16,
    fontFamily: fonts.SF_REGULAR,
    color: '#000',
  },
});
