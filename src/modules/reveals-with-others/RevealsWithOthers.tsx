import {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, InteractionManager, View} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {FlashList} from '@shopify/flash-list';
import {styles} from './styles';
import reveals from 'src/helpers/http/reveals';
import BackHeader from 'src/components/BackHeader';
import RevealCard from '../home/components/reveal-card/RevealCard';
import {
  RevealTimelineType,
  ShareDataType,
} from 'src/helpers/types/reveal.types';
import CommentsSheet from 'src/components/comment-sheet/CommentsSheet';
import PostMoreOptions from 'src/components/socialmedial-share-sheet/PostMoreOptions';
import ReportPostReasonContentSheet from 'src/components/socialmedial-share-sheet/ReportPostReasonContentSheet';
import SocialMediaShareSheet from 'src/components/socialmedial-share-sheet/SocialMediaShareSheet';
import DeleteShareSheet from 'src/components/socialmedial-share-sheet/DeleteShareSheet';
import {showErrorToast, showSuccessToast} from 'src/helpers/mics';
import StreakTag from 'src/components/StreakTag';
import {useSelector} from 'react-redux';
import Loader from 'src/components/Loader';
import NoDataFound from 'src/components/NoDataFound';
import NoDataIcon from 'src/assets/images/no-data.svg';
import {NoDataStyle} from 'src/common/common-styles';

const LIMIT = 10;

const RevealsWithOthers = ({route, navigation}: any) => {
  const {user: loggedInUser} = useSelector((state: any) => state.myProfile);
  const [ready, setReady] = useState<boolean>(false);
  const [user, setUser] = useState<{
    userId: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [commentsModalState, setCommentsModalState] = useState<{
    answerId?: string;
    show: boolean;
    total_comments?: number;
  }>({
    show: false,
  });

  const [postExtraOptionSheet, setpostExtraOptionSheet] = useState<{
    postItem?: RevealTimelineType;
    show: boolean;
  }>({
    show: false,
  });
  const [reportContentSheet, setreportContentSheet] = useState<{
    postItem?: RevealTimelineType;
    show: boolean;
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
    if (route?.params?.userId) {
      setUser({
        userId: route?.params?.userId,
        name: route?.params?.name,
      });
    }
  }, [route?.params?.name, route?.params?.userId]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
  }, []);

  const {
    data: revealData,
    isLoading,
    hasNextPage,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ['get-reveals-with-others', user?.userId],
    queryFn: ({pageParam = 1}) =>
      reveals.getRevealsWithOthers({
        page: pageParam,
        limit: LIMIT,
        userId: user?.userId,
      }),
    initialPageParam: 1,
    enabled: !!ready,
    getNextPageParam: (lastPage, allPages) => {
      try {
        const currentDataCount = allPages.reduce(
          (sum: number, item: any) => (sum += item?.data?.reveals?.length),
          0,
        );
        const total = allPages[0]?.total;
        console.log('Total data: ' + total);
        const totalPages = Math.ceil(total / LIMIT);
        const currentPage = Math.ceil(currentDataCount / LIMIT);
        console.log('Total pages: ' + totalPages);
        console.log('currentPage: ' + currentPage);

        if (currentPage < totalPages) {
          const nextPage = currentPage + 1;
          return nextPage;
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    },
    select: data => {
      return {
        pages: data.pages.flatMap((x: any) => x?.data?.reveals),
        pageParams: data.pageParams,
        info: data.pages[0].data?.info,
      };
    },
  });

  const userInfo = useMemo(() => revealData?.info || [], [revealData?.info]);
  // console.log('userInfo: ' + JSON.stringify(userInfo));

  const DATA = useMemo(() => revealData?.pages || [], [revealData?.pages]);
  console.log('DATA::=> ' + JSON.stringify(DATA));

  const hendleExtraOptions = (item: any) => {
    console.log('selected item');
    setpostExtraOptionSheet({
      show: true,
      postItem: item,
    });
  };

  const closeExtraOptionSheet = () => {
    setpostExtraOptionSheet({
      show: false,
    });
  };
  const hendleReportContentSheet = (postItem: any) => {
    setpostExtraOptionSheet({
      show: false,
    });
    setTimeout(() => {
      setreportContentSheet({
        show: true,
        postItem: postItem,
      });
    }, 500);
  };

  const closeReportContentSheet = () => {
    setreportContentSheet({
      show: false,
    });
  };
  const onRefreshData = () => {
    setpostExtraOptionSheet({
      show: false,
    });
    navigation.goBack();
  };

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
        console.log('delete res:' + JSON.stringify(res));
        setIsDeleting(false);
        showSuccessToast(res?.message);
        navigation.goBack();
      })
      .catch(error => {
        setIsDeleting(false);
        showErrorToast(error + '');
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
          onPress: () => console.log('cancelled'),
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

  const renderItem = ({
    item,
    index,
  }: {
    item: RevealTimelineType;
    index: number;
  }) => {
    return (
      <RevealCard
        revealData={item}
        index={index}
        openComments={openComments(item)}
        onRefresh={refetch}
        isOwnReveal={item?.shared_by?.user_id === loggedInUser?.user_id}
        onDeleteItem={onDeletePost}
        isDeleting={isDeleting}
        onShare={handleShare}
        onMorePress={handleShareViaDeleteSheet}
        onPostMore={hendleExtraOptions}
      />
    );
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

  const fetchNext = () => {
    if (
      DATA.length > LIMIT - 1 &&
      !isLoading &&
      !isFetchingNextPage &&
      !isRefetching &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* header start  */}
          <BackHeader title={user?.name} />
          {userInfo?.max_streak > 0 && (
            <StreakTag
              days={userInfo?.max_streak}
              style={styles.streakTagStyle}
            />
          )}

          {(isLoading || (isRefetching && DATA?.length === 0)) && (
            <Loader inCenter />
          )}

          {DATA?.length === 0 && !isLoading && !isRefetching && (
            <NoDataFound
              noDataText="No data found"
              inCenter
              noDataImage={<NoDataIcon style={NoDataStyle} />}
            />
          )}

          {DATA?.length > 0 && (
            <FlashList
              data={DATA || []}
              keyExtractor={(item: RevealTimelineType) => item.share_id + ''}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListStyle}
              onEndReachedThreshold={0.1}
              estimatedItemSize={360}
              onEndReached={fetchNext}
              ListFooterComponent={
                DATA?.length > LIMIT - 1 ? (
                  isFetchingNextPage ? (
                    <ActivityIndicator
                      style={styles.loadeMoreStyle}
                      color="#fff"
                    />
                  ) : null
                ) : null
              }
            />
          )}
          {/* listing of archive posts end */}
        </View>
      </View>
      <CommentsSheet
        answerId={commentsModalState.answerId}
        show={commentsModalState.show}
        closeCommentsModal={closeCommentsModal}
        total_comments={commentsModalState?.total_comments}
      />

      <PostMoreOptions
        postItem={postExtraOptionSheet.postItem}
        show={postExtraOptionSheet.show}
        onClose={closeExtraOptionSheet}
        onReportPost={hendleReportContentSheet}
        afterBlockUser={onRefreshData}
      />
      <ReportPostReasonContentSheet
        postItem={reportContentSheet.postItem}
        show={reportContentSheet.show}
        closeReportReasonModal={closeReportContentSheet}
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

export default RevealsWithOthers;
