import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Match {
  name: string;
  code: string;
  place: string;
  date: Date;
}

interface ServerResponse {
  message: string;
  data: Match[];
}

export const matchesApi = createApi({
  reducerPath: 'matchesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createMatch: builder.mutation<ServerResponse, Match>({
      query: (match) => ({
        url: '/matches',
        method: 'POST',
        body: match,
      }),
      transformResponse: (response: ServerResponse) => response,
    }),
    findMatchesByPlayer: builder.query<ServerResponse, string>({
      query: (playerId) => `/matches/player/${playerId}`,
    }),
  }),
});

export const { useCreateMatchMutation, useFindMatchesByPlayerQuery } = matchesApi;