
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {User} from '../../types';

interface Invitation {
  senderId: string;
  recipientId: string;
}
interface InvitationResponse {
  message: string;
  pendingRequests: string[]; // Array of userIds
  sentRequests: string[]; // Array of userIds
}
export interface HandleInvitation {
  userId: string;
  senderId: string;
  action: 'accept' | 'reject';
}

export interface HandleInvitationResponse {
  message: string;
  data: User; 
}

export const invitationsApi = createApi({
  reducerPath: 'invitationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7000/api/invitations',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Invitations'],
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<InvitationResponse, Invitation>({
      query: (invitation) => ({
        url: '/',
        method: 'POST',
        body: invitation,
      }),
      invalidatesTags: ['Invitations'], // Invalidate Invitations cache after sending an invitation
    }),

    getInvitations: builder.query<InvitationResponse, string>({
      query: (userId) => `/${userId}`,
      providesTags: ['Invitations'], // This endpoint provides data tagged as 'Invitations'
    }),

    handleInvitation: builder.mutation<HandleInvitationResponse, HandleInvitation>({
      query: ({ userId, senderId, action }) => ({
        url: `/handle`, 
        method: 'POST',
        body: { userId, senderId, action },
      }),
      invalidatesTags: ['Invitations'], // Invalidate Invitations cache after handling an invitation
    }),

  }),
});

export const { useSendInvitationMutation, useGetInvitationsQuery, useHandleInvitationMutation } = invitationsApi;