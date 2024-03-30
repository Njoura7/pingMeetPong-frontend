import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { authApi } from '../auth/authApi'; // Import authApi


interface ServerResponse {
  message: string;
  data: {
    user?: string;
    accessToken?: string;
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null as string | null, token: null as string | null },
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove the token from local storage
    },
  },
  extraReducers: (builder) => {
    // ? we dont need to track any state changes for the registerUser endpoint since the credentials will be stored in the db,
    // ? and user will be directed to the '/login' route 

    // ? ignoring the state parameter('_') as we are not using it in the register process
    builder.addMatcher(authApi.endpoints.registerUser.matchFulfilled, (state, { payload }: { payload: ServerResponse }) => {
      console.log('Message', payload);  // Log the message
    // Handle the data (if any)
    })
    builder.addMatcher(authApi.endpoints.loginUser.matchFulfilled, (state, { payload }: { payload: ServerResponse }) => {
      // console.log('Message', payload);  // Log the message
      if (payload.data) {
        state.user = payload.data.user ?? null;
        state.token = payload.data.accessToken ?? null;
        if (payload.data.accessToken) {
          localStorage.setItem('token', payload.data.accessToken); // Store the token in local storage
        }
      }
    });
  },
});

export const { logOut } = authSlice.actions;

export const selectCurrentUsers = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;

export default authSlice.reducer; // Export authSlice reducer