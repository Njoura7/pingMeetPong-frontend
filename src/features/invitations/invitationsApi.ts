// invitationsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Invitation {
  senderId: string;
  recipientId: string;
}

interface InvitationResponse {
  message: string;
  pendingRequests: string[]; // Array of userIds
  sentRequests: string[]; // Array of userIds
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
  }),
});

export const { useSendInvitationMutation, useGetInvitationsQuery } = invitationsApi;
