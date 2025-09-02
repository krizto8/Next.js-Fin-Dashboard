import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import apiReducer from './slices/apiSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    api: apiReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
