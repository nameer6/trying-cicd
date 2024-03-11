import {useState} from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import VersionInfo from 'react-native-version-info';
import {OneSignal} from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/Entypo';
import LogoutIcon from 'src/assets/icons/logout.svg';
import TrashIcon from 'src/assets/icons/trash.svg';
import BackHeader from 'src/components/BackHeader';
import profile from 'src/helpers/http/profile';
import {resetFlow, showErrorToast, showSuccessToast} from 'src/helpers/mics';
import {setUser} from 'src/store/reducers/auth';
import {styles} from './styles';
import {useDispatch} from 'react-redux';

const SETTINGS_OPTIONS = {
  account: [
    {
      label: 'Payment',
      path: '',
    },
    {
      label: 'Notifications',
      path: 'NotificationSettings',
    },
    {
      label: 'Manage Account',
      path: 'ManageAccountScreen',
    },
  ],
  community: [
    {
      label: 'FAQ',
    },
    {
      label: 'Safety',
    },
  ],
  legal: [
    {
      label: 'Privacy Policy',
    },
    {
      label: 'Terms of Service',
    },
  ],
};

const Settings = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState<boolean>(false);
  const onLogout = async () => {
    await OneSignal.logout();
    await dispatch(setUser(null));
    resetFlow({
      navigation,
      screenName: 'CreateAccStart',
      logout: true,
    });
  };

  const handleDeleteAccount = () => {
    setDeleting(true);
    profile
      .deleteMyProfile()
      .then(res => {
        if (res?.status) {
          showSuccessToast(res?.message);
          resetFlow({
            navigation,
            screenName: 'CreateAccStart',
            logout: true,
          });
        }
        setDeleting(false);
      })
      .catch(error => {
        setDeleting(false);
        showErrorToast(error + '');
      });
  };

  const confirmDelete = () => {
    Alert.alert('Are you sure you want to delete your account?', '', [
      {
        text: 'cancel',
        onPress: () => console.log('OK Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes, delete',
        onPress: () => {
          handleDeleteAccount();
        },
      },
    ]);
  };

  const onSelectOption = (path: string) => () => {
    navigation.navigate(path);
  };
  return (
    <View style={styles.container}>
      <BackHeader title="Settings" style={styles.headerStyle} />
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <View style={styles.content}>
          <View>
            <Text style={styles.sectionLabel}>ACCOUNT</Text>
            <View style={styles.settingsOptionContainer}>
              {SETTINGS_OPTIONS.account?.map((i, index: number) => (
                <TouchableOpacity
                  style={[
                    styles.settingsRow,
                    index !== SETTINGS_OPTIONS.account?.length - 1 &&
                      styles.settingsOptionBorder,
                  ]}
                  onPress={onSelectOption(i.path)}
                  key={i.label + 'setting-account'}>
                  <Text style={styles.settingsOptoinText}>{i.label}</Text>
                  <Icon name="chevron-right" size={22} color="#77777D" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.setingsBlock}>
            <Text style={styles.sectionLabel}>COMMUNITY</Text>
            <View style={styles.settingsOptionContainer}>
              {SETTINGS_OPTIONS.community?.map((i, index: number) => (
                <TouchableOpacity
                  style={[
                    styles.settingsRow,
                    index === 0 && styles.settingsOptionBorder,
                  ]}
                  key={i.label + 'setting-community'}>
                  <Text style={styles.settingsOptoinText}>{i.label}</Text>
                  <Icon name="chevron-right" size={22} color="#77777D" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={[styles.setingsBlock, {marginTop: 40}]}>
            <Text style={styles.sectionLabel}>LEGAL</Text>
            <View style={styles.settingsOptionContainer}>
              {SETTINGS_OPTIONS.legal?.map((i, index: number) => (
                <TouchableOpacity
                  style={[
                    styles.settingsRow,
                    index === 0 && styles.settingsOptionBorder,
                  ]}
                  key={i.label + 'setting-legal'}>
                  <Text style={styles.settingsOptoinText}>{i.label}</Text>
                  <Icon name="chevron-right" size={22} color="#77777D" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButtonStyle}
            onPress={confirmDelete}
            disabled={deleting}>
            {!deleting ? (
              <>
                <TrashIcon />
                <Text style={styles.footerButtonTextStyle}>Delete Account</Text>
              </>
            ) : (
              <ActivityIndicator color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButtonStyle} onPress={onLogout}>
            <LogoutIcon />
            <Text style={styles.footerButtonTextStyle}>Log out</Text>
          </TouchableOpacity>
          <Text style={styles.versionTextStyle}>
            Version{' '}
            {parseFloat(VersionInfo.appVersion).toFixed(1) +
              ' (' +
              VersionInfo.buildVersion +
              ')'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
