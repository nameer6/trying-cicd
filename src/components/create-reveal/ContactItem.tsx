import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import CheckBox from 'src/modules/permission-screen/CheckBox';
import ProfileThumbnail from '../ProfileThumbnail';
import StreakTag from '../StreakTag';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import {ContactCardType} from 'src/helpers/types/profile.types';

type Props = {
  item: ContactCardType;
  isChecked: boolean;
  onSelect?: (item: ContactCardType) => void;
};

const ContactItem = ({item, isChecked, onSelect}: Props) => {
  const onCheck = () => {
    onSelect && onSelect(item);
  };
  return (
    <TouchableOpacity onPress={onCheck} style={styles.contactItemRow}>
      <View style={styles.contactDetails}>
        <ProfileThumbnail
          image={item.user_image}
          name={item.full_name || item.friend_name}
        />
        <View>
          <Text style={styles.contactName}>{item.full_name}</Text>
          {item?.max_streak && Number(item?.max_streak) > 0 && (
            <StreakTag days={item.max_streak} />
          )}
        </View>
      </View>
      <View>
        <CheckBox isChecked={isChecked} />
      </View>
    </TouchableOpacity>
  );
};

export default ContactItem;

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  /* Contact item */
  flatListStyle: {
    marginTop: 20,
  },
  contactItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  revealButton: {
    width: 78,
    height: 32,
  },
  revealButtonText: {
    fontWeight: 'bold',
    color: colors.bgColor,
    fontSize: 15,
  },
  noSearchFound: {
    fontFamily: fonts.SF_REGULAR,
    color: colors.inputPlaceHolderColor,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
