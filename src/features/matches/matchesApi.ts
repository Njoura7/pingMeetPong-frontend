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
      transformResponse: (response: ServerResponse) => ({
        ...response,
        data: response.data.map(match => ({
          ...match,
          // Ensure owner is included in players if not already present
          players: match.owner && !match.players.includes(match.owner) 
            ? [match.owner, ...match.players]
            : match.players
        }))
      })
    }),
    joinMatch: builder.mutation<JoinMatchServerResponse, { code: string }>({
      query: ({ code }) => ({
        url: '/join',
        method: 'POST',
        body: { code },
      }),
      transformResponse: (response: JoinMatchServerResponse) => ({
        ...response,
        data: {
          ...response.data,
          // Ensure owner is included in players if not already present
          players: response.data.owner && !response.data.players.includes(response.data.owner)
            ? [response.data.owner, ...response.data.players]
            : response.data.players
        }
      }),
      invalidatesTags: [{ type: 'Matches', id: 'LIST' }],
    }),
    addMatchScore: builder.mutation<ScoreUpdateResponse, { matchId: string; score: string }>({
      query: ({ matchId, score }) => ({
        url: '/score',
        method: 'POST',
        body: { matchId, score },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: ScoreUpdateResponse) => ({
        ...response,
        data: {
          ...response.data,
          // Ensure owner is included in players if not already present
          players: response.data.owner && !response.data.players.includes(response.data.owner)
            ? [response.data.owner, ...response.data.players]
            : response.data.players
        }
      }),
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
