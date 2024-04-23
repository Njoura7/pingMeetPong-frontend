import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { invitationsApi } from './invitationsApi';
import type { RootState } from '../../app/store';
import { User } from '@/types';

interface InvitationsState {
  invitations: User[];
  invitationStatus: Record<string, 'sent' | 'received' | 'accepted'>;
}

const initialState: InvitationsState = {
  invitations: [],
  invitationStatus: {},
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    addInvitation: (state, action: PayloadAction<User>) => {
      const exists = state.invitations.some(inv => inv._id === action.payload._id);
      if (!exists) {
        state.invitations.push(action.payload);
      }
    },
    updateInvitationStatus: (state, action: PayloadAction<{ userId: string; status: 'sent' | 'received' | 'accepted' }>) => {
      state.invitationStatus[action.payload.userId] = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(invitationsApi.endpoints.sendInvitation.matchFulfilled, (state, { payload }) => {
      if (payload.sender && payload.sender._id) {
        state.invitationStatus[payload.sender._id] = 'sent';
      }
    });
    builder.addMatcher(invitationsApi.endpoints.getInvitations.matchFulfilled, (state, { payload }) => {
      if (payload) {
        state.invitations = payload;
        payload.forEach(invitation => {
          state.invitationStatus[invitation._id] = 'received';
        });
      }
    });
  },
});

export const { addInvitation, updateInvitationStatus } = invitationsSlice.actions;
export const selectInvitations = (state: RootState) => state.invitations.invitations;
export const selectInvitationStatus = (state: RootState, userId: string) => state.invitations.invitationStatus[userId] || 'none';

export default invitationsSlice.reducer;
