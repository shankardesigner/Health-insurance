/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const userInitialState = {
  loading: false,
  error: '',
  user: {
    name: null,
    nickname: null,
    picture: null,
    sid: null,
    sub: null,
    updated_at: null,
  }
};
export const userSlice = createSlice({
  name: "profile",
  initialState: userInitialState,
  reducers: {
    updateUser: (state, action) => {
     const user = action.payload;
     state.loading = false;
     state.user = user;
    },
    removeUser: (state) => {
      state.loading = false;
      state.error =  '';
      state.user = {
        name: null,
        nickname: null,
        picture: null,
        sid: null,
        sub: null,
        updated_at: null,
      }
    }
  },
  extraReducers: (builder) => {
  },
});

export const { updateUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
