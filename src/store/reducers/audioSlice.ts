// audioSlice.js
import {createSlice} from '@reduxjs/toolkit';

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    currentAudio: null,
    currentAnswerId: null,
  },
  reducers: {
    startAudio: (state, action) => {
      state.currentAudio = action.payload.currentAudio;
      state.currentAnswerId = action.payload.currentAnswerId;
    },
    stopAudio: state => {
      state.currentAudio = null;
      state.currentAnswerId = null;
    },
  },
});

export const {startAudio, stopAudio} = audioSlice.actions;

export default audioSlice.reducer;
