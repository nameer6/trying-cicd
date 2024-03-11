import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  InteractionManager,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useInfiniteQuery} from '@tanstack/react-query';
import {styles} from './styles';
import reveals from 'src/helpers/http/reveals';
import BackHeader from 'src/components/BackHeader';
import CommentsSheet from 'src/components/comment-sheet/CommentsSheet';
import SocialMediaShareSheet from 'src/components/socialmedial-share-sheet/SocialMediaShareSheet';
import DeleteShareSheet from 'src/components/socialmedial-share-sheet/DeleteShareSheet';
import Spinner from 'src/components/Spinner';
import RevealCard from 'src/modules/home/components/reveal-card/RevealCard';
import {
  RevealTimelineType,
  ShareDataType,
} from 'src/helpers/types/reveal.types';
import {showSuccessToast} from 'src/helpers/mics';
import {
  getNextPage,
  selectDataFromResponse,
} from 'src/helpers/react-query-helpers';
import NoDataFound from 'src/components/NoDataFound';
import Loader from 'src/components/Loader';
import GearIcon from 'src/assets/icons/gear.svg';
import ProfileBanner from './ProfileBanner';

const LIMIT = 10;

const Profile = ({navigation}: any) => {
  const [ready, setReady] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [commentsModalState, setCommentsModalState] = useState<{
    answerId?: string;
    show: boolean;
    total_comments?: number;
  }>({
    show: false,
  });

  const [socialMediaShareSheetState, setSocialMediaShareSheetState] = useState<{
    show: boolean;
    shareData?: ShareDataType;
  }>({show: false});
  const [deleteAndShareSheet, setdeleteAndShareSheet] = useState<{
    show: boolean;
    answer_id?: string;
  }>({show: false});

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
  }, []);

  const {
    data: archivesData,
    isLoading,
    hasNextPage,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['get-my-archives'],
    queryFn: ({pageParam = 1}) =>
      reveals.getArchivePosts({
        page: pageParam,
        limit: LIMIT,
      }),
    initialPageParam: 1,
    enabled: !!ready,
    getNextPageParam: (lastPage, allPages) => {
      return getNextPage({allPages, LIMIT});
    },
    select: data => selectDataFromResponse(data),
  });

  const DATA = React.useMemo(
    () => archivesData?.pages || [],
    [archivesData?.pages],
  );

  // console.log('DATA: ' + JSON.stringify(DATA));

  const closeDeleteShareSheet = () => {
    setdeleteAndShareSheet({
      show: false,
    });
  };

  const deleteArchivePostAPI = () => {
    setIsDeleting(true);
    const answer_id = deleteAndShareSheet?.answer_id;
    closeDeleteShareSheet();
    reveals
      .deleteArchivePosts(answer_id)
      .then(res => {
        refetch();
        console.log('delete res:' + JSON.stringify(res));
        setIsDeleting(false);
        showSuccessToast(res?.message);
      })
      .catch(error => {
        setIsDeleting(false);
        console.log('Error: ' + JSON.stringify(error));
      });
  };

  const onDeletePost = () => {
    Alert.alert(
      'Delete this reveal?',
      'This reveal will be permanently erased if deleted',
      [
        {
          text: 'Delete',
          onPress: () => deleteArchivePostAPI(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          onPress: closeDeleteShareSheet,
          style: 'default',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      },
    );
  };

  const handleShareViaDeleteSheet = (answer_id: string) => {
    setdeleteAndShareSheet({
      show: true,
      answer_id,
    });
  };

  const openComments = (item: RevealTimelineType) => () => {
    setCommentsModalState({
      show: true,
      answerId: item.answer_id,
      total_comments: item.total_comments,
    });
  };

  const closeCommentsModal = () => {
    setCommentsModalState({
      show: false,
    });
  };

  const handleShare = (shareData: ShareDataType) => {
    setSocialMediaShareSheetState({
      show: true,
      shareData,
    });
  };
  const closeSocialShareSheet = () => {
    setSocialMediaShareSheetState({
      show: false,
    });
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <RevealCard
        revealData={item}
        index={index}
        openComments={openComments(item)}
        onRefresh={refetch}
        isOwnReveal
        onDeleteItem={onDeletePost}
        onShare={handleShare}
        onMorePress={handleShareViaDeleteSheet}
      />
    );
  };

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

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

  const onRefresh = () => {
    refetch();
  };

  const SettingsButton = (
    <TouchableOpacity onPress={goToSettings}>
      <GearIcon />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <BackHeader style={styles.header} rightComponent={SettingsButton} />
        <Spinner
          loading={isDeleting}
          spinnerContainerStyle={styles.loaderStyle}
        />

        {!isLoading && DATA?.length === 0 && (
          <ProfileBanner style={styles.profileBanner} />
        )}

        {DATA?.length !== 0 && !isLoading && (
          <FlatList
            data={DATA || []}
            keyExtractor={(item: RevealTimelineType) => item.answer_id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={styles.flatListStyle}
            onEndReachedThreshold={0.1}
            // estimatedItemSize={360}
            ListHeaderComponent={<ProfileBanner style={styles.profileBanner} />}
            ListFooterComponent={
              DATA?.length > 0 ? (
                isFetchingNextPage ? (
                  <ActivityIndicator
                    style={styles.loadeMoreStyle}
                    color="#fff"
                  />
                ) : null
              ) : null
            }
            onEndReached={fetchNext}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={onRefresh}
                tintColor="#fff"
              />
            }
          />
        )}
        {(!ready || isLoading || (isRefetching && DATA?.length === 0)) && (
          <Loader inCenter />
        )}

        {DATA?.length === 0 && !isLoading && !isRefetching && ready && (
          <NoDataFound
            noDataText="You haven’t sent any reveals."
            inCenter
            style={styles.noDataFound}
          />
        )}
      </View>
      <CommentsSheet
        answerId={commentsModalState.answerId}
        show={commentsModalState.show}
        closeCommentsModal={closeCommentsModal}
        total_comments={commentsModalState?.total_comments}
      />
      <SocialMediaShareSheet
        show={socialMediaShareSheetState?.show}
        shareData={socialMediaShareSheetState?.shareData}
        onClose={closeSocialShareSheet}
      />
      <DeleteShareSheet
        show={deleteAndShareSheet?.show}
        answer_id={deleteAndShareSheet?.answer_id}
        onClose={closeDeleteShareSheet}
        onPressDeletePost={onDeletePost}
      />
    </>
  );
};

export default Profile;
