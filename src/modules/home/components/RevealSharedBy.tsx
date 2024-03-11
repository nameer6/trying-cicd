import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {fonts} from 'src/common/fonts';
import {formatDate} from 'src/helpers/mics';
import {SharedByType, SharedWithType} from 'src/helpers/types/reveal.types';

type Props = {
  sharedBy: SharedByType;
  sharedWith: SharedWithType[];
  createdDate: string;
  onViewOthers?: () => void;
  isOwnReveal?: boolean;
};

const RevealSharedBy = ({
  sharedBy,
  sharedWith,
  createdDate,
  onViewOthers,
  isOwnReveal,
}: Props) => {
  const {user} = useSelector((state: any) => state.myProfile);
  const navigation = useNavigation();

  const onViewUser = () => {
    if (isOwnReveal) {
      navigation.navigate('Profile' as never);
    } else {
      navigation.navigate(
        'RevealsWithOthers' as never,
        {
          userId: sharedBy.user_id,
          name: sharedBy?.full_name,
        } as never,
      );
    }
  };
  return (
    <View style={styles.sharedByView}>
      <View style={styles.profileNTitleView}>
        <Pressable onPress={onViewUser}>
          <FastImage
            source={{
              uri: !isOwnReveal ? sharedBy?.user_image : user?.user_image,
            }}
            style={styles.sharedByImage}
          />
        </Pressable>
        {!isOwnReveal ? (
          <View style={styles.sharedWithView}>
            <Text style={styles.sharedByTextStyle}>
              {sharedBy?.full_name?.trim()}
              <Text style={styles.sharedByMediumTextStyle}>
                {' '}
                revealed to you{' '}
              </Text>
              <Text style={styles.sharedByMediumTextStyle}>
                {sharedWith?.length > 0 && (
                  <>
                    and{' '}
                    <Pressable
                      onPress={onViewOthers}
                      style={styles.othersCountTextStyle}>
                      <Text
                        style={[
                          styles.sharedByMediumTextStyle,
                          {
                            verticalAlign: 'middle',
                          },
                        ]}>
                        {sharedWith?.length} other
                        {sharedWith?.length > 1 ? 's' : ''}{' '}
                      </Text>
                    </Pressable>
                  </>
                )}
                <Text style={styles.timeStyle}>
                  {formatDate(createdDate, 'fromNow')}
                </Text>
              </Text>
            </Text>
          </View>
        ) : (
          <View style={styles.sharedByMe}>
            <Text style={styles.sharedByTextStyle}>
              <Text style={styles.sharedByBoldTextStyle}>You </Text>
              {sharedWith?.length > 0 && (
                <Text style={styles.sharedByMediumTextStyle}>
                  revealed to{' '}
                  {sharedWith?.length > 1 ? (
                    <Pressable
                      onPress={onViewOthers}
                      style={styles.othersCountTextStyle}>
                      <Text style={styles.sharedByMediumTextStyle}>
                        {sharedWith?.length} others{' '}
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.sharedByBoldTextStyle}>
                      {sharedWith[0].full_name || sharedWith[0].friend_name}
                    </Text>
                  )}
                </Text>
              )}
            </Text>
            <Text style={styles.timeStyle}>
              {formatDate(createdDate, 'fromNow')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RevealSharedBy;

const styles = StyleSheet.create({
  sharedByView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    justifyContent: 'space-between',
    flex: 1,
  },
  profileNTitleView: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  sharedByImage: {
    height: 46,
    width: 46,
    borderRadius: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  sharedWithView: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
    marginLeft: 8,
  },
  sharedByMe: {
    maxWidth: '70%',
    marginLeft: 10,
    gap: 2,
  },
  sharedByTextStyle: {
    fontSize: 17,
    fontFamily: fonts.HELVETICA_BOLD,
    color: '#000',
  },
  sharedByBoldTextStyle: {
    fontSize: 17,
    fontFamily: fonts.HELVETICA_BOLD,
    color: '#000',
  },
  sharedByMediumTextStyle: {
    fontSize: 17,
    fontFamily: fonts.HELVETICA_MEDIUM,
    color: '#000',
  },
  timeStyle: {
    color: '#9F9F9F',
    fontSize: 13,
    fontFamily: fonts.HELVETICA_MEDIUM,
  },
  deleteButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  othersCountTextStyle: {
    minHeight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -3.2,
    // backgroundColor: 'red',
  },
});
