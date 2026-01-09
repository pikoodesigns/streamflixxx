import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, UserProfile } from '@/types';
import { STORAGE_KEYS, AVATAR_COLORS } from '@/lib/constants';
import { getFromStorage, setToStorage, generateId, getRandomItem } from '@/lib/utils';

interface UserState {
  user: User | null;
  activeProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initialize with data from localStorage
const getInitialState = (): UserState => {
  const user = getFromStorage<User | null>(STORAGE_KEYS.USER, null);
  const activeProfileId = getFromStorage<string | null>(STORAGE_KEYS.ACTIVE_PROFILE, null);
  const activeProfile = user?.profiles.find(p => p.id === activeProfileId) || null;
  
  return {
    user,
    activeProfile,
    isAuthenticated: !!user,
    isLoading: false,
  };
};

const initialState: UserState = {
  user: null,
  activeProfile: null,
  isAuthenticated: false,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initializeUser: (state) => {
      const savedUser = getFromStorage<User | null>(STORAGE_KEYS.USER, null);
      const activeProfileId = getFromStorage<string | null>(STORAGE_KEYS.ACTIVE_PROFILE, null);
      
      if (savedUser) {
        state.user = savedUser;
        state.isAuthenticated = true;
        state.activeProfile = savedUser.profiles.find(p => p.id === activeProfileId) || null;
      }
    },
    
    signUp: (state, action: PayloadAction<{ email: string; name: string; password: string }>) => {
      const { email, name } = action.payload;
      const defaultProfile: UserProfile = {
        id: generateId(),
        name: name,
        avatar: getRandomItem(AVATAR_COLORS),
        isKids: false,
        maturityLevel: 'r',
      };
      
      const newUser: User = {
        id: generateId(),
        email,
        name,
        profiles: [defaultProfile],
        activeProfileId: defaultProfile.id,
        createdAt: new Date().toISOString(),
      };
      
      state.user = newUser;
      state.activeProfile = defaultProfile;
      state.isAuthenticated = true;
      
      setToStorage(STORAGE_KEYS.USER, newUser);
      setToStorage(STORAGE_KEYS.ACTIVE_PROFILE, defaultProfile.id);
    },
    
    signIn: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // For frontend-only auth, just check if user exists in localStorage
      const savedUser = getFromStorage<User | null>(STORAGE_KEYS.USER, null);
      
      if (savedUser && savedUser.email === action.payload.email) {
        state.user = savedUser;
        state.isAuthenticated = true;
        const activeProfileId = getFromStorage<string | null>(STORAGE_KEYS.ACTIVE_PROFILE, null);
        state.activeProfile = savedUser.profiles.find(p => p.id === activeProfileId) || savedUser.profiles[0] || null;
      }
    },
    
    signOut: (state) => {
      state.user = null;
      state.activeProfile = null;
      state.isAuthenticated = false;
      
      // Keep user data but clear active profile
      setToStorage(STORAGE_KEYS.ACTIVE_PROFILE, null);
    },
    
    setActiveProfile: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const profile = state.user.profiles.find(p => p.id === action.payload);
        if (profile) {
          state.activeProfile = profile;
          state.user.activeProfileId = profile.id;
          setToStorage(STORAGE_KEYS.USER, state.user);
          setToStorage(STORAGE_KEYS.ACTIVE_PROFILE, profile.id);
        }
      }
    },
    
    addProfile: (state, action: PayloadAction<Omit<UserProfile, 'id'>>) => {
      if (state.user && state.user.profiles.length < 5) {
        const newProfile: UserProfile = {
          ...action.payload,
          id: generateId(),
        };
        state.user.profiles.push(newProfile);
        setToStorage(STORAGE_KEYS.USER, state.user);
      }
    },
    
    updateProfile: (state, action: PayloadAction<UserProfile>) => {
      if (state.user) {
        const index = state.user.profiles.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.user.profiles[index] = action.payload;
          if (state.activeProfile?.id === action.payload.id) {
            state.activeProfile = action.payload;
          }
          setToStorage(STORAGE_KEYS.USER, state.user);
        }
      }
    },
    
    deleteProfile: (state, action: PayloadAction<string>) => {
      if (state.user && state.user.profiles.length > 1) {
        state.user.profiles = state.user.profiles.filter(p => p.id !== action.payload);
        
        if (state.activeProfile?.id === action.payload) {
          state.activeProfile = state.user.profiles[0];
          state.user.activeProfileId = state.user.profiles[0].id;
          setToStorage(STORAGE_KEYS.ACTIVE_PROFILE, state.user.profiles[0].id);
        }
        
        setToStorage(STORAGE_KEYS.USER, state.user);
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  initializeUser,
  signUp,
  signIn,
  signOut,
  setActiveProfile,
  addProfile,
  updateProfile,
  deleteProfile,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;
