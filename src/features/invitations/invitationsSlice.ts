// invitationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { invitationsApi } from './invitationsApi';

interface InvitationState {
  pendingRequests: string[];  // User IDs to whom invitations are pending
  sentRequests: string[];     // User IDs from whom invitations were sent
}

const initialState: InvitationState = {
  pendingRequests: [],
  sentRequests: [],
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    // Adding a new reducer to handle adding a new invitation
    addPendingInvitation: (state, action: PayloadAction<string>) => {
      state.pendingRequests.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(invitationsApi.endpoints.getInvitations.matchFulfilled, (state, { payload }) => {
      state.pendingRequests = payload.pendingRequests;
      state.sentRequests = payload.sentRequests;
    });
  },
});

export const { addPendingInvitation } = invitationsSlice.actions;

// Selectors to access the state of invitations
export const selectPendingRequests = (state: RootState) => state.invitations.pendingRequests;
export const selectSentRequests = (state: RootState) => state.invitations.sentRequests;

export default invitationsSlice.reducer;