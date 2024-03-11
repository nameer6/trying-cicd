export interface ActivityItemType {
  full_name: string;
  date_created: string;
  user_image: string;
  message?: string;
  sharedWith?: number | null;
  type: string;
}

export interface RevealActivityType {
  answer_id: string;
  reveal_date: string;
  is_locked: number;
  shared_with_total: number | null;
  shared_by: {
    user_id: string;
    full_name: string;
    user_image: string;
  };
}

export interface SocialActivityType {
  user_notification_id: number;
  full_name: string;
  user_image: string;
  notification_type: string;
  title: string;
  message: string;
  payload_data: {
    action: string;
    answer_id: string;
  };
  payload_values: {
    emoji: string;
    _user_id: string;
    answer_id: string;
    user_name: string;
  };
  is_read: 0;
  date_created: string;
  data: {};
}
