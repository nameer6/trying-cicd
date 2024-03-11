import {useEffect, useRef} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {ContactCardType} from 'src/helpers/types/profile.types';
import ContactItem from 'src/components/contact/ContactItem';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

type Props = {
  TaggedUserListData: ContactCardType[];
  onReveal: (item: ContactCardType) => void;
};

const TaggedUserListing = ({TaggedUserListData, onReveal}: Props) => {
  const listRef = useRef<any>();

  const renderUserItem = ({item}: {item: ContactCardType}) => {
    return (
      <ContactItem
        item={item}
        onReveal={onReveal}
        is_in_contact={item.is_in_contact}
      />
    );
  };

  useEffect(() => {
    if (TaggedUserListData?.length > 0) {
      listRef?.current?.scrollToOffset({animated: true, offset: 0});
    }
  }, [TaggedUserListData]);

  return (
    <>
      {TaggedUserListData?.length >= 0 ? (
        <Text style={styles.TaggedUserListingCountText}>
          {TaggedUserListData?.length} others
        </Text>
      ) : null}
      <BottomSheetFlatList
        data={TaggedUserListData}
        renderItem={renderUserItem}
        style={styles.flatListStyle}
        ref={listRef}
        nestedScrollEnabled
      />
    </>
  );
};

export default TaggedUserListing;

const styles = StyleSheet.create({
  flatListStyle: {
    paddingHorizontal: 16,
    marginVertical: 19,
  },
  loader: {
    marginTop: 20,
  },
  TaggedUserListingCountText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginTop: 0,
  },
});
