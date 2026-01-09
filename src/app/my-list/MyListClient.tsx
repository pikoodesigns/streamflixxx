'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiPlay, FiX, FiTrash2 } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromWatchlist, clearWatchlist } from '@/store/slices/watchlistSlice';
import { getImageUrl } from '@/lib/tmdb';
import AdBanner from '@/components/ads/AdBanner';

export default function MyListClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.watchlist);
  const { isAuthenticated } = useAppSelector(state => state.user);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-netflix-black pt-24 pb-12 px-4 md:px-8 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Sign in to see your list</h1>
          <p className="text-netflix-light-gray mb-6">
            Save movies and TV shows to your list so you can watch them later.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-netflix-red text-white rounded hover:bg-netflix-red-hover transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-12 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">My List</h1>
        {items.length > 0 && (
          <button
            onClick={() => dispatch(clearWatchlist())}
            className="flex items-center gap-2 px-4 py-2 text-netflix-light-gray hover:text-white transition-colors"
          >
            <FiTrash2 size={18} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-xl text-white mb-4">Your list is empty</h2>
          <p className="text-netflix-light-gray mb-6">
            Add movies and TV shows to your list to watch them later.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-white text-black font-medium rounded hover:bg-white/80 transition-colors"
          >
            Browse Content
          </button>
        </div>
      )}

      {/* List Grid */}
      {items.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.mediaType}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative"
              >
                <div
                  onClick={() => router.push(`/${item.mediaType}/${item.id}`)}
                  className="relative aspect-poster rounded overflow-hidden bg-netflix-dark-gray cursor-pointer"
                >
                  <Image
                    src={getImageUrl(item.posterPath, 'poster', 'medium')}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/watch/${item.mediaType}/${item.id}`);
                      }}
                      className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                    >
                      <FiPlay size={24} fill="black" className="text-black" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromWatchlist({ id: item.id, mediaType: item.mediaType }));
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                  >
                    <FiX size={16} className="text-white" />
                  </button>

                  {/* Media Type Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-netflix-red text-white text-xs font-medium rounded">
                    {item.mediaType === 'movie' ? 'Movie' : 'TV'}
                  </div>
                </div>

                {/* Title */}
                <p className="mt-2 text-white text-sm font-medium line-clamp-1">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* Ad after list */}
          <AdBanner type="banner300x250" className="mt-8" />
        </>
      )}
    </div>
  );
}
