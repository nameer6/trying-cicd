import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {fonts} from 'src/common/fonts';

type Props = {
  reaction: {
    emoji: string;
    count: number;
  };
};

const ReactionItem = ({reaction}: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.emojiStyle}>{reaction.emoji}</Text>
      <Text style={styles.countStyle}>{reaction.count}</Text>
    </TouchableOpacity>
  );
};

export default ReactionItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 45,
    gap: 4,
  },
  emojiStyle: {
    fontSize: 22,
  },
  countStyle: {
    fontSize: 14,
    fontFamily: fonts.HELVETICA_BOLD,
    color: '#33363F',
  },
});
