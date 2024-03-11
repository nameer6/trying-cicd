import {useCallback, useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useQueryClient} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import BackHeader from 'src/components/BackHeader';
// import CommentsList from 'src/components/comment-sheet/CommentsList';
import Loader from 'src/components/Loader';
import reveals from 'src/helpers/http/reveals';
import {styles} from './styles';
import RevealCard from 'src/modules/home/components/reveal-card/RevealCard';
import PostMoreOptions from 'src/components/socialmedial-share-sheet/PostMoreOptions';
import ReportPostReasonContentSheet from 'src/components/socialmedial-share-sheet/ReportPostReasonContentSheet';
import {
  RevealTimelineType,
  ShareDataType,
} from 'src/helpers/types/reveal.types';
import SocialMediaShareSheet from 'src/components/socialmedial-share-sheet/SocialMediaShareSheet';
import DeleteShareSheet from 'src/components/socialmedial-share-sheet/DeleteShareSheet';
import {showSuccessToast} from 'src/helpers/mics';
import Spinner from 'src/components/Spinner';
import CommentsSheet from 'src/components/comment-sheet/CommentsSheet';

const RevealPostScreen = ({route, navigation}: any) => {
  const queryClient = useQueryClient();
  const {user} = useSelector((state: any) => state.myProfile);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [revealId, setRevealId] = useState<string | null>(null);

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

  const {data, isLoading} = useQuery({
    queryKey: ['get-post-details', revealId],
    queryFn: () => reveals.getRevealPostDetails(revealId),
    enabled: !!revealId,
  });
  // console.log('Details: ' + JSON.stringify(data));

  const openComments = useCallback(() => {
    setCommentsModalState({
      show: true,
      answerId: data?.data?.answer_id,
      total_comments: data?.data?.total_comments,
    });
  }, [data?.data?.answer_id, data?.data?.total_comments]);

  useEffect(() => {
    if (data?.data && route.params.type === 'SEND_COMMENT') {
      openComments();
    }
  }, [data?.data, openComments, route.params.type]);

  useEffect(() => {
    if (route.params.revealId) {
      setRevealId(route?.params?.revealId);
    }
  }, [route.params?.revealId]);

  const onRefresh = () => {
    queryClient.refetchQueries(['get-post-details'] as never);
  };

  const hendleExtraOptions = () => {
    setpostExtraOptionSheet({
      show: true,
      postItem: data?.data,
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
  const onReportSelection = () => {
    closeReportContentSheet();
    setTimeout(() => {
      Alert.alert(
        'We’re on it',
        'Our team will review the profile and deactivate it if it violates our terms of use.',
        [
          {
            text: 'Close',
            onPress: () => console.log('pressed'),
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
        console.log('Error: ' + JSON.stringify(error));
      });
  };

  const onDeletePost = (item: any) => {
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

  const closeCommentsModal = () => {
    setCommentsModalState({
      show: false,
    });
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Reveal" style={styles.headerStyle} />
      {isLoading && <Loader inCenter />}
      <Spinner
        loading={isDeleting}
        spinnerContainerStyle={styles.loaderStyle}
      />
      {data?.data && (
        <>
          {data?.data && (
            <RevealCard
              isInDetailsScreen
              revealData={data?.data}
              onRefresh={onRefresh}
              index={0}
              showComments={false}
              openComments={openComments}
              onShare={handleShare}
              onMorePress={handleShareViaDeleteSheet}
              onPostMore={hendleExtraOptions}
              isOwnReveal={data?.data?.shared_by?.user_id === user?.user_id}
            />
          )}
          {/* <CommentsList
            answerId={data?.data?.answer_id}
            commentBoxStyle={styles.commentBoxStyle}
          /> */}
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
          <CommentsSheet
            answerId={commentsModalState.answerId}
            show={commentsModalState.show}
            closeCommentsModal={closeCommentsModal}
            total_comments={commentsModalState?.total_comments}
          />
        </>
      )}
    </View>
  );
};

export default RevealPostScreen;
