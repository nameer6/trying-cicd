import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import {colors} from 'src/common/colors';

const SearchBox = (inputProps: any) => {
  const {containerStyle, inputStyle, ...rest} = inputProps;
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon name="search" color="#9B9B9B" size={20} />
      {/* <TextInput
        placeholder="Search"
        placeholderTextColor={colors.inputPlaceHolderColor}
        style={[styles.inputStyle, inputStyle]}
        {...rest}
      /> */}
      <BottomSheetTextInput
        placeholder="Search"
        placeholderTextColor={colors.inputPlaceHolderColor}
        style={[styles.inputStyle, inputStyle]}
        {...rest}
      />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  inputStyle: {
    height: 45,
    marginLeft: 8,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    flex: 1,
  },
});
