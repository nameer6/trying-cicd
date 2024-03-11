import {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {useDispatch} from 'react-redux';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import ContactItem from 'src/components/contact/ContactItem';
import Loader from 'src/components/Loader';
import SearchBox from 'src/components/SearchBox';
import profile from 'src/helpers/http/profile';
import {showErrorToast, showSuccessToast} from 'src/helpers/mics';
import {ContactCardType} from 'src/helpers/types/profile.types';
import {updateShareDirectlyWith} from 'src/store/reducers/createReveal';

const ContactsList = () => {
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [foundContacts, setFoundContacts] = useState<ContactCardType[]>([]);
  const dispatch = useDispatch();

  const getContacts = () => {
    setLoading(true);
    Contacts.getAll()
      .then((contacts: any) => {
        // console.log('Contacts: ' + JSON.stringify(contacts));
        if (contacts?.length > 0) {
          const formattedContacts = contacts.map((i: any) => {
            return {
              contact_id: i.recordID,
              phone_number: i.phoneNumbers[0]?.number,
            };
          });
          const payload = formattedContacts;
          console.log(
            'contacts payload:: ' + JSON.stringify(formattedContacts),
          );
          profile
            .syncContacts(payload)
            .then(res => {
              console.log('contacts res: ' + JSON.stringify(res));
              if (res?.status) {
                setFoundContacts(res?.data);
              }
              setLoading(false);
            })
            .catch(error => {
              console.log('error: ' + JSON.stringify(error));
            });
        } else {
          showErrorToast("Seems like you don't have any contacts saved");
          setLoading(false);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        showErrorToast(error + '');
      });
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      }).then(() => {
        getContacts();
      });
    } else {
      getContacts();
    }
  }, []);

  const FilteredData = useMemo(() => {
    if (!search) {
      return foundContacts;
    } else {
      return foundContacts.filter(item =>
        item.full_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );
    }
  }, [foundContacts, search]);

  const onReveal = async (selecteduser: ContactCardType) => {
    dispatch(updateShareDirectlyWith(selecteduser));
  };

  const renderContactItem = ({item}: any) => (
    <ContactItem item={item} onReveal={onReveal} />
  );

  const onSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>From Contacts</Text>
      <SearchBox value={search} onChangeText={onSearch} />
      {loading && <Loader style={styles.loader} />}
      {!loading && (
        <FlatList
          data={FilteredData}
          renderItem={renderContactItem}
          keyExtractor={item => item.user_id}
          style={styles.flatListStyle}
          ListEmptyComponent={
            !loading && !!search ? (
              <Text style={styles.noSearchFound}>
                No contact found with{' '}
                <Text style={styles.boldText}>'{search}'</Text>
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default ContactsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 40,
  },
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
