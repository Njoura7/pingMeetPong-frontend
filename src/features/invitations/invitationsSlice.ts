import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { invitationsApi } from './invitationsApi'; 
import { User } from '@/types';

interface SendInvitationServerResponse {
  message: string;
  sender?: User;
}

interface GetInvitationsServerResponse {
  message: string;
  data?: User[];
}

const initialState = {
  invitations: [] as User[], 
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    addInvitation: (state, action: PayloadAction<User>) => {
       // Check if the invitations array already contains the new invitation
      // ? to be tested
       if (!state.invitations.some(invitation => invitation._id === action.payload._id)) {
      // If it doesn't, add the new invitation at the beginning of the array
      state.invitations.unshift(action.payload);
    }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(invitationsApi.endpoints.sendInvitation.matchFulfilled, (state, { payload }: { payload: SendInvitationServerResponse }) => {
      // if (payload.sender) {
      //   state.invitations.unshift(payload.sender);
      // }
    });
    builder.addMatcher(invitationsApi.endpoints.getInvitations.matchFulfilled, (state, { payload }: { payload: GetInvitationsServerResponse }) => {
      if (payload.data) {
        state.invitations = payload.data;
      }
    });
  },
});

export const { addInvitation } = invitationsSlice.actions;

export const selectInvitations = (state: RootState) => state.invitations.invitations;

export default invitationsSlice.reducer;