import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ServerResponse {
  message: string;
  data: null;
}

export const invitationsApi = createApi({
  reducerPath: 'invitationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7000/api/invitations', // Update the base URL to your invitations API endpoint
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<ServerResponse, { senderId: string, recipientId: string }>({
      query: ({ senderId, recipientId }) => ({
        url: '/',
        method: 'POST',
        body: { senderId, recipientId },
      }),
      transformResponse: (response: ServerResponse) => response,
      invalidatesTags: [{ type: 'Invitations', id: 'LIST' }],
    }),
    // Add more endpoints here as needed
  }),
  tagTypes: ['Invitations']
});

export const { useSendInvitationMutation } = invitationsApi;