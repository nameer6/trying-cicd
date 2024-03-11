import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo} from 'react';
import {Animated, View} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {useDispatch} from 'react-redux';
import Contacts from 'react-native-contacts';
import profile from 'src/helpers/http/profile';
import reveals from 'src/helpers/http/reveals';
import {updateUserProfile} from 'src/store/reducers/profileStore';
import Header from './Header';
import RevealTimeline from './RevealTimeline';
import {styles} from './styles';
import {setHasNotifications} from 'src/store/reducers/app-settings';

const Home = ({navigation}: any) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const saveContacts = () => {
    Contacts.getAll()
      .then((contacts: any) => {
        if (contacts?.length > 0) {
          const formattedContacts: any = [];
          contacts.forEach((item: any) => {
            const name = [item.givenName, item.familyName].join(' ');

            item.phoneNumbers.forEach((phoneNumberObj: any) => {
              const phoneNumber = phoneNumberObj.number;
              formattedContacts.push({
                name,
                phone_number: phoneNumber,
              });
            });
          });
          const payload = formattedContacts;
          profile
            .saveContacts(payload)
            .then(res => {
              // console.log('res: ' + JSON.stringify(res));
            })
            .catch(err => {
              console.log(err + '');
            });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    saveContacts();
  }, []);

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 64);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 64],
    outputRange: [0, -64],
  });

  const {data, refetch: refetchCounts} = useQuery({
    queryKey: ['get-inbox-count'],
    queryFn: () => reveals.getInboxCount(),
  });

  const inboxCount = useMemo(() => {
    return data?.data?.total || 0;
  }, [data?.data?.total]);

  const configureNotification = useCallback(
    (user: any) => {
      try {
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.initialize('f8741ba6-7df0-4ab3-83a0-66fa0f2a8c75');
        OneSignal.Notifications.requestPermission(true);

        OneSignal.login(user?.user_id);
        OneSignal.Notifications.addEventListener('click', event => {
          console.log('OneSignal: notification clicked:', event);
          const action = event?.notification?.additionalData?.action;
          setTimeout(() => {
            if (action === 'send_reveal') {
              // navigation.navigate('Activities');
            } else {
              navigation.navigate('RevealPostScreen', {
                revealId: event?.notification?.additionalData?.answer_id,
                type: action.toUpperCase(),
              });
            }
          }, 2000);
        });
        OneSignal.Notifications.addEventListener(
          'foregroundWillDisplay',
          async event => {
            console.log('OneSignal: notification received:', event);
            event.notification.display();
            const action = event?.notification?.additionalData?.action;
            await dispatch(setHasNotifications(true));
            if (action === 'send_reveal') {
              refetchCounts();
              // ['get-locked-reveals']
              queryClient.refetchQueries(['get-locked-reveals']);
            }
          },
        );
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err + '');
      }
    },
    [navigation],
  );

  const checkProfile = useCallback(async () => {
    profile
      .getProfile()
      .then(async res => {
        console.log('profile res: ' + JSON.stringify(res));
        await dispatch(updateUserProfile(res?.data));
        await dispatch(
          setHasNotifications(Boolean(res?.data?.has_new_notifications)),
        );
        configureNotification(res?.data);
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }, [configureNotification, dispatch]);

  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  return (
    <View style={styles.container}>
      <Header unreadCounts={inboxCount} translateY={translateY} />
      <View style={styles.content}>
        <RevealTimeline
          refetchCounts={refetchCounts}
          onScroll={e => {
            if (e.nativeEvent.contentOffset.y >= 0) {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }
          }}
        />
      </View>
    </View>
  );
};

export default Home;
