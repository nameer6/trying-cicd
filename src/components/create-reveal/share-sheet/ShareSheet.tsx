import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {useQueryClient} from '@tanstack/react-query';
import Feather from 'react-native-vector-icons/Feather';
import GradientButton from 'src/components/GradientButton';
import ContactItem from 'src/components/create-reveal/ContactItem';
import ShareOnDMs from './ShareOnDMs';
import ShareSheetHeader from './ShareSheetHeader';
import profile from 'src/helpers/http/profile';
import {
  showErrorToast,
  showSuccessToast,
  triggerHapticFeedback,
} from 'src/helpers/mics';
import {ContactCardType} from 'src/helpers/types/profile.types';
import reveals from 'src/helpers/http/reveals';
import {styles} from './styles';
import Loader from 'src/components/Loader';
import SheetBackdrop from 'src/components/bottom-sheet-components/SheetBackdrop';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import {Easing} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {updateRevealToPost} from 'src/store/reducers/createReveal';
import DeviceContacts from './DeviceContacts';

const HEIGHT = Dimensions.get('window').height;

type Props = {
  answer_id?: string;
  shareOnSocial: (share_data?: any) => void;
  shareDirectlyWith?: ContactCardType;
  show: boolean;
  onClose: (isShared?: boolean) => void;
  location?: string;
};

const ShareSheet = ({
  answer_id,
  shareOnSocial,
  shareDirectlyWith,
  show,
  onClose,
  location = 'home',
}: Props) => {
  const dispatch = useDispatch();
  const {contactsOnReveal, otherContacts} = useSelector(
    (state: any) => state.myProfile,
  );
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>('');
  const [loadingLink, setLoadingLink] = useState<boolean>(true);
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [friends, setFriends] = useState<ContactCardType[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [deviceContacts, setDeviceContacts] = useState<ContactCardType[]>([]);
  const [shareData, setShareData] = useState<any>(null);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);

  // useEffect(() => {
  //   if (show && contactsOnReveal?.length > 0) {
  //     setFriends(JSON.parse(JSON.stringify(contactsOnReveal)));
  //   }
  // }, [contactsOnReveal, show]);

  // useEffect(() => {
  //   if (show && otherContacts?.length > 0) {
  //     setDeviceContacts(JSON.parse(JSON.stringify(otherContacts)));
  //   }
  // }, [otherContacts, show]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => {
    bottomSheetRef.current?.present();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  // const getContacts = useCallback(() => {
  //   setLoadingContacts(true);
  //   Contacts.getAll()
  //     .then((contacts: any) => {
  //       if (contacts?.length > 0) {
  //         const formattedContacts: any = [];
  //         contacts.forEach((item: any) => {
  //           const name = [item.givenName, item.familyName].join(' ');

  //           item.phoneNumbers.forEach((phoneNumberObj: any) => {
  //             const phoneNumber = phoneNumberObj.number;
  //             formattedContacts.push({
  //               name,
  //               phone_number: phoneNumber,
  //             });
  //           });
  //         });
  //         const payload = formattedContacts;
  //         profile
  //           .getContactsToShare(payload)
  //           .then(res => {
  //             if (res?.status) {
  //               console.log('CONTACTSS: ' + JSON.stringify(res));
  //               setFriends(res?.data?.friends_on_reveal);
  //               setLoadingContacts(false);
  //             }
  //           })
  //           .catch(error => {
  //             setLoadingContacts(false);
  //             console.log('error: ' + JSON.stringify(error));
  //           });
  //       } else {
  //         setLoadingContacts(false);
  //         showErrorToast("Seems like you don't have any contacts saved");
  //       }
  //     })
  //     .catch((error: any) => {
  //       showErrorToast(error + '');
  //     });
  // }, []);

  useEffect(() => {
    if (show) {
      // getContacts();
      setIsShared(false);
      openSheet();
    } else {
      closeSheet();
    }
  }, [show]);

  // Handlers
  const handleSheetChange = (index: number) => {
    if (index === -1) {
      setSelectedFriends([]);
      onClose(isShared);
    }
  };

  const getRevealLink = useCallback(() => {
    console.log('answer_id: ' + answer_id);
    setLoadingLink(true);
    answer_id &&
      reveals
        .generateShareLink(answer_id)
        .then(async res => {
          console.log('Share link res: ', res);
          setShareData(res?.data);
          setLoadingLink(false);
        })
        .catch(err => {
          console.log('Share link error: ', err);
          showErrorToast(err + '');
          setLoadingLink(false);
        });
  }, [answer_id]);

  useEffect(() => {
    if (answer_id) {
      getRevealLink();
    }
  }, [answer_id, getRevealLink]);

  const FilteredData = useMemo(() => {
    if (!search) {
      return contactsOnReveal;
    } else {
      return contactsOnReveal.filter(item =>
        item.full_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );
    }
  }, [contactsOnReveal, search]);

  const FilteredOtherCotacts = useMemo(() => {
    if (!search) {
      return otherContacts;
    } else {
      return otherContacts.filter(item =>
        item.full_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );
    }
  }, [otherContacts, search]);

  const renderContactItem = ({item}: any) => {
    const isSelected = selectedFriends.includes(item.user_id);
    return (
      <ContactItem item={item} onSelect={onSelect} isChecked={isSelected} />
    );
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onSelect = (item: ContactCardType) => {
    setSelectedFriends(prevFriendIds => {
      const isFriend = prevFriendIds.includes(item.user_id);

      if (isFriend) {
        // User exists, remove it
        const updatedFriendIds = prevFriendIds.filter(
          (id: string) => id !== item.user_id,
        );
        return updatedFriendIds;
      } else {
        // User doesn't exist, add it
        return [...prevFriendIds, item.user_id];
      }
    });
  };

  const selected = useMemo(() => {
    return selectedFriends?.length > 0;
    // return friends.some(i => i.isChecked);
  }, [selectedFriends?.length]);

  const handleShare = useCallback(
    async (e: any) => {
      if (saving) {
        return;
      }
      setSaving(true);
      setIsShared(true);
      triggerHapticFeedback();
      // const selectedFriends = friends.filter(i => i.isChecked);
      // // const selectedRecents = recentsData.filter(i => i.isChecked);
      // let combinedData = [...selectedFriends];

      // if (e.sendToGroup) {
      //   combinedData = [...recentsData];
      // } else {
      //   combinedData = [...selectedRecents, ...selectedFriends];
      // }
      let friend_user_ids = [...selectedFriends];
      if (shareDirectlyWith) {
        const userid: any =
          shareDirectlyWith?.user_id || shareDirectlyWith?.friend_user_id;
        friend_user_ids = [userid];
      }
      console.log('selectedFriendss: ', friend_user_ids);
      console.log('answer_id ', answer_id);

      const payload = {
        answer_id,
        friend_user_ids,
      };
      if (answer_id) {
        shareOnSocial();
        await dispatch(updateRevealToPost(payload));
      }
      setTimeout(() => {
        closeSheet();
      }, 300);
      setTimeout(() => {
        setSaving(false);
      }, 500);
      // answer_id &&
      //   reveals
      //     .shareReveal(payload)
      //     .then(res => {
      //       console.log('Share reveal data: ' + JSON.stringify(res));
      //       if (shareDirectlyWith) {
      //         queryClient.refetchQueries(['get-recents'] as never);
      //       }
      //       setSaving(false);
      //       if (res?.status) {
      //         closeSheet();
      //         const data = res?.data;
      //         if (!e.sendToGroup) {
      //           shareOnSocial &&
      //             shareOnSocial({...shareData, unlockData: data});
      //         } else {
      //           showSuccessToast(res?.message);
      //           setIsSentToGroup(true);
      //         }
      //       }
      //     })
      //     .catch(err => {
      //       setSaving(false);
      //       showErrorToast(err + '');
      //     });
    },
    [
      saving,
      selectedFriends,
      shareDirectlyWith,
      answer_id,
      shareOnSocial,
      dispatch,
    ],
  );

  const onSelectAll = () => {
    // contactsOnReveal
    const allFriends = [...contactsOnReveal];
    if (!allSelected) {
      const ids = allFriends.map(i => i.user_id);
      setSelectedFriends(ids);
    } else {
      setSelectedFriends([]);
    }
    setAllSelected(prev => !prev);
  };

  useEffect(() => {
    if (
      show &&
      answer_id &&
      (shareDirectlyWith?.user_id || shareDirectlyWith?.friend_user_id)
    ) {
      const json = {
        shareDirectlyWith: shareDirectlyWith?.user_id,
        show,
        answer_id,
      };
      console.log('jjhdah: ' + JSON.stringify(json));
      handleShare({sendToGroup: false});
    }
  }, [
    show,
    answer_id,
    shareDirectlyWith?.user_id,
    shareDirectlyWith?.friend_user_id,
  ]);

  const loading = useMemo(() => {
    return loadingContacts;
  }, [loadingContacts]);

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <GradientButton
          style={styles.submitButtonStyle}
          disabled={!selected || saving}
          loading={saving}
          radius={32}
          delay={20}
          onPress={handleShare}>
          <Text style={styles.submitButtonText}>Reveal</Text>

          <View style={styles.arrowButton}>
            <Feather name="arrow-up" color="#fff" size={30} />
          </View>
        </GradientButton>
      </BottomSheetFooter>
    ),
    [handleShare, saving, selected],
  );

  // const animationConfigs = useBottomSheetTimingConfigs({
  //   duration: 0,
  //   easing: Easing.linear,
  // });

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      stackBehavior="push"
      index={show ? 0 : -1}
      snapPoints={[HEIGHT / 1.8, HEIGHT]}
      topInset={50}
      // animationConfigs={animationConfigs}
      keyboardBehavior="interactive"
      // keyboardBlurBehavior="restore"
      onChange={handleSheetChange}
      style={sheetShadowStyle}
      enableHandlePanningGesture
      enablePanDownToClose
      enableDismissOnClose
      backgroundStyle={sheetContainerStyle}
      handleIndicatorStyle={sheetIndicatorStyle}
      footerComponent={selected && !loading ? renderFooter : undefined}
      backdropComponent={renderBackdrop}>
      <View style={styles.container}>
        {!!show && (
          <>
            <>
              <ShareSheetHeader
                search={search}
                onSearch={onSearch}
                shareDirectlyWith={shareDirectlyWith}
              />
              {shareDirectlyWith && (
                <ContactItem item={shareDirectlyWith} isChecked={true} />
              )}
            </>
            {loading && <Loader />}

            {!loading && !shareDirectlyWith && (
              <BottomSheetFlatList
                nestedScrollEnabled
                data={FilteredData}
                renderItem={renderContactItem}
                keyExtractor={item => item.user_id}
                style={styles.flatListStyle}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollviewStyle}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <>
                    {FilteredData?.length > 0 && (
                      <View style={styles.revealToSectionHeader}>
                        <Text style={styles.title}>Contacts on Reveal</Text>
                        <TouchableOpacity onPress={onSelectAll}>
                          <Text style={styles.title}>
                            {allSelected ? 'Unselect All' : 'Select All'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                }
                ListFooterComponent={
                  <>
                    <ShareOnDMs
                      shareableUrl={
                        shareData?.share_url || shareData?.shareLink
                      }
                    />
                    <DeviceContacts
                      answer_id={answer_id}
                      otherContacts={FilteredOtherCotacts}
                      shareableUrl={
                        shareData?.share_url || shareData?.shareLink
                      }
                    />
                  </>
                }
                // ListEmptyComponent={
                //   !loading && !!search ? (
                //     <Text style={styles.noSearchFound}>
                //       No contact found with{' '}
                //       <Text style={styles.boldText}>'{search}'</Text>
                //     </Text>
                //   ) : null
                // }
              />
            )}
          </>
        )}
      </View>
    </BottomSheetModal>
  );
};

export default ShareSheet;
