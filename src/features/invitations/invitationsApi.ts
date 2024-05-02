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
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<InvitationResponse, Invitation>({
      query: (invitation) => ({
        url: '/',
        method: 'POST',
        body: invitation,
      }),
    }),
    getInvitations: builder.query<InvitationResponse, string>({
      query: (userId) => `/${userId}`,
    }),
  }),
  tagTypes: ['Invitations'],
});

export const { useSendInvitationMutation, useGetInvitationsQuery } = invitationsApi;
