import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  onClose: () => void;
};

const Header = ({onClose}: Props) => {
  return (
    <View style={styles.header}>
      <View style={[styles.headerButton, styles.transparent]} />

      <Text style={styles.headerTitleText}>Reveal</Text>

      <TouchableOpacity style={styles.headerButton} onPress={onClose}>
        <Icon name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 99,
    marginTop: 24,
  },
  headerTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  headerButton: {
    height: 44,
    width: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 54, 63, 0.80)',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
