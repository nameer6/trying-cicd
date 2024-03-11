import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  InteractionManager,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
  ImageBackground,
  AppState,
} from 'react-native';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import RandomSuggestions from 'src/components/random-suggestions/RandomSuggestions';
import CommentsSheet from 'src/components/comment-sheet/CommentsSheet';
import PostMoreOptions from 'src/components/socialmedial-share-sheet/PostMoreOptions';
import ReportPostReasonContentSheet from 'src/components/socialmedial-share-sheet/ReportPostReasonContentSheet';
import reveals from 'src/helpers/http/reveals';
import {
  RevealTimelineType,
  SuggestionType,
} from 'src/helpers/types/reveal.types';
import RevealCard from './components/reveal-card/RevealCard';
import {updateCreateRevealState} from 'src/store/reducers/createReveal';
import {updateUnreadCounts} from 'src/store/reducers/revealTimeline';
import general from 'src/helpers/http/general';
import {showErrorToast} from 'src/helpers/mics';
import {
  getNextPage,
  selectDataFromResponse,
} from 'src/helpers/react-query-helpers';
import LockedBubble from './components/locked-bubble/LockedBubble';
import CreateRevealWidget from 'src/components/create-reveal/create-reveal-widget/CreateRevealWidget';
import LockRevealModal from './components/locked-reveals/LockRevealModal';
import RevealPostingProgress from './RevealPostingProgress';
import {OneSignal} from 'react-native-onesignal';
import Animated, {FadeInDown} from 'react-native-reanimated';

const LIMIT = 10;

type Props = {
  refetchCounts: () => void;
  onScroll: (e: any) => void;
};

const RevealTimeline = ({refetchCounts, onScroll}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const {revealToPost} = useSelector((state: any) => state.createReveal);
  const [flatlistLoaded, setFlatlistLoaded] = useState<boolean>(false);

  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', event => {
      console.log('OneSignal: notification clicked:', event);
      const action = event?.notification?.additionalData?.action;
      setTimeout(() => {
        if (action === 'send_reveal') {
          setFlatlistLoaded(false);
          refetch();
          refetchLockedReveals();
          refetchCounts();
        }
      }, 1200);
    });
  }, []);
  // const [isLoadedOnce, setIsLoadedOnce] = useState<>
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
  }, []);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [emptyStates, setEmptyStates] = useState<SuggestionType[]>([]);
  const [selected, setSelected] = useState<SuggestionType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentsModalState, setCommentsModalState] = useState<{
    answerId?: string;
    show: boolean;
    total_comments?: number;
  }>({
    show: false,
    total_comments: 0,
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

  const {
    data: unlockedReveals,
    isLoading,
    hasNextPage,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['get-reveals'],
    queryFn: ({pageParam = 1}) =>
      reveals.getRevealTimeline({
        pageParam,
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
    () => unlockedReveals?.pages || [],
    [unlockedReveals?.pages],
  );

  const {
    data: lockedReveals,
    isLoading: isLoadingLockedReveals,
    isRefetching: isRefetchingLockedReveals,
    refetch: refetchLockedReveals,
  } = useQuery({
    queryKey: ['get-locked-reveals'],
    queryFn: reveals.getLockedRevealTimeline,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        refetch();
        refetchLockedReveals();
        refetchCounts();
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [refetch, refetchCounts, refetchLockedReveals]);

  const shuffle = useCallback(() => {
    setSelected(emptyStates[currentIndex]);
    setCurrentIndex(prevIndex => (prevIndex + 1) % emptyStates.length);
  }, [currentIndex, emptyStates]);

  useEffect(() => {
    // Start showing items at a 10-second interval
    setSelected(emptyStates[currentIndex]);
    const intervalId = setInterval(() => {
      shuffle();
    }, 10000);

    return () => {
      // Clear the interval when the component is unmounted
      clearInterval(intervalId);
    };
  }, [emptyStates, currentIndex, shuffle]);

  useEffect(() => {
    if (!isLoadingLockedReveals && !isRefetchingLockedReveals) {
      dispatch(updateUnreadCounts(lockedReveals?.data?.length));
    }
  }, [
    lockedReveals,
    isLoadingLockedReveals,
    isRefetchingLockedReveals,
    dispatch,
  ]);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      dispatch(
        updateCreateRevealState({
          revealTimeLineHasUnLocked: DATA?.length > 0,
        }),
      );
    }
  }, [DATA?.length, dispatch, isLoading, isRefetching]);

  useEffect(() => {
    if (
      !isLoading &&
      !isRefetching &&
      !isLoadingLockedReveals &&
      !isRefetchingLockedReveals
    ) {
      setTimeout(() => {
        setPullingByRefreshing(false);
      }, 2000);
    }
  }, [
    isLoading,
    isLoadingLockedReveals,
    isRefetching,
    isRefetchingLockedReveals,
  ]);

  useEffect(() => {
    if (ready && !isLoadingLockedReveals && !isRefetchingLockedReveals) {
      if (lockedReveals?.data?.length > 0 && !flatlistLoaded) {
        openLockedRevalModal();
      }
    }
  }, [
    flatlistLoaded,
    isLoadingLockedReveals,
    isRefetchingLockedReveals,
    lockedReveals?.data?.length,
    ready,
  ]);

  const getEmptyStates = useCallback(() => {
    general
      .getEmptyStates()
      .then(res => {
        console.log('Empty Stattes: ' + JSON.stringify(res));
        if (res?.data) {
          res?.data.forEach((element: any) => {
            Image.prefetch(element?.image);
          });
        }
        if (res?.data) {
          setEmptyStates(res?.data);
        }
      })
      .catch(err => {
        showErrorToast(err + '');
      });
  }, []);

  useEffect(() => {
    getEmptyStates();
  }, [getEmptyStates]);

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

  const hendleExtraOptions = (item: any) => () => {
    console.log('selected item', item);
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
    refetch();
    refetchLockedReveals();
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
        onPostMore={hendleExtraOptions(item)}
      />
    );
  };

  const markRevealsAsSeen = () => {
    const currentData = [...DATA];
    const last10Data = currentData?.slice(-10);
    const payload = last10Data?.map(
      (item: RevealTimelineType) => item.answer_id,
    );
    reveals.markRevealAsSeen(payload).then(res => {
      // alert(JSON.stringify(res));
    });
  };

  const fetchNext = () => {
    if (
      DATA.length > 9 &&
      !isLoading &&
      !isFetchingNextPage &&
      !isRefetching &&
      hasNextPage
    ) {
      markRevealsAsSeen();
      fetchNextPage();
    }
  };

  const [pullingByRefreshing, setPullingByRefreshing] =
    useState<boolean>(false);

  const onRefresh = () => {
    setPullingByRefreshing(true);
    // refetch();
    // refetchLockedReveals();
    // refetchCounts();
  };

  useEffect(() => {
    if (pullingByRefreshing) {
      refetch();
      refetchLockedReveals();
      refetchCounts();
    }
  }, [pullingByRefreshing, refetch, refetchCounts, refetchLockedReveals]);

  const onFlatlistLayout = () => {
    setFlatlistLoaded(true);
  };

  const [showLockedRevealModal, setShowLockedRevealModal] =
    useState<boolean>(false);

  const closeLockedModal = () => {
    setShowLockedRevealModal(false);
  };

  const openLockedRevalModal = () => {
    setShowLockedRevealModal(true);
  };

  const flatlistRef = useRef<any>(null);

  useEffect(() => {
    if (revealToPost) {
      flatlistRef.current.scrollToOffset({animated: false, offset: 0});
    }
  }, [revealToPost]);

  return (
    <>
      {isLoading && (
        <Animated.View entering={FadeInDown.duration(1000)}>
          <Image
            source={require('src/assets/images/skeleton.png')}
            style={styles.skeletonImg}
          />
          <Image
            source={require('src/assets/images/skeleton.png')}
            style={[styles.skeletonImg, styles.skeletonImg2]}
          />
        </Animated.View>
      )}

      {!isLoading && (
        <Animated.FlatList
          entering={FadeInDown.duration(400)}
          ref={flatlistRef}
          onLayout={onFlatlistLayout}
          data={DATA || []}
          keyExtractor={(item: RevealTimelineType) => item?.share_id + ''}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.veriticalScrollViewStyle}
          onScroll={onScroll}
          scrollEventThrottle={5}
          ListHeaderComponent={
            <>
              <RevealPostingProgress />

              {DATA?.length === 0 && !isLoading && !isLoadingLockedReveals && (
                <RandomSuggestions selected={selected} />
              )}
            </>
          }
          ListFooterComponent={
            DATA?.length > 0 ? (
              <>
                {!hasNextPage && (
                  <RandomSuggestions
                    style={styles.randomSuggestion}
                    selected={selected}
                  />
                )}
                {isFetchingNextPage && (
                  <ActivityIndicator style={styles.loaderStyle} color="#fff" />
                )}
              </>
            ) : null
          }
          onEndReachedThreshold={0.1}
          // estimatedItemSize={360}
          onEndReached={fetchNext}
          refreshControl={
            <RefreshControl
              refreshing={
                pullingByRefreshing &&
                (isRefetching || isRefetchingLockedReveals)
              }
              onRefresh={onRefresh}
              progressViewOffset={60}
              tintColor="#fff"
            />
          }
        />
      )}

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
      <View style={styles.createRevealWidget}>
        {!isLoading && !isLoadingLockedReveals && (
          <ImageBackground
            source={require('src/assets/images/lockedBubbleGradientBg.png')}
            resizeMode="stretch"
            imageStyle={styles.gradientBgImageStyle}
            style={styles.gradientBgStyle}>
            {lockedReveals?.data?.length === 0 ? (
              <CreateRevealWidget
                lockedDataCount={lockedReveals?.data?.length}
                dataCount={DATA?.length}
              />
            ) : (
              <LockedBubble
                onPress={openLockedRevalModal}
                lockedData={lockedReveals?.data || []}
              />
            )}
          </ImageBackground>
        )}
      </View>
      <LockRevealModal
        show={showLockedRevealModal}
        onClose={closeLockedModal}
        lockedDataCount={lockedReveals?.data?.length}
        dataCount={DATA?.length}
        lockedData={lockedReveals?.data || []}
      />
    </>
  );
};

export default RevealTimeline;

const styles = StyleSheet.create({
  skeletonImg: {
    width: '94%',
    height: 360,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 80,
  },
  skeletonImg2: {
    marginTop: 16,
  },
  lottieStyle: {
    // width: '100%',
    height: '40%',
    marginTop: 80,
    width: '100%',
  },
  scrollViewStyle: {
    paddingBottom: 250,
  },
  flatListStyle: {
    marginTop: 10,
  },
  randomSuggestion: {
    marginTop: 24,
  },
  veriticalScrollViewStyle: {
    paddingBottom: 250,
    paddingTop: 40,
  },
  loaderStyle: {
    marginTop: 40,
    marginBottom: 10,
  },
  createRevealWidget: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  gradientBgStyle: {
    paddingVertical: 45,
    height: 'auto',
  },
  gradientBgImageStyle: {
    opacity: 0.7,
  },
});
