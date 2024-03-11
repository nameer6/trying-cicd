import {configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import profileStore from './reducers/profileStore';
import createReveal from './reducers/createReveal';
import revealTimeline from './reducers/revealTimeline';
import settingsStore from './reducers/app-settings';
import audioReducer from './reducers/audioSlice';

export const store = configureStore({
  reducer: {
    user: authReducer,
    myProfile: profileStore,
    createReveal: createReveal,
    revealTimeline: revealTimeline,
    settingsStore: settingsStore,
    audio: audioReducer,
  },
});
