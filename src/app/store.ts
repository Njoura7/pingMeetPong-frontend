import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import matchesReducer from "../features/matches/matchesSlice"; // Import matchesSlice
import { matchesApi } from "../features/matches/matchesApi"; // Import matchesApi

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    matches: matchesReducer, // Add matchesSlice to the reducer
    [matchesApi.reducerPath]: matchesApi.reducer, // Add matchesApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(authApi.middleware, matchesApi.middleware), // Add matchesApi middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;