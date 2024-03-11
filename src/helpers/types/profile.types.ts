interface ContactType {
  contact_id: string;
  phone_number: string;
}

export type SyncContactsRequestType = ContactType[];

export type SaveContactsRequestType = {
  name: string;
  phone_number: string;
}[];

export interface ContactCardType {
  user_id: string;
  friend_user_id?: string;
  full_name: string;
  friend_name?: string;
  country_code: string;
  phone_number: string;
  user_image: string;
  contact_id: string;
  isChecked?: boolean;
  max_streak?: number;
  is_in_contact?: boolean;
}

export interface ProfileType {
  user_id: string;
  full_name: string;
  country_code: string;
  user_age: number;
  user_image: string;
  user_settings: {
    contacts: boolean;
    notification: boolean;
  };
  date_created: string;
}

export type UpdateProfileRequestType = {
  name?: string;
  user_image?: string;
  user_settings?: {
    notification: boolean;
    contacts: boolean;
  };
};
