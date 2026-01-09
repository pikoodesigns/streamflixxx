import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistItem } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { getFromStorage, setToStorage } from '@/lib/utils';

interface WatchlistState {
  items: WatchlistItem[];
}

const initialState: WatchlistState = {
  items: [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    initializeWatchlist: (state) => {
      state.items = getFromStorage<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST, []);
    },
    
    addToWatchlist: (state, action: PayloadAction<WatchlistItem>) => {
      const exists = state.items.some(
        item => item.id === action.payload.id && item.mediaType === action.payload.mediaType
      );
      
      if (!exists) {
        state.items.unshift({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
        setToStorage(STORAGE_KEYS.WATCHLIST, state.items);
      }
    },
    
    removeFromWatchlist: (state, action: PayloadAction<{ id: number; mediaType: 'movie' | 'tv' }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.mediaType === action.payload.mediaType)
      );
      setToStorage(STORAGE_KEYS.WATCHLIST, state.items);
    },
    
    clearWatchlist: (state) => {
      state.items = [];
      setToStorage(STORAGE_KEYS.WATCHLIST, []);
    },
  },
});

export const {
  initializeWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;

// Selector helpers
export const selectIsInWatchlist = (state: { watchlist: WatchlistState }, id: number, mediaType: 'movie' | 'tv') =>
  state.watchlist.items.some(item => item.id === id && item.mediaType === mediaType);
