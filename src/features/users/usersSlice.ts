import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { usersApi } from './usersApi'; // Import usersApi

import { User } from '@/types'; // replace with the path to your User type

interface ServerResponse {
  message: string;
  data: User;
}

const initialState = {
  user: null as User | null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(usersApi.endpoints.getUserById.matchFulfilled, (state, { payload }: { payload: ServerResponse }) => {
      if (payload.data) {
        state.user = payload.data;
      }
    });
  },
});

// Select the user from the store
export const selectUser = (state: RootState) => state.users.user;

export default usersSlice.reducer; // Export usersSlice reducer