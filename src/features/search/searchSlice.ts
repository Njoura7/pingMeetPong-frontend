import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchApi } from './searchApi';
import { User } from '../../types'; // Import the User interface from your types.ts file

interface SearchState {
  users: User[];
}

const initialState: SearchState = {
  users: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      searchApi.endpoints.searchUsers.matchFulfilled,
      (state, { payload }) => {
        state.users = payload;
      }
    );
  },
});

export const { setSearchUsers } = searchSlice.actions; // Export setSearchUsers action

export default searchSlice.reducer;
