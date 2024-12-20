import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { invitationsApi } from './invitationsApi';

interface InvitationsState {
  pendingRequests: string[];
  sentRequests: string[];
  friends: string[];
}

const initialState: InvitationsState = {
  pendingRequests: [],
  sentRequests: [],
  friends: [],
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    addPendingRequest: (state, action: PayloadAction<string>) => {
      if (!state.pendingRequests.includes(action.payload)) {
        state.pendingRequests.push(action.payload);
      }
    },
    // Other reducers...
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        invitationsApi.endpoints.sendInvitation.matchFulfilled,
        (state, { payload }) => {
          console.log('sendInvitation fulfilled:', payload);
          // Handle the response and update state if necessary
        }
      )
      .addMatcher(
        invitationsApi.endpoints.handleInvitation.matchFulfilled,
        (state, { payload }) => {
          console.log('handleInvitation fulfilled:', payload);
          // Handle the response and update state if necessary
        }
      )
      .addMatcher(
        invitationsApi.endpoints.getInvitations.matchFulfilled,
        (state, { payload }) => {
          console.log('getInvitations fulfilled:', payload);
          state.pendingRequests = payload.pendingRequests;
          state.sentRequests = payload.sentRequests;
          state.friends = payload.friends;
        }
      );
  },
});

export const { addPendingRequest } = invitationsSlice.actions;

export const selectPendingRequests = (state: RootState) => state.invitations.pendingRequests;
export const selectSentRequests = (state: RootState) => state.invitations.sentRequests;
export const selectFriends = (state: RootState) => state.invitations.friends;

export default invitationsSlice.reducer;
