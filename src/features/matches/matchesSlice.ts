import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { matchesApi } from './matchesApi'; // Import matchesApi

interface Match {
  name: string;
  code: string;
  place: string;
  date: Date;
}

interface ServerResponse {
  message: string;
  data: Match[];
}

const initialState = {
  matches: [] as Match[],
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(matchesApi.endpoints.findMatchesByPlayer.matchFulfilled, (state, { payload }: { payload: ServerResponse }) => {
      if (payload.data) {
        state.matches = payload.data;
      }
    });
  },
});

// Select the matches from the store
export const selectMatches = (state: RootState) => state.matches.matches;

export default matchesSlice.reducer; // Export matchesSlice reducer