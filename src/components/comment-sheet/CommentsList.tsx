import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, Keyboard, View} from 'react-native';
import CommentBox from './CommentBox';
import CommentItem from './CommentItem';
import NoCommentsView from './NoCommentsView';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import {CommentType} from 'src/helpers/types/reveal.types';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

type Props = {
  answerId?: string;
  showCommentsCount?: boolean;
  commentBoxStyle?: any;
  total_comments?: number;
};

const LIMIT = 10;

const CommentsList = ({
  answerId,
  showCommentsCount = false,
  commentBoxStyle,
  total_comments,
}: Props) => {
  const queryClient = useQueryClient();
  const listRef = useRef<any>();
  const [page, setPage] = useState<number>(1);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);

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

  const updateComments = (queryKey: string) => {
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
  };

  const updateCommentsForRevealWithOtherScreen = () => {
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
  };

  const appendNewComment = async (newComment: CommentType) => {
    await setComments(prev => [...prev, newComment]);
    // await Keyboard.dismiss();
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
  };

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
  }, [isKeyboardVisible, showCommentsCount]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: isKeyboardVisible ? 10 : 46,
      }}>
      {/* {loadingComments && comments?.length === 0 && <Loader inCenter />} */}

      {comments?.length > 0 && (
        <Text style={styles.commentCountText}>
          {totalComments} comment{totalComments > 1 ? 's' : ''}
        </Text>
      )}

      {((!loadingComments && comments?.length === 0) ||
        (comments?.length === 0 && total_comments === 0)) && <NoCommentsView />}

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

      <CommentBox
        // style={commentBoxStyle}
        answerId={answerId}
        appendNewComment={appendNewComment}
      />
    </View>
  );
};

export default CommentsList;

const styles = StyleSheet.create({
  flatListStyle: {
    paddingHorizontal: 24,
    // marginVertical: 24,
    marginTop: 16,
  },
  flatListScrollStyle: {
    // flexGrow: 1,
    justifyContent: 'flex-end',
  },
  loader: {
    marginTop: 20,
  },
  commentCountText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },
  noDataView: {
    marginTop: 0,
  },
});
