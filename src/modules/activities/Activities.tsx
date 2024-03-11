import {useEffect, useMemo, useState} from 'react';
import {
  View,
  RefreshControl,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {FlashList} from '@shopify/flash-list';
// import {useDispatch} from 'react-redux';
// import Toast from 'react-native-toast-message';
import BackHeader from 'src/components/BackHeader';
import NoDataFound from 'src/components/NoDataFound';
import Loader from 'src/components/Loader';
import ActivityItem from './ActivityItem';
// import UnreadBadge from './UnreadBadge';
import {
  // RevealActivityType,
  SocialActivityType,
} from 'src/helpers/types/activities.types';
import activities from 'src/helpers/http/activities';
import {styles} from './styles';
// import {triggerHapticFeedback} from 'src/helpers/mics';
// import {setHasNotifications} from 'src/store/reducers/app-settings';
import {OneSignal} from 'react-native-onesignal';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  getNextPage,
  selectDataFromResponse,
} from 'src/helpers/react-query-helpers';

const LIMIT = 20;

const Activities = ({navigation}: any) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  // const dispatch = useDispatch();
  // const [showAllUnread, setShowAllUnread] = useState(false);
  // const queryClient = useQueryClient();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  }, []);

  // const {
  //   data: revealNotifiData,
  //   isLoading: isLoadingRevealNotifi,
  //   isRefetching: isRefetchingRevealNotifis,
  //   refetch: refetchRevealNotifi,
  // } = useQuery({
  //   queryKey: ['get-reveal-notifications'],
  //   queryFn: activities.getRevealNotifications,
  //   enabled: !!isReady,
  // });

  const {
    data: activitiesData,
    isLoading,
    hasNextPage,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['get-social-notifications'],
    queryFn: ({pageParam = 1}) =>
      activities.getSocialNotifications({
        page: pageParam,
        limit: LIMIT,
      }),
    initialPageParam: 1,
    enabled: !!isReady,
    getNextPageParam: (lastPage, allPages) => {
      return getNextPage({allPages, LIMIT});
    },
    select: data => selectDataFromResponse(data),
  });

  const DATA = useMemo(
    () => activitiesData?.pages || [],
    [activitiesData?.pages],
  );

  // console.log('activitiesData DATAaa: ' + JSON.stringify(DATA));

  // const {
  //   data: socialNotifiData,
  //   isLoading: isLoadingSocialNotifi,
  //   isRefetching: isRefetchingSocialNotifications,
  //   refetch: refetchSocialNotifications,
  // } = useQuery({
  //   queryKey: ['get-social-notifications'],
  //   queryFn: activities.getSocialNotifications,
  //   enabled: !!isReady,
  // });

  // const updateNotificationBadge = useCallback(() => {
  //   dispatch(setHasNotifications(false));
  // }, [dispatch]);

  useEffect(() => {
    if (
      // !isLoadingRevealNotifi &&
      !isLoading &&
      // !isRefetchingRevealNotifis &&
      !isRefetching
    ) {
      OneSignal.Notifications.clearAll();
      // updateNotificationBadge();
    }
  }, [isLoading, isRefetching]);

  // const removeNotificationLocally = (answer_id: string) => {
  //   queryClient.setQueryData(['get-reveal-notifications'], (prev: any) => {
  //     // console.log('PREVV: ' + JSON.stringify(prev));
  //     const prevData = prev?.data;
  //     // console.log('answerId: ' + answer_id);
  //     if (prevData) {
  //       const foundIndex = prevData?.findIndex(i => i.answer_id === answer_id);

  //       // console.log('prevData foundIndex: ' + foundIndex);
  //       if (foundIndex !== -1) {
  //         prevData.splice(foundIndex, 1);
  //       }
  //       console.log('prevData: ' + JSON.stringify(prev?.total));
  //       return {data: prevData, total: prev?.total - 1};
  //     }
  //   });
  // };

  const goToPostDetailsScreen =
    (answer_id: string, is_read: boolean, type?: string) => () => {
      // if (is_read) {
      //   removeNotificationLocally(answer_id);
      // }
      navigation.navigate('RevealPostScreen', {
        revealId: answer_id,
        type,
      });
    };

  // const showRevealSomethingToast = () => {
  //   triggerHapticFeedback('notificationWarning');
  //   Toast.show({
  //     type: 'infoToast',
  //     props: {
  //       title:
  //         'To see the locked reveals, please reveal something about yourself!',
  //     },
  //   });
  // };

  // const handleRevealNotificationClick = (item: RevealActivityType) => () => {
  //   if (item.is_locked) {
  //     showRevealSomethingToast();
  //   } else {
  //     goToPostDetailsScreen(
  //       item.answer_id || item?.payload_data?.answer_id,
  //       Boolean(item.is_locked),
  //     )();
  //   }
  // };

  // const renderRevealsActivityItem = (item: RevealActivityType) => {
  //   return (
  //     <ActivityItem
  //       onPress={handleRevealNotificationClick(item)}
  //       item={{
  //         full_name: item.shared_by?.full_name,
  //         date_created: item.reveal_date,
  //         user_image: item?.shared_by?.user_image,
  //         sharedWith: item.shared_with_total || 0,
  //         type: 'REVEAL',
  //       }}
  //     />
  //   );
  // };
  const renderSocailActivityItem = ({item}: {item: SocialActivityType}) => {
    return (
      <ActivityItem
        onPress={goToPostDetailsScreen(
          item?.payload_data?.answer_id,
          Boolean(item?.is_read),
          item.notification_type,
        )}
        item={{
          full_name: item.full_name,
          date_created: item.date_created,
          user_image: item?.user_image,
          type: item?.notification_type,
          message: item?.message,
        }}
      />
    );
  };
  // const showAllActivties = () => {
  //   setShowAllUnread(true);
  // };

  const onRefresh = () => {
    // refetchRevealNotifi();
    refetch();
  };

  useEffect(() => {
    // PushNotificationIOS.getApplicationIconBadgeNumber(res => {
    //   alert(JSON.stringify(res));
    // });
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
  }, []);

  // const renderRevealActivities = () => (
  //   <View style={styles.topNotifications}>
  //     {revealNotifiData?.data?.length > 0 && (
  //       <UnreadBadge unreadCounts={revealNotifiData?.total} />
  //     )}
  //     <FlatList
  //       data={
  //         showAllUnread
  //           ? revealNotifiData?.data
  //           : revealNotifiData?.data?.slice(0, 2)
  //       }
  //       renderItem={({item}) => renderRevealsActivityItem(item)}
  //       keyExtractor={item => item.answer_id}
  //       scrollEnabled={false}
  //     />
  //     {!showAllUnread && revealNotifiData?.data.length > 2 && (
  //       <TouchableOpacity
  //         style={styles.seeMoreStyle}
  //         onPress={showAllActivties}>
  //         <Text style={styles.seeMoreTextStyle}>
  //           see {revealNotifiData?.data?.length - 2} more
  //         </Text>
  //       </TouchableOpacity>
  //     )}
  //   </View>
  // );

  const fetchNext = () => {
    if (
      DATA.length > 9 &&
      !isLoading &&
      !isFetchingNextPage &&
      !isRefetching &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Activity" />

      {(isLoading || !isReady) && <Loader inCenter />}

      {DATA?.length === 0 && !isLoading && !isRefetching && isReady && (
        <NoDataFound noDataText="You don't have any activity." inCenter />
      )}

      {isReady && !isLoading && (
        <FlashList
          data={DATA || []}
          renderItem={renderSocailActivityItem}
          keyExtractor={item => `scl-notif-${item.user_notification_id}`}
          contentContainerStyle={styles.notificationsContainer}
          estimatedItemSize={100}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            DATA?.length > 0 ? (
              isFetchingNextPage ? (
                <ActivityIndicator style={styles.loadeMoreStyle} color="#fff" />
              ) : null
            ) : null
          }
          onEndReached={fetchNext}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              tintColor="#fff"
              refreshing={isRefetching}
            />
          }
          // ListHeaderComponent={
          //   <>
          //     {renderRevealActivities()}
          //     <Text style={styles.labelStyle}>Social</Text>
          //   </>
          // }
        />
      )}
    </View>
  );
};

export default Activities;
