import {useEffect} from 'react';
import {Switch, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './styles';
import BackHeader from 'src/components/BackHeader';
import {useState} from 'react';
import settings from 'src/helpers/http/settings';
import {showErrorToast, showSuccessToast} from 'src/helpers/mics';
import {updateUserProfile} from 'src/store/reducers/profileStore';

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state.myProfile);
  const [notificationOptions, setNotificationOptions] = useState([
    {
      label: "Only receive Reveals from people you've recently revealed to",
      isEnabled: true,
      key: 'only_receive_from_you_revealed',
    },
    {
      label: 'Someone has unlocked your reveal',
      isEnabled: false,
      key: 'someone_unlocked_your_reveal',
    },
  ]);

  const toggleSwitch = (index: string | number | any) => () => {
    const updatedOptions = [...notificationOptions];
    updatedOptions[index].isEnabled = !updatedOptions[index].isEnabled;
    dispatch(
      updateUserProfile({
        user_notification_settings: {
          only_receive_from_you_revealed: updatedOptions[0]?.isEnabled,
          someone_unlocked_your_reveal: updatedOptions[1]?.isEnabled,
        },
      }),
    );
    setNotificationOptions(updatedOptions);
    changeNotificationSettings();
  };

  useEffect(() => {
    if (user) {
      console.log('notification settings: ', user?.user_notification_settings);
      const userNotificationSettings = user?.user_notification_settings;
      const currentOptions = [...notificationOptions];
      currentOptions.map(item => {
        item.isEnabled = userNotificationSettings[item.key];
      });
      setNotificationOptions(currentOptions);
    }
  }, [user]);

  const changeNotificationSettings = () => {
    const payload = {
      only_receive_from_you_revealed: notificationOptions[0].isEnabled,
      someone_unlocked_your_reveal: notificationOptions[1].isEnabled,
    };
    settings
      .changeNotificationSettings(payload)
      .then(res => {
        console.log('notification settings res: ', res);
        showSuccessToast(res?.message);
      })
      .catch(err => {
        showErrorToast(err + '');
      });
  };

  return (
    <View style={styles.content}>
      <BackHeader title="Notifications" />
      <View style={styles.setingsBlock}>
        <View style={styles.settingsOptionContainer}>
          {notificationOptions?.map((i, index: number) => (
            <View style={styles.settingsRow}>
              <View style={styles.contentView}>
                <Text style={styles.settingsOptoinText}>{i.label}</Text>
              </View>
              <View style={styles.switchIconView}>
                <Switch
                  key={index}
                  trackColor={{false: '#737373', true: '#737373'}}
                  thumbColor={i.isEnabled ? '#00FFB3' : '#f4f3f4'}
                  ios_backgroundColor="#737373"
                  onValueChange={toggleSwitch(index)}
                  value={i.isEnabled}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NotificationSettings;
