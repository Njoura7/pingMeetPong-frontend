import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { matchesApi } from './matchesApi'; // Import matchesApi

import { Match } from '@/types';


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
    builder.addMatcher(matchesApi.endpoints.joinMatch.matchFulfilled, (state, { payload }: { payload: Match }) => {
      // Find the index of the joined match in the state
      const index = state.matches.findIndex((match) => match.code === payload.code);
      if (index !== -1) {
        // Update the match in the state
        state.matches[index] = payload;
      }
    });
  },
});

// Select the matches from the store
export const selectMatches = (state: RootState) => state.matches.matches;

export default matchesSlice.reducer; // Export matchesSlice reducer