// invitationsSlice.ts
import { createSlice,PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { invitationsApi, HandleInvitation,HandleInvitationResponse } from './invitationsApi';

interface InvitationState {
  pendingRequests: string[];  // User IDs to whom invitations are pending
  sentRequests: string[];     // User IDs from whom invitations were sent
  friends: string[]; 

}

const initialState: InvitationState = {
  pendingRequests: [],
  sentRequests: [],
  friends: [], // Initialize the friends array
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    // Adding a reducer to handle adding a new invitation
    addPendingInvitation: (state, action: PayloadAction<string>) => {
      // Ensure the invitationId is not already in the array to prevent duplicates
      if (!state.pendingRequests.includes(action.payload)) {
        state.pendingRequests.unshift(action.payload); // Adds the new invitationId at the start of the array
      }
    },
    addFriend: (state, action: PayloadAction<string>) => {
      if (!state.friends.includes(action.payload)) {
        state.friends.push(action.payload);
      }
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(friendId => friendId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(invitationsApi.endpoints.getInvitations.matchFulfilled, (state, action) => {
        state.pendingRequests = action.payload.pendingRequests;
        state.sentRequests = action.payload.sentRequests;
      })
      .addMatcher(invitationsApi.endpoints.handleInvitation.matchFulfilled, (state, action: PayloadAction<HandleInvitationResponse, string, { arg: { originalArgs: HandleInvitation }; requestId: string; requestStatus: "fulfilled"; }, never>) => {
        // Access originalArgs from action.meta.arg for the original arguments
        const { senderId, action: invitationAction } = action.meta.arg.originalArgs;
  
        state.pendingRequests = state.pendingRequests.filter(id => id !== senderId);
  
        if (invitationAction === 'accept') {
          state.friends.push(senderId);
        }
      });
  },


});



export const { addPendingInvitation,addFriend, removeFriend  } = invitationsSlice.actions;

// Export selectors for accessing parts of the state
export const selectPendingRequests = (state: RootState) => state.invitations.pendingRequests;
export const selectSentRequests = (state: RootState) => state.invitations.sentRequests;
export const selectFriends = (state: RootState) => state.invitations.friends;

export default invitationsSlice.reducer;