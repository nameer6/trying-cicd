import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
  },
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const {setUser} = authSlice.actions;
export default authSlice.reducer;
