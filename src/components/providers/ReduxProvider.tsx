'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { initializeUser } from '@/store/slices/userSlice';
import { initializeWatchlist } from '@/store/slices/watchlistSlice';
import { initializeContinueWatching } from '@/store/slices/continueWatchingSlice';

function StoreInitializer() {
  useEffect(() => {
    store.dispatch(initializeUser());
    store.dispatch(initializeWatchlist());
    store.dispatch(initializeContinueWatching());
  }, []);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer />
      {children}
    </Provider>
  );
}
