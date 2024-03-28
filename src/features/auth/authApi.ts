import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Credentials {
  // Define the properties of your credentials here
//   For example:
  username: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<{ user: string; accessToken: string }, Credentials>({
        query: (credentials) => ({
          url: 'users/register',
          method: 'POST',
          body: credentials,
        }),
      }),
      loginUser: builder.mutation<{ user: string; accessToken: string }, Credentials>({
        query: (credentials) => ({
          url: 'users/login',
          method: 'POST',
          body: credentials,
        }),
      }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;