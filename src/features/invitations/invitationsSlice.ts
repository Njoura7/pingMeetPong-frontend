import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { invitationsApi } from './invitationsApi'; 

interface SendInvitationServerResponse {
  message: string;  
  data: string[] | null; // Update this to match the shape of your data
}

const initialState = {
  invitations: [] as string[], // Update this to match the shape of your invitations
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(invitationsApi.endpoints.sendInvitation.matchFulfilled, (state, { payload }: { payload: SendInvitationServerResponse }) => {
      // Update the state with the updated pending requests
      if (payload.data) {
        state.invitations = payload.data;
      }
    });
    // Add more matchers here as needed
  },
});

// Select the invitations from the store
export const selectInvitations = (state: RootState) => state.invitations.invitations;

export default invitationsSlice.reducer; // Export invitationsSlice reducer