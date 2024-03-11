import {useState} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Entypo';
import BackHeader from 'src/components/BackHeader';
import {styles} from './styles';
import settings from 'src/helpers/http/settings';

const ManageAccountScreen = ({navigation}: any) => {
  const [manageAccountOptions] = useState([
    {
      label: 'Blocked Accounts',
    },
  ]);

  const {data} = useQuery({
    queryKey: ['get-blocked-users'],
    queryFn: settings.getBlockedUsers,
  });

  const goToBlockedAccounts = () => {
    navigation.navigate('BlockedAccounts');
  };

  return (
    <View style={styles.content}>
      <BackHeader title="Manage Account" />
      <View style={styles.setingsBlock}>
        <View style={styles.settingsOptionContainer}>
          {manageAccountOptions?.map(i => (
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={goToBlockedAccounts}>
              <Text style={styles.settingsOptoinText}>{i.label}</Text>
              <View style={styles.switchIconView}>
                {data?.data?.length > 0 && (
                  <Text style={styles.blockedAccountCountTextStyle}>
                    {data?.data?.length}
                  </Text>
                )}
                <Icon
                  name="chevron-right"
                  size={22}
                  color="#999A9F"
                  style={styles.archiveArrowIconStyle}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ManageAccountScreen;
