export interface CreateRevealQuestionType {
  question_id: string;
  question_text: string;
  category_name: string;
  category_image: string;
}

export interface SharedByType {
  user_id: string;
  full_name: string;
  user_image: string;
}

export interface SharedWithType {
  full_name?: string;
  friend_name?: string;
  user_image: string;
}

export type ReactionType = {
  reaction_unicode: string;
  count: number;
  isCurrentUser?: boolean;
};

export interface RevealTimelineType {
  answer_id: string;
  share_id: number;
  question_text: string;
  reveal_date: string;
  is_locked: 0 | 1;
  answer_text?: string;
  shared_by: SharedByType;
  shared_with: SharedWithType[];
  total_comments: number;
  reactions: ReactionType[];
  current_user_reactions: string[];
  answer_audio_url?: string;
  answer_audio_duration?: string;
}

export type SaveRevealRequestType = {
  question_id: string;
  answer_text?: string;
  answer_audio_url?: string;
  answer_audio_duration?: string;
  answer_id?: string;
};

export type ShareRevealRequestType = {
  answer_id?: string;
  friend_user_ids: string[];
};

export type AddCommentRequestType = {
  answer_id?: string;
  comment_text: string;
};

export type AddReactionRequestType = {
  answer_id?: string;
  reaction: string;
};

export interface CommentType {
  comment_id: string;
  comment_text: string;
  date_created: string;
  full_name: string;
  user_id: string;
  user_image: string;
}

export interface ShareDataType {
  question_text: string;
  share_url: string;
  story_image_url: string;
}

export type RevealDetailsType = {
  answer_audio_url: string | null;
  answer_id: string;
  answer_text: string;
  current_user_reactions: any;
  is_locked: number;
  question_text: string;
  reactions: any;
  reveal_date: string;
  shared_by: {
    full_name: string;
    user_id: string;
    user_image: string;
  };
  shared_with: any;
  total_comments: number;
};

export interface SuggestionType {
  reveal_to: string;
  image: string;
  text: string;
}
