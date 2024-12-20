import { createSlice } from '@reduxjs/toolkit'
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
        // console.log('Message', payload);  // Log the message
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

// save the state of the user, username, token, and avatar in the store and use it later
// in the components(we can select just the ones we need in the component)
export const selectCurrentUser = (state: RootState) => ({
  user: state.auth.user,
  username: state.auth.username,
  token: state.auth.token,
  avatar: state.auth.avatar,
})

export default authSlice.reducer
