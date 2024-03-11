import React from 'react';
import {FlatList, View} from 'react-native';
import Share from 'react-native-share';
import ContactItem from 'src/components/contact/ContactItem';
import reveals from 'src/helpers/http/reveals';
import {ContactCardType} from 'src/helpers/types/profile.types';

type Props = {
  otherContacts: ContactCardType[];
  shareableUrl: string;
  answer_id?: string;
};

const DeviceContacts = React.memo(
  ({otherContacts, shareableUrl, answer_id}: Props) => {
    const shareOnMessage = (item: ContactCardType) => () => {
      if (!shareableUrl || !answer_id) {
        return;
      }
      const payload = {
        answer_id,
        phone_number: item.phone_number,
        contact_name: item.full_name,
      };
      console.log('payload: ' + JSON.stringify(payload));
      reveals.shareWithOtherContact(payload).then(res => {
        console.log('other share res: ' + JSON.stringify(res));
      });
      Share.shareSingle({
        social: Share.Social.SMS,
        recipient: item.phone_number,
        message: shareableUrl,
      });
    };

    const renderItem = ({item}: {item: ContactCardType}) => (
      <ContactItem item={item} is_in_contact onReveal={shareOnMessage(item)} />
    );
    return (
      <View>
        <FlatList
          data={otherContacts}
          renderItem={renderItem}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.otherContacts === nextProps.otherContacts &&
    prevProps.shareableUrl === nextProps.shareableUrl,
);

export default DeviceContacts;
