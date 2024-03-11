import {useMemo, useState} from 'react';
import {Text, View, PermissionsAndroid, Platform} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import Svg, {Path} from 'react-native-svg';
import Contacts from 'react-native-contacts';
import GradientButton from 'src/components/GradientButton';
import Header from './Header';
import PermissionsList from './PermissionsList';
import {styles} from './styles';

const PermissionScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handlePermissionChange = (itemName: string) => {
    const itemExists = selectedPermissions.includes(itemName);

    if (itemExists) {
      // Remove the item from the array
      const updatedItems = selectedPermissions.filter(
        item => item !== itemName,
      );
      setSelectedPermissions(updatedItems);
    } else {
      // Add the item to the array
      setSelectedPermissions([...selectedPermissions, itemName]);
    }
  };

  const getContacts = () => {
    Contacts.getAll()
      .then(async contacts => {
        // work with contacts
        try {
          await OneSignal.Debug.setLogLevel(LogLevel.Verbose);
          // OneSignal Initialization
          await OneSignal.initialize('f8741ba6-7df0-4ab3-83a0-66fa0f2a8c75');
          await OneSignal.Notifications.requestPermission(true);
          navigation.navigate('PhoneNumberScreen', {
            selectedPermissions,
          });
          setLoading(false);
        } catch (err) {
          alert(JSON.stringify(err));
        }
        console.log(contacts);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  };

  const onNext = async () => {
    setLoading(true);
    if (Platform.OS === 'android') {
      // await OneSignal.registerForPushNotifications();
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: '“Reveal” Would Like to Send You Notifications',
        message: 'So you know when your friends reveal to you',
        buttonNegative: "Don't Allow",
        buttonPositive: 'Ok',
      })
        .then(() => {
          setLoading(false);
          getContacts();
        })
        .catch(error => {
          setLoading(false);
          console.error('Permission error: ', error);
        });
    } else {
      getContacts();
    }
  };

  const isContactPermissionGiven = useMemo(() => {
    return selectedPermissions.includes('contacts');
  }, [selectedPermissions]);

  const isNotificationPermissionGiven = useMemo(() => {
    return selectedPermissions.includes('notifications');
  }, [selectedPermissions]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Header
          onlyContactPermissionPending={
            isNotificationPermissionGiven && !isContactPermissionGiven
          }
        />
        <PermissionsList
          navigation={navigation}
          selectedPermissions={selectedPermissions}
          handlePermissionChange={handlePermissionChange}
        />
      </View>
      <View style={styles.footer}>
        <GradientButton
          style={styles.button}
          loading={loading}
          disabled={!isContactPermissionGiven}
          onPress={onNext}>
          <Text
            style={[
              styles.buttonText,
              !isContactPermissionGiven && styles.disabledButtonText,
            ]}>
            Next
          </Text>
        </GradientButton>
        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M13.075 7.27187H12.3469V4.3625C12.3469 1.95313 10.3937 0 7.98437 0C5.57499 0 3.62187 1.95313 3.62187 4.3625V7.27187H2.89374C2.49374 7.27187 2.16562 7.59688 2.16562 8V15.2719C2.16562 15.675 2.49062 16 2.89374 16H13.075C13.475 16 13.8031 15.675 13.8031 15.2719V8C13.8031 7.59688 13.475 7.27187 13.075 7.27187ZM10.8937 7.27187H5.07499V4.3625C5.07499 2.75625 6.37812 1.45312 7.98437 1.45312C9.59062 1.45312 10.8937 2.75625 10.8937 4.3625V7.27187Z"
                fill="white"
              />
            </Svg>
          </View>
          <Text style={styles.footerInfoText}>
            Reveal cares intensely about your privacy. Your data is stored on a
            secure server, and we will never spam or text your contacts.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PermissionScreen;
