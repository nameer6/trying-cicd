import axios, {AxiosError, AxiosResponse} from 'axios';
import {BASE_API_URL} from 'src/consts/API_URLS';
import {getToken, removeToken} from 'src/helpers/storage';
import * as RootNavigation from 'src/navigation/RootNavigation';

const abortController = new AbortController();

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.log('error.response?.status=>: ' + error.response?.status);
  if (error.response?.status === 401) {
    abortController.abort();
    removeToken();
    const currentScreen =
      RootNavigation?.navigationRef?.current?.getCurrentRoute()?.name;
    if (
      currentScreen !== 'CreateAccStart' &&
      currentScreen !== 'PhoneNumberScreen' &&
      currentScreen !== 'SelectAgeScreen'
    ) {
      RootNavigation.navigate('CreateAccStart');
    }
    // showErrorToast('Session expired. Please login again.');
  }
  return Promise.reject(error);
};

const apiClient = axios.create({
  baseURL: BASE_API_URL,
});

apiClient.interceptors.request.use(
  async (config: any) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = 'bearer ' + token;
      console.log('token: ' + token);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(onResponse, onResponseError);

export default apiClient;
