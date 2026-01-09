import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import watchlistReducer from './slices/watchlistSlice';
import continueWatchingReducer from './slices/continueWatchingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    watchlist: watchlistReducer,
    continueWatching: continueWatchingReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
