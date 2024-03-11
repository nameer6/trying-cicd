export type SendOtpRequestType = {
  country_code: string;
  phone_number: string;
};

export type VerifyOtpRequestType = {
  country_code: string;
  phone_number: string;
  otp_code: string;
};

export type RegisterRequestType = {
  id: string;
  name: string;
  country_code: string;
  phone_number: string;
  age: number;
  user_image: string;
  settings: {
    notification: boolean;
    contacts: boolean;
  };
};
