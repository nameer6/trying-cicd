import {useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import GradientButton from '../GradientButton';
import {fonts} from 'src/common/fonts';
import reveals from 'src/helpers/http/reveals';
import {showErrorToast} from 'src/helpers/mics';
import {CommentType} from 'src/helpers/types/reveal.types';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';

type Props = {
  style?: any;
  answerId?: string;
  appendNewComment: (comment: CommentType) => void;
};

const CommentBox = ({style, answerId, appendNewComment}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const {user} = useSelector((state: any) => state.myProfile);

  const InputRef = useRef<any>(null);

  const onSend = () => {
    // setLoading(true);
    const payload = {
      comment_text: comment,
      answer_id: answerId,
    };
    const newComment = {
      comment_id: moment.now() + '',
      comment_text: comment,
      full_name: user.full_name,
      user_id: user.user_id,
      user_image: user.user_image,
      date_created: moment.now(),
    };
    InputRef?.current?.clear();
    setComment('');
    appendNewComment(newComment);

    reveals
      .addComment(payload)
      .then(res => {
        setLoading(false);
        // if (res?.data) {
        //   // InputRef?.current?.clear();
        //   // setComment('');
        // }
      })
      .catch(err => {
        setLoading(false);
        showErrorToast(err + '');
      });
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.commentBoxStyle}>
        <View style={styles.userImage}>
          <FastImage
            source={{uri: user?.user_image}}
            style={styles.userImage}
          />
        </View>
        <BottomSheetTextInput
          placeholder="Add a comment..."
          placeholderTextColor="rgba(255, 255, 255, 0.49)"
          style={styles.commentInput}
          // value={comment}
          onChangeText={setComment}
          ref={InputRef}
        />
      </View>

      {!!comment && (
        <Animated.View
          exiting={ZoomOut.duration(60)}
          entering={ZoomIn.duration(60)}>
          <GradientButton
            onPress={onSend}
            style={styles.sendButton}
            disabled={loading}
            secondColorOffset="0.4">
            {!loading ? (
              <Feather name="arrow-up" color="#000" size={30} />
            ) : (
              <ActivityIndicator color="#fff" />
            )}
          </GradientButton>
        </Animated.View>
      )}
    </View>
  );
};

export default CommentBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
  },
  commentBoxStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    flex: 1,
    borderRadius: 45,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userImage: {
    height: 44,
    width: 44,
    borderRadius: 44,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    backgroundColor: 'gray',
  },
  commentInput: {
    fontSize: 15,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
    minHeight: 48,
    width: '80%',
  },
  sendButton: {
    height: 44,
    width: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
