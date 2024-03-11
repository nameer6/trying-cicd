import {
  SaveContactsRequestType,
  SyncContactsRequestType,
  UpdateProfileRequestType,
} from 'src/helpers/types/profile.types';
import apiClient from './client';
import {errorResolver} from 'src/helpers/resolvers/apiResolvers';
import * as API from 'src/consts/API_URLS';

const profile = {
  syncContacts(payload: SyncContactsRequestType) {
    return apiClient
      .post(API.SYNC_CONTACTS, {
        contacts: payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  saveContacts(payload: SaveContactsRequestType) {
    return apiClient
      .post(API.SAVE_CONTACTS, {
        contacts: payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getContactsToShare(payload: SaveContactsRequestType) {
    return apiClient
      .post(API.GET_CONTACTS_TO_SHARE, {
        contacts: payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getProfile() {
    return apiClient
      .get(API.GET_PROFILE)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  updateProfile(payload: UpdateProfileRequestType) {
    return apiClient
      .put(API.UPDATE_PROFILE, payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  deleteMyProfile() {
    return apiClient
      .delete(API.DELETE_PROFILE)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default profile;
