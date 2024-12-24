import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { Match } from '@/types'

interface ServerResponse {
  message: string
  data: Match[]
}
interface JoinMatchServerResponse {
  message: string
  data: Match // Single Match object
}
interface ScoreUpdateResponse {
  message: string
  data: Match
}

export const matchesApi = createApi({
  reducerPath: 'matchesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/matches`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    createMatch: builder.mutation<ServerResponse, Match>({
      query: (match) => ({
        url: '/',
        method: 'POST',
        body: match,
      }),
      transformResponse: (response: ServerResponse) => response,
      invalidatesTags: [{ type: 'Matches', id: 'LIST' }],
    }),
    findMatchesByPlayer: builder.query<ServerResponse, string>({
      query: (playerId) => `/player/${playerId}`,
      providesTags: [{ type: 'Matches', id: 'LIST' }],
    }),

    joinMatch: builder.mutation<JoinMatchServerResponse, { code: string }>(
      {
        query: ({ code }) => ({
          url: '/join',
          method: 'POST',
          body: { code },
        }),
        invalidatesTags: [{ type: 'Matches', id: 'LIST' }],
      }
    ),
    addMatchScore: builder.mutation<ScoreUpdateResponse, { matchId: string; score: string }>({
      query: ({ matchId, score }) => ({
        url: '/score',
        method: 'POST',
        body: { matchId, score },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: ScoreUpdateResponse) => response,
      invalidatesTags: [{ type: 'Matches', id: 'LIST' }],
    }),
  }),
  tagTypes: ['Matches'],
})

export const {
  useCreateMatchMutation,
  useFindMatchesByPlayerQuery,
  useJoinMatchMutation,
  useAddMatchScoreMutation,
} = matchesApi
