import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ServerResponse {
  message: string
  //! to be considered
  data: any
}

interface Credentials {
  username: string
  password: string
  avatar?: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<ServerResponse, Credentials>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ServerResponse) => response,
    }),
    loginUser: builder.mutation<ServerResponse, Credentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ServerResponse) => response,
    }),
  }),
})

export const { useRegisterUserMutation, useLoginUserMutation } = authApi
