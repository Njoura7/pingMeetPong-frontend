import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7000/api/search',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: (searchTerm) => ({
        url: `?q=${searchTerm}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useSearchUsersQuery } = searchApi
