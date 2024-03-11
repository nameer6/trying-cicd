import {useEffect} from 'react';
import Contacts from 'react-native-contacts';
import {useDispatch} from 'react-redux';
import profile from 'src/helpers/http/profile';
import {showErrorToast} from 'src/helpers/mics';
import {updateContacts} from 'src/store/reducers/profileStore';

export default function useContacts(show: boolean) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        Contacts.getAll()
          .then((contacts: any) => {
            if (contacts?.length > 0) {
              const formattedContacts: any = [];
              contacts.forEach((item: any) => {
                const name = [item.givenName, item.familyName].join(' ');

                item.phoneNumbers.forEach((phoneNumberObj: any) => {
                  const phoneNumber = phoneNumberObj.number;
                  formattedContacts.push({
                    name,
                    phone_number: phoneNumber,
                  });
                });
              });
              const payload = formattedContacts;
              profile
                .getContactsToShare(payload)
                .then(res => {
                  if (res?.status) {
                    console.log('CONTACTSS: ' + JSON.stringify(res));
                    const contactsOnReveal = res?.data?.friends_on_reveal?.map(
                      (i: any) => {
                        return {
                          ...i,
                          isChecked: false,
                        };
                      },
                    );
                    const otherContacts = res?.data?.other_contacts
                      ?.map((i: any) => {
                        // Check if full_name is not empty or undefined
                        if (i.contact_name && i.contact_name.trim() !== '') {
                          return {
                            ...i,
                            full_name: i.contact_name,
                          };
                        }
                        // If full_name is empty or undefined, filter it out
                        return null;
                      })
                      .filter(Boolean);
                    dispatch(
                      updateContacts({
                        contactsOnReveal,
                        otherContacts,
                      }),
                    );
                    //   setContactsOnReveal(res?.data?.friends_on_reveal);
                  }
                })
                .catch(error => {
                  console.log('error: ' + JSON.stringify(error));
                });
            } else {
              showErrorToast("Seems like you don't have any contacts saved");
            }
          })
          .catch((error: any) => {
            showErrorToast(error + '');
          });
      }, 1200);
    }
  }, [dispatch, show]);
  return null;
}
