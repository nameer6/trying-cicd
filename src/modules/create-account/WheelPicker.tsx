import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {triggerHapticFeedback} from 'src/helpers/mics';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

type Props = {
  selectedAge?: number;
  onSelectAge: (value: number) => void;
};

const WheelPicker = ({selectedAge, onSelectAge}: Props) => {
  const onSelect = (age: number) => () => {
    onSelectAge(age);
  };

  const data = Array.from({length: 91}, (_, i) => i + 10);

  const handleScroll = () => {
    triggerHapticFeedback();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={handleScroll}
        decelerationRate="fast"
        snapToInterval={50} // Adjust as needed
        showsVerticalScrollIndicator={false}>
        {data.map((item, index) => (
          <TouchableOpacity
            onPress={onSelect(item)}
            key={index}
            style={[styles.item, item === selectedAge && styles.selectedItem]}>
            <Text
              style={item === selectedAge ? styles.selectedText : styles.text}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 16,
  },
  item: {
    width: WIDTH - 40,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 7,
  },
  selectedItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  text: {
    fontSize: 17,
    color: '#AAA',
    fontFamily: fonts.SF_REGULAR,
  },
  selectedText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WheelPicker;
