import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ContinueWatchingItem } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { getFromStorage, setToStorage } from '@/lib/utils';

interface ContinueWatchingState {
  items: ContinueWatchingItem[];
}

const initialState: ContinueWatchingState = {
  items: [],
};

const continueWatchingSlice = createSlice({
  name: 'continueWatching',
  initialState,
  reducers: {
    initializeContinueWatching: (state) => {
      state.items = getFromStorage<ContinueWatchingItem[]>(STORAGE_KEYS.CONTINUE_WATCHING, []);
    },
    
    updateProgress: (state, action: PayloadAction<ContinueWatchingItem>) => {
      const index = state.items.findIndex(
        item => item.id === action.payload.id && item.mediaType === action.payload.mediaType
      );
      
      const updatedItem = {
        ...action.payload,
        lastWatched: new Date().toISOString(),
      };
      
      if (index !== -1) {
        // Move to front and update
        state.items.splice(index, 1);
      }
      
      // Add to front of list
      state.items.unshift(updatedItem);
      
      // Keep only last 20 items
      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20);
      }
      
      setToStorage(STORAGE_KEYS.CONTINUE_WATCHING, state.items);
    },
    
    removeFromContinueWatching: (state, action: PayloadAction<{ id: number; mediaType: 'movie' | 'tv' }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.mediaType === action.payload.mediaType)
      );
      setToStorage(STORAGE_KEYS.CONTINUE_WATCHING, state.items);
    },
    
    clearContinueWatching: (state) => {
      state.items = [];
      setToStorage(STORAGE_KEYS.CONTINUE_WATCHING, []);
    },
  },
});

export const {
  initializeContinueWatching,
  updateProgress,
  removeFromContinueWatching,
  clearContinueWatching,
} = continueWatchingSlice.actions;

export default continueWatchingSlice.reducer;

// Selector helper
export const selectContinueWatchingItem = (
  state: { continueWatching: ContinueWatchingState },
  id: number,
  mediaType: 'movie' | 'tv'
) => state.continueWatching.items.find(item => item.id === id && item.mediaType === mediaType);
