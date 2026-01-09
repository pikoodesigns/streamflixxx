import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMuted: boolean;
  isSearchOpen: boolean;
  isModalOpen: boolean;
  modalContent: {
    id: number;
    mediaType: 'movie' | 'tv';
  } | null;
  isNavScrolled: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  isMuted: true,
  isSearchOpen: false,
  isModalOpen: false,
  modalContent: null,
  isNavScrolled: false,
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    
    openModal: (state, action: PayloadAction<{ id: number; mediaType: 'movie' | 'tv' }>) => {
      state.isModalOpen = true;
      state.modalContent = action.payload;
    },
    
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContent = null;
    },
    
    setNavScrolled: (state, action: PayloadAction<boolean>) => {
      state.isNavScrolled = action.payload;
    },
    
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleMute,
  setMuted,
  toggleSearch,
  setSearchOpen,
  openModal,
  closeModal,
  setNavScrolled,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
