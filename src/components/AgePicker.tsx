import React from 'react';
import {View, Dimensions, StyleSheet, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {fonts} from 'src/common/fonts';

interface AgePickerProps {
  selectedAge: number;
  onValueChange: (newAge: number) => void;
}

const WIDTH = Dimensions.get('window').width;
const ageOptions = Array.from({length: 100}, (_, index) => index + 1);

const AgePicker: React.FC<AgePickerProps> = ({selectedAge, onValueChange}) => {
  return (
    <View style={styles.container}>
      <Picker
        itemStyle={styles.label}
        style={styles.picker}
        selectedValue={selectedAge}
        onValueChange={onValueChange}
        mode={'dialog'}>
        {ageOptions.map(age => (
          <Picker.Item
            key={age}
            label={`${age}`}
            value={age}
            style={styles.label}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 40,
    alignSelf: 'center',
  },
  label: {
    fontSize: 17,
    color: '#fff',
    fontFamily: fonts.SF_REGULAR,
    fontWeight: '400',
  },
  picker: {
    ...Platform.select({
      ios: {
        borderRadius: 7,
        height: 200,
      },
      android: {
        // Styling for Android goes here
      },
    }),
  },
});

export default AgePicker;
