import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const revealTimelineSlice = createSlice({
  name: 'revealTimeline',
  initialState: {
    reveal: null,
    unreadCounts: 0,
    lockedReveals: [],
  },
  reducers: {
    updateReveal(state, action: PayloadAction<any>) {
      state.reveal = action.payload;
    },
    updateUnreadCounts(state, action: PayloadAction<any>) {
      state.unreadCounts = action.payload;
    },
    updateLockedReveals(state, action: PayloadAction<any>) {
      state.lockedReveals = action.payload;
    },
  },
});

export const {updateReveal, updateUnreadCounts, updateLockedReveals} =
  revealTimelineSlice.actions;
export default revealTimelineSlice.reducer;
