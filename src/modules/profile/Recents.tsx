import {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import ContactItem from 'src/components/contact/ContactItem';
import {useDispatch} from 'react-redux';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import {ContactCardType} from 'src/helpers/types/profile.types';
import {updateShareDirectlyWith} from 'src/store/reducers/createReveal';
import reveals from 'src/helpers/http/reveals';

const Recents = () => {
  const dispatch = useDispatch();

  const {data, isLoading} = useQuery({
    queryKey: ['get-recents'],
    queryFn: () => reveals.getRecents(),
  });

  const RecentContacts = useMemo(() => {
    return data?.data;
  }, [data?.data]);

  const onReveal = (selecteduser: ContactCardType) => {
    dispatch(updateShareDirectlyWith(selecteduser));
  };

  const renderContactItem = ({item}: {item: ContactCardType}) => (
    <ContactItem item={item} onReveal={onReveal} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recents</Text>
      {isLoading && <ActivityIndicator style={styles.loader} color="#fff" />}

      {!isLoading && (
        <FlatList
          data={RecentContacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.user_id}
          style={styles.flatListStyle}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.noSearchFound}>
                You don’t have recents reveal
              </Text>
            )
          }
        />
      )}
    </View>
  );
};

export default Recents;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 14,
  },
  /* Contact item */
  flatListStyle: {
    marginTop: 14,
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
