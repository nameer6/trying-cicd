import {StyleSheet, Text, View} from 'react-native';

type Props = {
  unreadCounts: number;
};

const UnreadBadge = ({unreadCounts}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.activityUnreadTitleText}>
        {unreadCounts} unread reveals
      </Text>
      <View style={styles.yellowBadge} />
    </View>
  );
};

export default UnreadBadge;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityUnreadTitleText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#fff',
  },
  yellowBadge: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: '#E2FE52',
  },
});
