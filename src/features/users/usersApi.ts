import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/types'; // replace with the path to your User type

interface ServerResponse {
  message: string;
  data: User;
}
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
    getUserById: builder.query<ServerResponse, string>({
      query: (userId) => `/${userId}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = usersApi;