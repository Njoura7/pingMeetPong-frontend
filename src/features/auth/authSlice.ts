import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { authApi } from './authApi' // Import authApi

interface ServerResponse {
  message: string
  data: {
    user?: string
    username?: string
    accessToken?: string
    avatar?: string
  }
}

const initialState = {
  user: localStorage.getItem('user'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('token'),
  avatar: localStorage.getItem('avatar'),
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
      localStorage.clear() // Clear all items from local storage
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }: { payload: ServerResponse }) => {
        if (payload.data) {
          const { user, username, accessToken, avatar } = payload.data
          state.user = user ?? null
          state.username = username ?? null
          state.token = accessToken ?? null
          state.avatar = avatar ?? null

          if (accessToken) {
            localStorage.setItem('token', accessToken)
          }
          if (user) {
            localStorage.setItem('user', user)
          }
          if (username) {
            localStorage.setItem('username', username)
          }
          if (avatar) {
            localStorage.setItem('avatar', avatar)
          }
        }
      }
    )
  },
})

export const { logOut } = authSlice.actions

// Memoized selector
const selectAuthState = (state: RootState) => state.auth

export const selectCurrentUser = createSelector(
  [selectAuthState],
  (authState) => ({
    user: authState.user,
    username: authState.username,
    token: authState.token,
    avatar: authState.avatar,
  })
)

export default authSlice.reducer
