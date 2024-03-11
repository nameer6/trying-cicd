import apiClient from './client';
import {errorResolver} from 'src/helpers/resolvers/apiResolvers';
import * as API from 'src/consts/API_URLS';

const general = {
  async generateAwsUrl(data: {
    folder: string;
    file_name: string;
    content_type: string;
  }) {
    return apiClient.post(API.UPLOAD_IMAGE, data).then(r => r.data);
  },
  getAvatars() {
    return apiClient
      .get(API.GET_AVATARS)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getEmptyStates() {
    return apiClient
      .get(API.GET_EMPTY_STATES)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default general;
