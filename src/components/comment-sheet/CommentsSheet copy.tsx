import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Keyboard, Text, View} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import SheetBackdrop from '../bottom-sheet-components/SheetBackdrop';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import {styles} from './styles';
import {useQueryClient} from '@tanstack/react-query';
import {CommentType} from 'src/helpers/types/reveal.types';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import CommentItem from './CommentItem';
import NoCommentsView from './NoCommentsView';
import CommentBox from './CommentBox';

const LIMIT = 10;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  answerId?: string;
  show: boolean;
  closeCommentsModal: () => void;
  total_comments?: number;
};

const CommentsSheet = ({
  show,
  answerId,
  closeCommentsModal,
  total_comments,
}: Props) => {
  const queryClient = useQueryClient();
  const listRef = useRef<any>();
  const [page, setPage] = useState<number>(1);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => bottomSheetRef.current?.present();
  const closeSheet = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
    setComments([]);
    setPage(1);
    setLoadingComments(false);
    setTotalComments(0);
  };

  useEffect(() => {
    if (show) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [show]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Handlers
  const handleSheetChange = (index: number) => {
    console.log('Index: ' + index);
    setCurrentIndex(index);
    if (index === -1) {
      closeCommentsModal();
    }
  };

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  const totalPages = useMemo(() => {
    return Math.ceil(totalComments / LIMIT);
  }, [totalComments]);

  const getComments = useCallback(() => {
    setLoadingComments(true);
    answerId &&
      reveals
        .getComments({
          answerId,
          page,
          limit: LIMIT,
        })
        .then(res => {
          console.log('Comments res: ', res);
          setLoadingComments(false);
          if (res?.status) {
            setComments(prev => [...prev, ...res?.data]);
            if (page === 1) {
              setTotalComments(res?.total);
            }
          } else {
            showErrorToast(res?.message);
          }
        })
        .catch(err => {
          console.log('Err: ', err);
          setLoadingComments(false);
          showErrorToast(err + '');
        });
  }, [answerId, page]);

  useEffect(() => {
    if (answerId) {
      getComments();
      setTotalComments(total_comments || 0);
    }
  }, [answerId, getComments, total_comments]);

  const renderCommentItem = ({item}: {item: CommentType}) => {
    return <CommentItem comment={item} />;
  };

  const updateComments = useCallback(
    (queryKey: string) => {
      queryClient.setQueryData([queryKey], (prev: any) => {
        const updatedPages = (prev?.pages || []).map((page: any) => {
          const updatedData = (page?.data || []).map((item: any) => {
            if (item.answer_id === answerId) {
              return {
                ...item,
                total_comments: (item.total_comments || 0) + 1,
              };
            }
            return item;
          });

          return {...page, data: updatedData};
        });

        return {pages: updatedPages, pageParams: prev.pageParams};
      });
    },
    [answerId, queryClient],
  );

  const updateCommentsForRevealWithOtherScreen = useCallback(() => {
    queryClient.setQueryData(['get-reveals-with-others'], (prev: any) => {
      if (prev?.pages) {
        const updatedPages = prev.pages.map((page: any) => {
          const prevData = page?.data;
          const updatedReveals = (prevData?.reveals || []).map((item: any) => {
            if (item.answer_id === answerId) {
              return {
                ...item,
                total_comments: (item.total_comments || 0) + 1,
              };
            }
            return item;
          });

          return {...page, data: {...prevData, reveals: updatedReveals}};
        });

        return {pages: updatedPages, pageParams: prev.pageParams};
      }

      return prev;
    });
  }, [answerId, queryClient]);

  const appendNewComment = useCallback(
    async (newComment: CommentType) => {
      await setComments(prev => [...prev, newComment]);
      await Keyboard.dismiss();
      await triggerHapticFeedback('impactHeavy');
      setTimeout(() => {
        listRef?.current?.scrollToEnd({animated: true});
      }, 500);
      setTotalComments(prev => prev + 1);
      try {
        const queryKeysToUpdate = ['get-reveals', 'get-my-archives'];
        updateCommentsForRevealWithOtherScreen();
        queryKeysToUpdate.forEach(queryKey => {
          updateComments(queryKey);
        });
      } catch (err) {
        console.log('ERR: ', err);
      }
    },
    [updateComments, updateCommentsForRevealWithOtherScreen],
  );

  // useEffect(() => {
  //   if (comments?.length > 0) {
  //     listRef?.current?.scrollToEnd({animated: true});
  //   }
  // }, [comments]);

  const loadMore = () => {
    if (
      !loadingComments &&
      page !== totalPages &&
      comments?.length > LIMIT - 1
    ) {
      setPage(prev => prev + 1);
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillChangeFrame',
      () => {
        if (!isKeyboardVisible) {
          setKeyboardVisible(true);
        }
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    // Clean up event listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardVisible]);

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={46}>
        <CommentBox answerId={answerId} appendNewComment={appendNewComment} />
      </BottomSheetFooter>
    ),
    [answerId, appendNewComment],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={show ? 0 : -1}
      snapPoints={[HEIGHT / 1.7, HEIGHT]}
      onChange={handleSheetChange}
      style={sheetShadowStyle}
      backgroundStyle={sheetContainerStyle}
      handleIndicatorStyle={sheetIndicatorStyle}
      enableHandlePanningGesture
      enablePanDownToClose
      enableDismissOnClose
      topInset={50}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      footerComponent={renderFooter}
      backdropComponent={renderBackdrop}>
      {/* <CommentsList
        answerId={answerId}
        commentBoxStyle={styles.commentBoxStyle}
        total_comments={total_comments}
      /> */}
      <View
        style={{
          justifyContent: 'flex-end',
          height:
            currentIndex === 0
              ? HEIGHT / 1.7 - 140
              : isKeyboardVisible
              ? HEIGHT / 2 - 50
              : HEIGHT - 200,
          borderWidth: 1,
          borderColor: 'red',
        }}>
        {/* {loadingComments && comments?.length === 0 && <Loader inCenter />} */}

        {comments?.length > 0 && (
          <Text style={styles.commentCountText}>
            {totalComments} comment{totalComments > 1 ? 's' : ''}
          </Text>
        )}

        {!loadingComments && comments?.length === 0 && <NoCommentsView />}

        {comments?.length !== 0 && (
          <BottomSheetFlatList
            data={comments}
            keyExtractor={item => item.comment_id}
            renderItem={renderCommentItem}
            style={styles.flatListStyle}
            contentContainerStyle={styles.flatListScrollStyle}
            showsVerticalScrollIndicator
            ref={listRef}
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
            onEndReachedThreshold={0.1}
            onEndReached={loadMore}
            // ListFooterComponent={
            //   loadingComments && comments?.length !== 0 ? (
            //     <Loader style={{marginTop: 0, marginBottom: 8}} />
            //   ) : null
            // }
          />
        )}

        {/* <CommentBox
          // style={commentBoxStyle}
          answerId={answerId}
          appendNewComment={appendNewComment}
        /> */}
      </View>
    </BottomSheetModal>
  );
};

export default CommentsSheet;
