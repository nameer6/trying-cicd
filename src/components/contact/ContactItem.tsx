// import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import GradientButton from '../GradientButton';
import ProfileThumbnail from '../ProfileThumbnail';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import {ContactCardType} from 'src/helpers/types/profile.types';
import Icon from 'react-native-vector-icons/Entypo';
import {useMemo} from 'react';

type Props = {
  item: ContactCardType;
  onReveal: (item: ContactCardType) => void;
  is_in_contact?: boolean;
};

const ContactItem = ({item, onReveal, is_in_contact = true}: Props) => {
  // const navigation = useNavigation();
  const handleReveal = () => {
    onReveal(item);
  };

  // const goToProfile = () => {
  //   if (is_in_contact) {
  //     navigation.navigate(
  //       'RevealsWithOthers' as never,
  //       {
  //         userId: item.user_id || item.friend_user_id,
  //         name: item?.full_name || item?.friend_name,
  //       } as never,
  //     );
  //   }
  // };

  const userName = useMemo(() => {
    let firstName = '';
    let lastName = '';
    if (item.full_name) {
      firstName = item.full_name?.split(' ')[0];
      lastName = item.full_name?.split(' ')[1];
    } else {
      firstName = item.friend_name ? item.friend_name?.split(' ')[0] : '';
      lastName = item.friend_name ? item.friend_name?.split(' ')[1] : '';
    }

    if (!is_in_contact && lastName) {
      lastName = lastName.charAt(0);
    }

    return [firstName, lastName].join(' ')?.trim();
  }, [is_in_contact, item?.friend_name, item.full_name]);

  return (
    <View style={styles.contactItemRow}>
      <Pressable
        style={styles.contactDetails}
        // onPress={goToProfile}
        disabled={!is_in_contact}>
        <ProfileThumbnail image={item.user_image} name={item.full_name} />
        <View style={styles.nameArrowStyle}>
          <Text style={styles.contactName}>{userName}</Text>
          <Icon name="chevron-right" size={22} color="#999A9F" />
        </View>
      </Pressable>
      {!!is_in_contact && (
        <GradientButton
          onPress={handleReveal}
          style={styles.revealButton}
          radius={16}
          secondColorOffset="0.4">
          <Text style={styles.revealButtonText}>Reveal</Text>
        </GradientButton>
      )}
    </View>
  );
};

export default ContactItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    gap: 8,
  },
  nameArrowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 1,
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
    fontWeight: '600',
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
