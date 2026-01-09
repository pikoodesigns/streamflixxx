'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/userSlice';
import { clearWatchlist } from '@/store/slices/watchlistSlice';
import { clearContinueWatching } from '@/store/slices/continueWatchingSlice';
import { getInitials, formatDate } from '@/lib/utils';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiTrash2 } from 'react-icons/fi';

export default function AccountClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, activeProfile, isAuthenticated } = useAppSelector(state => state.user);
  const { items: watchlistItems } = useAppSelector(state => state.watchlist);
  const { items: continueWatchingItems } = useAppSelector(state => state.continueWatching);

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const handleSignOut = () => {
    dispatch(signOut());
    router.push('/');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      dispatch(clearWatchlist());
      dispatch(clearContinueWatching());
      localStorage.clear();
      dispatch(signOut());
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Account</h1>

        {/* Profile Section */}
        <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiUser />
            <span>Profile</span>
          </h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: activeProfile?.avatar || '#E50914' }}
            >
              {activeProfile?.name ? getInitials(activeProfile.name) : 'U'}
            </div>
            <div>
              <p className="text-white text-lg font-medium">{user.name}</p>
              <p className="text-netflix-light-gray">{activeProfile?.name} ({activeProfile?.isKids ? 'Kids' : 'Adult'})</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/profiles')}
            className="text-netflix-red hover:underline"
          >
            Manage Profiles
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-netflix-light-gray">
              <FiMail size={20} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-netflix-light-gray">
              <FiCalendar size={20} />
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Activity</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-netflix-red">{user.profiles.length}</p>
              <p className="text-netflix-light-gray text-sm">Profiles</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-netflix-red">{watchlistItems.length}</p>
              <p className="text-netflix-light-gray text-sm">In My List</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-netflix-red">{continueWatchingItems.length}</p>
              <p className="text-netflix-light-gray text-sm">Continue Watching</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-netflix-dark-gray rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-white hover:text-netflix-red transition-colors"
            >
              <FiLogOut size={20} />
              <span>Sign Out</span>
            </button>
            
            <button
              onClick={handleClearData}
              className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors"
            >
              <FiTrash2 size={20} />
              <span>Clear All Data & Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
