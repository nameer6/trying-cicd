import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ProfileThumbnail from 'src/components/ProfileThumbnail';
import {formatDate} from 'src/helpers/mics';
import {ActivityItemType} from 'src/helpers/types/activities.types';

type Props = {
  item: ActivityItemType;
  onPress: () => void;
};

const ActivityItem = ({item, onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.activityItemContainer} onPress={onPress}>
      <View style={styles.imgContainer}>
        <ProfileThumbnail
          name={item?.full_name}
          image={item?.user_image}
          style={styles.imageStyle}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.nameNtimeContainer}>
          <Text style={styles.userNameTextStyle}>{item?.full_name}</Text>
          <Text style={styles.timeTextStyle}>
            {formatDate(item.date_created, 'fromNow')}
          </Text>
        </View>

        <Text style={styles.activityContentTextStyle}>
          {item.type === 'REVEAL'
            ? `revealed to you${
                item.sharedWith ? ' and ' + item.sharedWith + ' others' : ''
              }`
            : item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityItem;

const styles = StyleSheet.create({
  activityItemContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 4,
  },
  imageStyle: {
    height: 46,
    width: 46,
    borderRadius: 46,
  },
  nameNtimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userNameTextStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timeTextStyle: {
    color: '#9F9F9F',
    fontSize: 13,
    fontWeight: '400',
  },
  activityContentTextStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.50)',
    marginTop: 1,
  },
});
