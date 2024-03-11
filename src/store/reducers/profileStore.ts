import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile_store',
  initialState: {
    user: {
      full_name: '',
      user_image: '',
    },
    contactsOnReveal: [],
    otherContacts: [],
  },
  reducers: {
    updateUserProfile(state, action: PayloadAction<any>) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    updateContacts(state, action: PayloadAction<any>) {
      state.contactsOnReveal = action.payload.contactsOnReveal;
      state.otherContacts = action.payload.otherContacts;
    },
  },
});

export const {updateUserProfile, updateContacts} = profileSlice.actions;
export default profileSlice.reducer;
