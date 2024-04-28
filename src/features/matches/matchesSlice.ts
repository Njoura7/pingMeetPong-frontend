import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { matchesApi } from './matchesApi'; 
import { Match } from '@/types';


interface FindMatchesServerResponse {
  message: string;
  data: Match[];
}

interface JoinMatchServerResponse {
  message: string;
  data: Match;
}

const initialState = {
  matches: [] as Match[],
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(matchesApi.endpoints.findMatchesByPlayer.matchFulfilled, (state, { payload }: { payload: FindMatchesServerResponse }) => {
      if (payload.data) {
        state.matches = payload.data;
      }
    });
    // !~ to be considered
    builder.addMatcher(matchesApi.endpoints.joinMatch.matchFulfilled, (state, { payload }: { payload: JoinMatchServerResponse }) => {
      // Find the index of the joined match in the state
      const index = state.matches.findIndex((match) => match.code === payload.data.code);
      if (index !== -1) {
        // Update the match in the state
        state.matches[index] = payload.data;
      }
    });
  },
});

// Select the matches from the store
export const selectMatches = (state: RootState) => state.matches.matches;

export default matchesSlice.reducer; // Export matchesSlice reducer