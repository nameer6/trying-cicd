import {useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {RevealTimelineType, SharedByType} from 'src/helpers/types/reveal.types';

type Props = {
  lockedData: RevealTimelineType[];
};

const UserImages = ({lockedData}: Props) => {
  const sharedBy = useMemo(() => {
    const sharedByData: SharedByType[] = lockedData?.map(
      item => item.shared_by,
    );
    const uniqueSharedBy: SharedByType[] = sharedByData?.filter(
      (obj, index, self) =>
        index === self.findIndex(item => item.user_id === obj.user_id),
    );
    return uniqueSharedBy;
  }, [lockedData]);
  return (
    <View
      style={{
        width: 68,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {sharedBy.length === 1 && (
        <Image
          source={{uri: sharedBy[0]?.user_image}}
          style={styles.oneImageContainer}
        />
      )}
      {sharedBy.length === 2 && (
        <View style={styles.secondProfileContainer}>
          <Image
            source={{uri: sharedBy[0]?.user_image}}
            style={styles.userImageStyle}
          />
          <Image
            source={{uri: sharedBy[1]?.user_image}}
            style={styles.twoUserImage2Style}
          />
        </View>
      )}
      {sharedBy.length >= 3 && (
        <View style={styles.thirdProfileContainer}>
          <Image
            source={{uri: sharedBy[0]?.user_image}}
            style={styles.userImageStyle}
          />
          <Image
            source={{uri: sharedBy[1]?.user_image}}
            style={[styles.userImageStyle, styles.threeUserImage2Style]}
          />
          <Image
            source={{uri: sharedBy[2]?.user_image}}
            style={[styles.userImageStyle, styles.threeUserImage3Style]}
          />
        </View>
      )}
    </View>
  );
};

export default UserImages;

const styles = StyleSheet.create({
  oneImageContainer: {
    width: 49,
    height: 49,
    marginRight: 13,
    borderRadius: 49,
  },
  // 1 Style
  oneUserImageStyle: {
    height: 49,
    width: 49,
    borderRadius: 49,
  },
  // 2 Style
  secondProfileContainer: {
    //
    width: 60,
    marginRight: 10,
  },
  // 3 Style
  thirdProfileContainer: {
    width: 60,
    // marginRight: 10,
  },
  userImageStyle: {
    height: 32,
    width: 32,
    borderRadius: 32,
    zIndex: 1,
  },
  twoUserImage2Style: {
    height: 38,
    width: 38,
    borderRadius: 38,
    position: 'absolute',
    left: 20,
    top: -4,
    zIndex: 1,
  },
  threeUserImage2Style: {
    zIndex: 2,
    position: 'absolute',
    left: 18,
    top: -18,
    borderWidth: 1.5,
    borderColor: '#CFD7EA',
  },
  threeUserImage3Style: {
    zIndex: 3,
    position: 'absolute',
    left: 24,
    bottom: -8,
    borderWidth: 1.5,
    borderColor: '#CFD7EA',
  },
});
