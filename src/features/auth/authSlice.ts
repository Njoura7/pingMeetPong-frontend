import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { authApi } from './authApi'

interface AuthState {
  user: string | null;
  username: string | null;
  token: string | null;
  avatar: string | null;
  friends: string[];
  sentRequests: string[];
  pendingRequests: string[];
}

const initialState: AuthState = {
  user: localStorage.getItem('user'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('token'),
  avatar: localStorage.getItem('avatar'),
  friends: [],
  sentRequests: [],
  pendingRequests: []
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null
      state.username = null
      state.token = null
      state.avatar = null
      state.friends = []
      state.sentRequests = []
      state.pendingRequests = []
      localStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        const { user, username, accessToken, avatar, friends, sentRequests, pendingRequests } = payload.data;
        state.user = user;
        state.username = username;
        state.token = accessToken;
        state.avatar = avatar;
        state.friends = friends;
        state.sentRequests = sentRequests;
        state.pendingRequests = pendingRequests;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', user);
        localStorage.setItem('username', username);
        localStorage.setItem('avatar', avatar);
      }
    )
  },
})

export const { logOut } = authSlice.actions

const selectAuthState = (state: RootState) => state.auth

export const selectCurrentUser = createSelector(
  [selectAuthState],
  (authState) => ({
    user: authState.user,
    username: authState.username,
    token: authState.token,
    avatar: authState.avatar,
    friends: authState.friends,
    sentRequests: authState.sentRequests,
    pendingRequests: authState.pendingRequests,
  })
)

export default authSlice.reducer
