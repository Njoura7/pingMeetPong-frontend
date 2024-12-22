import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { invitationsApi } from './invitationsApi'

interface InvitationsState {
  pendingRequests: string[]
  sentRequests: string[]
  friends: string[]
}

const initialState: InvitationsState = {
  pendingRequests: [],
  sentRequests: [],
  friends: [],
}

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    addPendingRequest: (state, action: PayloadAction<string>) => {
      if (!state.pendingRequests.includes(action.payload)) {
        state.pendingRequests = [...state.pendingRequests, action.payload];
      }
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(id => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        invitationsApi.endpoints.handleInvitation.matchFulfilled,
        (state, { payload }) => {
          // Remove the handled invitation from pending requests
          if (payload.invitationId) {
            state.pendingRequests = state.pendingRequests.filter(
              id => id !== payload.invitationId
            );
          }
          // If accepted, add to friends list
          if (payload.status === 'accepted' && payload.friendId) {
            state.friends = [...state.friends, payload.friendId];
          }
        }
      )
      .addMatcher(
        invitationsApi.endpoints.getInvitations.matchFulfilled,
        (state, { payload }) => {
          state.pendingRequests = payload.pendingRequests;
          state.sentRequests = payload.sentRequests;
          state.friends = payload.friends;
        }
      );
  },
})

export const { addPendingRequest, removePendingRequest } = invitationsSlice.actions

export const selectPendingRequests = (state: RootState) =>
  state.invitations.pendingRequests
export const selectSentRequests = (state: RootState) =>
  state.invitations.sentRequests
export const selectFriends = (state: RootState) =>
  state.invitations.friends

export default invitationsSlice.reducer
