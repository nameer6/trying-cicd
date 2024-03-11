import {
  RegisterRequestType,
  SendOtpRequestType,
  VerifyOtpRequestType,
} from 'src/helpers/types/auth.types';
import apiClient from './client';
import {errorResolver} from 'src/helpers/resolvers/apiResolvers';
import * as API from 'src/consts/API_URLS';

const auth = {
  sendOtp(payload: SendOtpRequestType) {
    console.log('payload: ' + JSON.stringify(payload));
    return apiClient
      .post(API.SEND_OTP, {
        ...payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  verifyOtp(payload: VerifyOtpRequestType) {
    return apiClient
      .post(API.VERIFY_OTP, {
        ...payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  register(payload: RegisterRequestType) {
    return apiClient
      .post(API.REGISTER, payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  login(payload: VerifyOtpRequestType) {
    return apiClient
      .post(API.LOGIN, payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default auth;
