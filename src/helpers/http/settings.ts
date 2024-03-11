import {ChangeNotificationSettingsRequestType} from 'src/helpers/types/settings.types';
import apiClient from './client';
import {errorResolver} from 'src/helpers/resolvers/apiResolvers';
import * as API from 'src/consts/API_URLS';

const settings = {
  changeNotificationSettings(payload: ChangeNotificationSettingsRequestType) {
    return apiClient
      .post(API.CHANGE_NOTIFICATION_SETTINGS, {
        notification_settings: {...payload},
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getBlockedUsers() {
    return apiClient
      .get(API.GET_BLOCKED_FRIENDS)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  blockUnblockUser(payload: {action: string; userId: string}) {
    return apiClient
      .post(`/friend/${payload.userId}/action`, {
        action: payload.action,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getAppSettings() {
    return apiClient
      .get(API.GET_APP_SETTINGS)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  reportUser(payload: {
    reason: string;
    userId: string;
    _user_revealed_answer_id: string;
  }) {
    return apiClient
      .post(`/user/${payload.userId}/report`, {
        reason: payload.reason,
        _user_revealed_answer_id: payload._user_revealed_answer_id,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default settings;
