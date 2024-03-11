import {
  SaveRevealRequestType,
  ShareRevealRequestType,
  AddCommentRequestType,
  AddReactionRequestType,
} from 'src/helpers/types/reveal.types';
import apiClient from './client';
import {errorResolver} from 'src/helpers/resolvers/apiResolvers';
import * as API from 'src/consts/API_URLS';

const reveals = {
  getCategories() {
    return apiClient
      .get(API.GET_CATEGORIES)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getAllRevealQuestions(payload: {
    category_id: string;
    exclude_reveals?: string[];
  }) {
    console.log('Get questions homee: ' + JSON.stringify(payload));
    return apiClient
      .post(API.GET_REVEAL_QUESTION, payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getRevealTimeline(payload: {pageParam: number; limit: number}) {
    const {pageParam, limit} = payload;
    console.log('pageParam:>--> ' + JSON.stringify(pageParam));
    if (!Number(pageParam)) {
      return null;
    }
    return apiClient
      .get(API.GET_REVEAL_TIMELINE + `?page=${pageParam}&limit=${limit}`)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getLockedRevealTimeline() {
    return apiClient
      .get(API.GET_LOCKED_REVEAL_TIMELINE)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  saveReveal(payload: SaveRevealRequestType) {
    return apiClient
      .post(API.SAVE_REVEAL, {
        ...payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  shareReveal(payload: ShareRevealRequestType) {
    return apiClient
      .post(API.SHARE_REVEAL, {
        ...payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getComments(payload: {answerId: string; page: number; limit: number}) {
    return apiClient
      .get(
        `/reveal/${payload.answerId}/comments?page=${payload.page}&limit=${payload.limit}`,
      )
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  addComment(payload: AddCommentRequestType) {
    return apiClient
      .post(`/reveal/${payload.answer_id}/comment`, {
        ...payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  addReaction(payload: AddReactionRequestType) {
    return apiClient
      .post(`/reveal/${payload.answer_id}/reaction`, {
        ...payload,
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getArchivePosts(payload: {page?: number; limit: number}) {
    if (!Number(payload.page)) {
      return null;
    }
    return apiClient
      .get(
        API.USER_ARCHIVE_POSTS +
          `?page=${payload.page || 1}&limit=${payload.limit}`,
      )
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getRevealsWithOthers(payload: {
    page?: number;
    limit: number;
    userId: string;
  }) {
    console.log(
      `/user/${payload.userId}/reveals?page=${payload.page || 1}&limit=${
        payload.limit
      }`,
    );
    return apiClient
      .get(
        `/user/${payload.userId}/reveals?page=${payload.page || 1}&limit=${
          payload.limit
        }`,
      )
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  deleteArchivePosts(answer_id: any) {
    return apiClient
      .delete(`/user/reveal/${answer_id}`)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  generateShareLink(answer_id: string) {
    console.log(`/reveal/${answer_id}/share/link`);
    return apiClient
      .get(`/reveal/${answer_id}/share/link`)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getRevealPostDetails(answer_id?: string | null) {
    return apiClient
      .get(`/reveal/${answer_id}`)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getRecents() {
    return apiClient
      .get(API.GET_RECENTS)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getInboxCount() {
    return apiClient
      .get(API.GET_INBOX_COUNT)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  shareWithOtherContact(payload: {
    answer_id: string;
    phone_number: string;
    contact_name: string;
  }) {
    return apiClient
      .post('/user/reveal/share-contact', payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  markRevealAsSeen(payload: string[]) {
    return apiClient
      .post('/user/reveal/seen', {answer_ids: payload})
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default reveals;
