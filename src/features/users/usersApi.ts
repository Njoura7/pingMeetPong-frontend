
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7000/api/users',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (userId) => `/${userId}`,
      transformResponse: (response: { message: string; data: User }) => response.data,
    }),
  }),
});

export const { useGetUserByIdQuery } = usersApi;