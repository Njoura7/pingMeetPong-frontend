import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';
import { SendInvitationRequest, SendInvitationResponse, HandleInvitationRequest, HandleInvitationResponse, GetInvitationsResponse } from './types';

export const invitationsApi = createApi({
  reducerPath: 'invitationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Invitations'],
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<SendInvitationResponse, SendInvitationRequest>({
      query: (body) => ({
        url: '/invitations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invitations'],
    }),
    handleInvitation: builder.mutation<HandleInvitationResponse, HandleInvitationRequest>({
      query: (body) => ({
        url: '/invitations/handle',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invitations'],
    }),
    getInvitations: builder.query<GetInvitationsResponse, string>({
      query: (userId) => `/invitations/${userId}`,
      providesTags: ['Invitations'],
    }),
  }),
});

export const { useSendInvitationMutation, useHandleInvitationMutation, useGetInvitationsQuery } = invitationsApi;
