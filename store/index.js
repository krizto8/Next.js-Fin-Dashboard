import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import themeReducer from './slices/themeSlice';
import apiConfigReducer from './slices/apiConfigSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    theme: themeReducer,
    apiConfig: apiConfigReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
