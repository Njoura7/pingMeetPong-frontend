import { configureStore } from "@reduxjs/toolkit";

// ? using auth/index.ts fro better practice and less code
import { authReducer, authApi } from "../features/auth";

import matchesReducer from "../features/matches/matchesSlice"; // Import matchesSlice
import { matchesApi } from "../features/matches/matchesApi"; // Import matchesApi

import usersReducer from '../features/users/usersSlice';  
import { usersApi } from '../features/users/usersApi';

import invitationsReducer from '../features/invitations/invitationsSlice';
import { invitationsApi } from '../features/invitations/invitationsApi';


import searchReducer from '../features/search/searchSlice';
import { searchApi } from '../features/search/searchApi';


export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [matchesApi.reducerPath]: matchesApi.reducer, // Add matchesApi reducer
    matches: matchesReducer, // Add matchesSlice to the reducer
    [usersApi.reducerPath]: usersApi.reducer, 
    users: usersReducer,

    [invitationsApi.reducerPath]: invitationsApi.reducer, 
    invitations: invitationsReducer,

    [searchApi.reducerPath]: searchApi.reducer,
    search: searchReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(authApi.middleware, matchesApi.middleware, usersApi.middleware,invitationsApi.middleware,searchApi.middleware), // Add  middlewares after creating the apis and slices
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;