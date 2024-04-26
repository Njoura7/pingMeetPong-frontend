import { createSlice,PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { usersApi } from './usersApi'; 
import { User } from '@/types'; 

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
    builder.addMatcher(
      usersApi.endpoints.getUserById.matchFulfilled,
      (state, action: PayloadAction<ServerResponse>) => {
        state.user = action.payload.data;
      }
    );
  },
});

export const selectUser = (state: RootState) => state.users.user;

export default usersSlice.reducer;