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

interface ScoreUpdateResponse {
  message: string;
  data: Match;
}

interface MatchesState {
  matches: Match[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  status: 'idle',
  error: null
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        matchesApi.endpoints.findMatchesByPlayer.matchFulfilled,
        (state, { payload }: { payload: FindMatchesServerResponse }) => {
          state.matches = payload.data;
          state.status = 'succeeded';
        }
      )
      .addMatcher(
        matchesApi.endpoints.joinMatch.matchFulfilled,
        (state, { payload }: { payload: JoinMatchServerResponse }) => {
          const index = state.matches.findIndex((match) => match._id === payload.data._id);
          if (index !== -1) {
            state.matches[index] = payload.data;
          } else {
            state.matches.push(payload.data);
          }
        }
      )
      .addMatcher(
        matchesApi.endpoints.addMatchScore.matchFulfilled,
        (state, { payload }: { payload: ScoreUpdateResponse }) => {
          const index = state.matches.findIndex((match) => match._id === payload.data._id);
          if (index !== -1) {
            state.matches[index] = {
              ...state.matches[index],
              score: payload.data.score
            };
          }
        }
      );
  },
});

// Select the matches from the store
export const selectMatches = (state: RootState) => state.matches.matches;
export const selectMatchById = (state: RootState, matchId: string) => 
  state.matches.matches.find(match => match._id === matchId);

export default matchesSlice.reducer;