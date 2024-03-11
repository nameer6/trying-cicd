import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import Emojis from 'src/components/emojis/Emojis';
import TaggedUsersListSheet from 'src/components/TaggedUsersList/TaggedUsersListSheet';
import AudioAnswerPlayer from '../AudioAnswerPlayer';
import RevealSharedBy from '../RevealSharedBy';
import CommentIcon from 'src/assets/icons/comment.svg';
import {
  RevealTimelineType,
  ShareDataType,
} from 'src/helpers/types/reveal.types';
import {BackgroundGradient} from '../BackgroundGradient';
import {styles} from './styles';
import {triggerHapticFeedback} from 'src/helpers/mics';
import BounceButton from 'src/components/BounceButton';
import ReadMore from 'src/components/read-more/ReadMore';
import {
  RenderViewLess,
  RenderViewMore,
} from 'src/components/read-more/read-more-actions';

const WIDTH = Dimensions.get('window').width;

type Props = {
  revealData: RevealTimelineType;
  index: number;
  openComments?: () => void;
  onRefresh: () => void;
  onDeleteItem?: (item: any) => void;
  isOwnReveal?: boolean;
  loading?: boolean;
  onShare?: (shareData: ShareDataType) => void;
  showComments?: boolean;
  onMorePress?: (answer_id: string) => void;
  onPostMore?: (shareData: RevealTimelineType) => void;
  isInDetailsScreen?: boolean;
};

const RevealCard = ({
  revealData,
  index,
  openComments,
  onRefresh,
  isOwnReveal,
  loading,
  onMorePress,
  onPostMore,
  isInDetailsScreen = false,
}: Props) => {
  const [showOthers, setShowOthers] = useState<boolean>(false);
  const [textShown, setTextShown] = useState(false); // To show/hide remaining text
  const [lengthMore, setLengthMore] = useState(false); // To show/hide "See more & Less" line
  const [commentCount, setCommentsCount] = useState<number>(0);
  const navigation = useNavigation();

  const type = useMemo(() => {
    if (index % 2 === 0) {
      return 'blue';
    } else {
      return 'red';
    }
  }, [index]);

  const goToDetailsScreen = () => {
    triggerHapticFeedback();
    navigation.navigate(
      'RevealPostScreen' as never,
      {
        revealId: revealData?.answer_id,
        revealData,
        onRefresh,
        isFromArchiveList: !!isOwnReveal,
      } as never,
    );
  };

  const onViewOthersModal = () => {
    setShowOthers(true);
  };

  const closeViewOthersModal = () => {
    setShowOthers(false);
  };

  const onTextLayout = useCallback(
    (e: {nativeEvent: {lines: string | any[]}}) => {
      // Check if the text is more than 4 lines
      // console.log(e.nativeEvent.lines.length);
      setLengthMore(e.nativeEvent.lines.length >= 4);
    },
    [],
  );

  const toggleNumberOfLines = () => {
    // Toggle the show/hide of the text
    setTextShown(!textShown);
  };

  const onMoreClick = () => {
    if (isOwnReveal) {
      onMorePress && onMorePress(revealData.answer_id);
    } else {
      onPostMore && onPostMore(revealData);
    }
  };

  const [contentHeight, setContentHeight] = useState(0);

  const onContentLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };

  useEffect(() => {
    setCommentsCount(revealData?.total_comments || 0);
  }, [revealData?.total_comments]);

  const handleOpenComments = () => {
    triggerHapticFeedback();
    openComments && openComments();
  };

  return (
    <Animated.View style={styles.container}>
      <BackgroundGradient width={WIDTH} height={contentHeight} type={type} />
      <Pressable
        style={styles.content}
        onLayout={onContentLayout}
        disabled={isInDetailsScreen}
        onPress={goToDetailsScreen}>
        <View style={styles.topView}>
          <View style={styles.header}>
            <RevealSharedBy
              sharedBy={revealData?.shared_by}
              sharedWith={revealData?.shared_with}
              createdDate={revealData?.reveal_date}
              onViewOthers={onViewOthersModal}
              isOwnReveal={isOwnReveal}
            />

            <TouchableOpacity
              style={styles.moreOptionView}
              onPress={onMoreClick}>
              {!loading ? (
                <Icon name="dots-three-horizontal" color="#010101" size={20} />
              ) : (
                <ActivityIndicator />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.questionStyle}>
            {revealData?.question_text?.trim()}
          </Text>
          <View style={styles.divider} />
          {!!revealData?.answer_text && (
            <View style={styles.answerView}>
              <ReadMore
                numberOfLines={3}
                afterExpand={() => {}}
                afterCollapse={() => {}}
                renderViewMore={RenderViewMore}
                renderViewLess={RenderViewLess}>
                <Text style={styles.answerStyle}>
                  {revealData?.answer_text}
                </Text>
              </ReadMore>
            </View>
          )}
          {/* {!!revealData?.answer_text && (
            <Text
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 4}
              style={styles.answerStyle}>
              {revealData?.answer_text}
            </Text>
          )}
          {!!revealData?.answer_text && lengthMore ? (
            <Text onPress={toggleNumberOfLines} style={styles.seeMoreTextStyle}>
              {textShown ? 'See less' : 'See more'}
            </Text>
          ) : null} */}

          {!!revealData?.answer_audio_url && (
            <AudioAnswerPlayer
              audioUrl={revealData?.answer_audio_url}
              answer_id={revealData?.answer_id}
              answer_audio_duration={revealData?.answer_audio_duration}
            />
          )}
        </View>
        <View style={styles.footer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.footerScrollArea}>
            <BounceButton
              style={styles.commentBox}
              onPress={handleOpenComments}>
              <CommentIcon />
              <Text style={styles.addCommentText}>
                {commentCount
                  ? `${commentCount} comment${commentCount > 1 ? 's' : ''}`
                  : 'Add comment'}
              </Text>
            </BounceButton>

            <Emojis
              reactionsData={revealData?.reactions || []}
              answer_id={revealData?.answer_id}
              current_user_reactions={revealData?.current_user_reactions || []}
            />
          </ScrollView>
        </View>
      </Pressable>
      <TaggedUsersListSheet
        show={showOthers}
        closeUserListModal={closeViewOthersModal}
        sharedWith={revealData?.shared_with}
      />
    </Animated.View>
  );
};

export default RevealCard;
