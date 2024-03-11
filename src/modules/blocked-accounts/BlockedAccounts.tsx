import {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import BackHeader from 'src/components/BackHeader';
import ProfileThumbnail from 'src/components/ProfileThumbnail';
import GradientButton from 'src/components/GradientButton';
import NoDataFound from 'src/components/NoDataFound';
import settings from 'src/helpers/http/settings';
import {showErrorToast, showSuccessToast} from 'src/helpers/mics';
import {ContactCardType} from 'src/helpers/types/profile.types';
import {styles} from './styles';

const BlockedAccounts = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const {data, isLoading, isRefetching, refetch} = useQuery({
    queryKey: ['get-blocked-users'],
    queryFn: settings.getBlockedUsers,
  });

  const blockedUsers = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  const confirmDeletion = (item: ContactCardType) => () => {
    Alert.alert(
      'Unblocking',
      'Are you sure you want to unblock this user',
      [
        {
          text: 'Unblock',
          onPress: () => unblockUser(item),
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

  const unblockUser = (item: ContactCardType) => {
    setSelectedUser(item.user_id);
    const payload = {
      userId: item.user_id,
      action: 'unblock',
    };
    settings
      .blockUnblockUser(payload)
      .then(res => {
        setSelectedUser('');
        if (res?.status) {
          showSuccessToast(res?.message);
          refetch();
        } else {
          showErrorToast(res?.message);
        }
      })
      .catch(error => {
        setSelectedUser('');
        showErrorToast(error + '');
      });
  };

  const renderItem = ({item}: {item: ContactCardType}) => {
    return (
      <View style={styles.userItemStyle} key={item?.user_id}>
        <View style={styles.contentView}>
          <ProfileThumbnail
            image={item?.user_image}
            style={styles.imageStyle}
            name={item?.full_name}
          />
          <Text style={styles.userNameTextStyle}>{item?.full_name}</Text>
        </View>
        <View style={styles.switchIconView}>
          {selectedUser !== item.user_id ? (
            <GradientButton
              onPress={confirmDeletion(item)}
              style={styles.revealButtonView}
              radius={16}
              disabled={false}
              secondColorOffset="0.4">
              <Text style={styles.revealTextStyle}>Unblock</Text>
            </GradientButton>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.content}>
      <BackHeader title="Blocked Accounts" />

      {isLoading && <ActivityIndicator style={styles.loader} color="#fff" />}

      {!isLoading && !isRefetching && data?.data?.length === 0 && (
        <NoDataFound
          style={styles.noDataStyle}
          noDataText="No blocked accounts found"
          noDataTextStyle={styles.noDataTextStyle}
          // noDataImage={
          //   <LottieView
          //     style={styles.noDataImage}
          //     source={require('src/assets/lottie/no_users.json')}
          //     autoPlay
          //     loop={false}
          //   />
          // }
        />
      )}

      {!isLoading && data?.data?.length > 0 && (
        <View style={styles.listStyle}>
          <FlatList
            data={blockedUsers}
            renderItem={renderItem}
            keyExtractor={(item: ContactCardType) => item.user_id}
          />
        </View>
      )}
    </View>
  );
};

export default BlockedAccounts;
