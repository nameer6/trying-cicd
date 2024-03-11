import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'app-settings',
  initialState: {
    settings: {},
    has_notification: false,
  },
  reducers: {
    setSettings(state, action: PayloadAction<any>) {
      state.settings = action.payload;
    },
    setHasNotifications(state, action: PayloadAction<any>) {
      state.has_notification = action.payload;
    },
  },
});

export const {setSettings, setHasNotifications} = settingsSlice.actions;
export default settingsSlice.reducer;
