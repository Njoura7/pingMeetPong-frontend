import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { authApi } from '../auth/authApi'; // Import authApi

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null as string | null, token: null as string | null },
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.registerUser.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.accessToken;
      })
      .addMatcher(authApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.accessToken;
      });
  },
});

export const { logOut } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;

export default authSlice.reducer; // Export authSlice reducer