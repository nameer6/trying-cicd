import {StyleSheet, TextInput} from 'react-native';
import {fonts} from 'src/common/fonts';

const TransparentInput = ({inputRef, ...props}) => {
  return (
    <TextInput
      {...props}
      ref={inputRef}
      style={[styles.inputStyle, props.style]}
    />
  );
};

export default TransparentInput;

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 24,
    marginHorizontal: 80,
    color: '#fff',
    fontFamily: fonts.SF_REGULAR,
    textAlign: 'center',
  },
});
