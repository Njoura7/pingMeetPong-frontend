import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '@/types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/users`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (userId) => `/${userId}`,
      transformResponse: (response: { data: User; message: string }) =>
        response.data,
    }),
  }),
})

export const { useGetUserByIdQuery } = usersApi
