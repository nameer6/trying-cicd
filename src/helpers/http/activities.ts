import apiClient from './client';
import {errorResolver} from 'src/helpers/resolvers/apiResolvers';
import * as API from 'src/consts/API_URLS';

const activities = {
  getRevealNotifications() {
    return apiClient
      .get(API.GET_REVEAL_NOTIFICATIONS + '?page=1&limit=500')
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getSocialNotifications(payload: {page?: number; limit: number}) {
    return apiClient
      .get(
        API.GET_SOCIAL_NOTIFICATIONS +
          `?page=${payload.page || 1}&limit=${payload.limit}`,
      )
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default activities;
