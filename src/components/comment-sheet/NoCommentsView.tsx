import {StyleSheet, Text, View} from 'react-native';

const NoCommentsView = () => {
  return (
    <View style={styles.noCommentView}>
      <Text style={styles.noCommentsText}>No comments</Text>
    </View>
  );
};

export default NoCommentsView;

const styles = StyleSheet.create({
  noCommentView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flex: 1,
  },
  noCommentsText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.5,
  },
});
