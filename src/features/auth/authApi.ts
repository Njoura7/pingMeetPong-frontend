import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Registration response type
interface RegisterResponse {
  message: string;
}

// Login response type
interface LoginResponse {
  message: string;
  data: {
    user: string;
    accessToken: string;
    username: string;
    avatar: string;
    friends: string[];
    sentRequests: string[];
    pendingRequests: string[];
  }
}

interface Credentials {
  username: string;
  password: string;
  avatar?: string;
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
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterResponse, Credentials>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    loginUser: builder.mutation<LoginResponse, Credentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useRegisterUserMutation, useLoginUserMutation } = authApi
