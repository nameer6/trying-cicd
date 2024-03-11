import {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COUNTRY_CODES} from 'src/consts/COUNTRY_CODES';
import {styles} from './countrypicker-styles';

type Props = {
  show: boolean;
  onClose: () => void;
  onSelect: (selected: any) => void;
};

const CountryPicker = ({show, onClose, onSelect}: Props) => {
  const [search, setSearch] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const onSelectCode = (item: any) => () => {
    onSelect(item);
    onClose();
  };
  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.countryCodeItem}
        onPress={onSelectCode(item)}>
        <Text style={styles.flagStyle}>{item.flag}</Text>
        <Text style={styles.countryNameStyle}>
          {item.name} ({item.dial_code})
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (show) {
      setIsFocused(true);
    }
  }, [show]);

  const FilteredData = useMemo(() => {
    if (!search) {
      return COUNTRY_CODES;
    } else {
      return COUNTRY_CODES.filter(item => item.name.includes(search));
    }
  }, [search]);
  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="gray" />
            </TouchableOpacity>
            <TextInput
              placeholder="Search"
              placeholderTextColor="gray"
              style={styles.inputStyle}
              value={search}
              onChangeText={setSearch}
              autoFocus={isFocused}
            />
          </View>
          <FlatList
            data={FilteredData}
            renderItem={renderItem}
            keyboardShouldPersistTaps
          />
        </View>
      </View>
    </Modal>
  );
};

export default CountryPicker;
