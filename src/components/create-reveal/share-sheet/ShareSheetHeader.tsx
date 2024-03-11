import {Text, View} from 'react-native';
import SearchBox from 'src/components/SearchBox';
import {ContactCardType} from 'src/helpers/types/profile.types';
import {styles} from './styles';

type Props = {
  search: string;
  onSearch: (value: string) => void;
  shareDirectlyWith?: ContactCardType;
};

const ShareSheetHeader = ({search, onSearch, shareDirectlyWith}: Props) => {
  return (
    <>
      <View style={styles.sharSheetHeader}>
        <Text style={styles.shareHeaderTextStyle}>Reveal to:</Text>
      </View>
      {!shareDirectlyWith && (
        <SearchBox
          value={search}
          onChangeText={onSearch}
          containerStyle={styles.shareSearchStyle}
          inputStyle={styles.inputStyle}
        />
      )}
    </>
  );
};

export default ShareSheetHeader;
