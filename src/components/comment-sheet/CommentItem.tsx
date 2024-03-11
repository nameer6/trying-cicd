import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import ProfileThumbnail from '../ProfileThumbnail';
import {fonts} from 'src/common/fonts';
import {formatDate} from 'src/helpers/mics';
import {CommentType} from 'src/helpers/types/reveal.types';

type Props = {
  comment: CommentType;
};

const CommentItem = ({comment}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <ProfileThumbnail
          name={comment.full_name}
          image={comment.user_image}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.commentNameDate}>
          <Text style={styles.name}>{comment.full_name}</Text>
          <Text style={styles.dateStyle}>
            {formatDate(comment.date_created, 'fromNow')}
          </Text>
        </View>
        <Text style={styles.comment}>{comment.comment_text}</Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  content: {
    flex: 1,
  },
  commentNameDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  dateStyle: {
    fontSize: 14,
    color: '#fff',
    fontFamily: fonts.SF_REGULAR,
    opacity: 0.5,
  },
  comment: {
    fontSize: 15,
    color: '#fff',
    fontFamily: fonts.SF_REGULAR,
    marginTop: 3,
  },
});
