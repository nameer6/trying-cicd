import {removeToken} from 'src/helpers/storage';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Toast from 'react-native-toast-message';
import {STREAK_EMOJIS} from 'src/consts/STREAK_EMOJIS';

export const resetFlow = async ({
  navigation,
  screenName = 'Splash',
  logout = false,
}: {
  navigation: any;
  screenName?: string;
  logout?: boolean;
}) => {
  if (logout) {
    await removeToken();
  }
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: screenName,
        },
      ],
    }),
  );
};

export const triggerHapticFeedback = (method = 'impactMedium') => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  // Trigger haptic feedback
  ReactNativeHapticFeedback.trigger(method, options);
};

export const showSuccessToast = (msg: string) => {
  Toast.hide();
  Toast.show({
    type: 'successToast',
    props: {title: msg},
  });
  triggerHapticFeedback('notificationSuccess');
};

export const showErrorToast = (msg: string) => {
  Toast.hide();
  Toast.show({
    type: 'errorToast',
    props: {title: msg},
  });
  triggerHapticFeedback('notificationError');
};

export function isUrl(str: string) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(str);
}

export const formatDate = (date: string, format?: string) => {
  if (format === 'fromNow') {
    moment.updateLocale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: '%ds',
        m: '%dm',
        mm: '%dm',
        hh: '%dh',
        dd: '%dd',
        M: 'amth',
        MM: '%dmths',
        y: 'y',
        yy: '%dy',
      },
    });
    return moment.utc(date).local().fromNow();
  }
  return moment
    .utc(date)
    .local()
    .format(format || 'MMM D, YYYY');
};

export function secondsToMMSS(seconds: number) {
  const roundedSeconds = Math.ceil(seconds);
  return `${String(Math.floor(roundedSeconds / 60)).padStart(2, '0')}:${String(
    roundedSeconds % 60,
  ).padStart(2, '0')}`;
}

export const imageUrlToBase64 = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise(resolve => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        const base64 = reader?.result?.split(',')[1];
        resolve(base64);
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    return null;
  }
};

export const getStrekTextEmoji = (days: number) => {
  let emoji = '';
  if (days < 7) {
    emoji = STREAK_EMOJIS.days[days];
  }
  if (days > 7 && days < 30) {
    emoji = '🙂';
  }
  if (days >= 30 && days < 365) {
    emoji = '🗓️';
  }
  if (days > 365) {
    emoji = '❤️‍🔥';
  }
  let duration = '';
  if (days < 7) {
    duration = 'day';
  }
  if (days >= 7 && days < 30) {
    duration = 'week';
  }
  if (days >= 30 && days < 365) {
    duration = 'month';
  }
  if (days > 365) {
    duration = 'year';
  }
  let durationText = `${days} ${duration} streak`;
  if (duration === 'week') {
    const weeeks = Math.floor(days / 7);
    durationText = weeeks + ' week streak';
  }
  return {
    duration: durationText,
    emoji,
  };
};
