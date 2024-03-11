import {useState} from 'react';
import {KeyboardAvoidingView, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {colors} from 'src/common/colors';
import AuthBackHeader from 'src/components/AuthBackHeader';
import GradientButton from 'src/components/GradientButton';
import TransparentInput from 'src/components/TransparentInput';
import {setUser} from 'src/store/reducers/auth';
import {styles} from './styles';

const EnterName = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const onNext = async () => {
    await dispatch(
      setUser({
        name,
      }),
    );
    navigation.navigate('AddPicture');
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <AuthBackHeader title="Your name" />
        <TransparentInput
          placeholder="Enter your name"
          placeholderTextColor={colors.inputPlaceHolderColor}
          onChangeText={setName}
          value={name}
          maxLength={50}
        />
        <GradientButton
          style={styles.button}
          disabled={!name.length}
          onPress={onNext}>
          <Text
            style={[styles.buttonText, !name.length && styles.disabledText]}>
            Next
          </Text>
        </GradientButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EnterName;
