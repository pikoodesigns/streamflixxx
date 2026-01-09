'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiSearch, FiPlay, FiPlus, FiCheck } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import { getImageUrl, getTitle, getReleaseYear, getMediaType } from '@/lib/tmdb';
import { debounce } from '@/lib/utils';
import type { Movie } from '@/types';

interface SearchClientProps {
  query: string;
  results: Movie[];
  error?: string;
}

export default function SearchClient({ query: initialQuery, results, error }: SearchClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = debounce((value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push('/search');
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-12 px-4 md:px-8 lg:px-12">
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <FiSearch size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-netflix-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for movies, TV shows..."
            className="w-full pl-14 pr-4 py-4 bg-netflix-dark-gray border border-netflix-gray/30 rounded-lg text-white text-lg placeholder:text-netflix-gray focus:outline-none focus:border-white transition-colors"
            autoFocus
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center text-netflix-light-gray">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && initialQuery && results.length === 0 && (
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">No results found</h2>
          <p className="text-netflix-light-gray">
            We couldn't find anything matching "{initialQuery}". Try a different search.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!initialQuery && (
        <div className="text-center text-netflix-light-gray">
          <p>Start typing to search for movies and TV shows</p>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 && (
        <div>
          <h2 className="text-xl text-white font-semibold mb-6">
            Results for "{initialQuery}"
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item, index) => (
              <SearchResultCard key={`${item.id}-${item.media_type}`} item={item} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ item, index }: { item: Movie; index: number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const title = getTitle(item);
  const year = getReleaseYear(item);
  const mediaType = getMediaType(item);
  const isInWatchlist = useAppSelector(state => selectIsInWatchlist(state, item.id, mediaType));

  const handleClick = () => {
    router.push(`/${mediaType}/${item.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${mediaType}/${item.id}`);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      dispatch(removeFromWatchlist({ id: item.id, mediaType }));
    } else {
      dispatch(addToWatchlist({
        id: item.id,
        mediaType,
        title,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        addedAt: new Date().toISOString(),
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-poster rounded overflow-hidden bg-netflix-dark-gray">
        <Image
          src={getImageUrl(item.poster_path, 'poster', 'medium')}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={handlePlay}
            className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
          >
            <FiPlay size={20} fill="black" className="text-black" />
          </button>
          <button
            onClick={handleWatchlist}
            className="p-2 border border-white rounded-full hover:bg-white/20 transition-colors"
          >
            {isInWatchlist ? (
              <FiCheck size={20} className="text-white" />
            ) : (
              <FiPlus size={20} className="text-white" />
            )}
          </button>
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-netflix-red text-white text-xs font-medium rounded">
          {mediaType === 'movie' ? 'Movie' : 'TV'}
        </div>
      </div>

      {/* Info */}
      <div className="mt-2">
        <p className="text-white text-sm font-medium line-clamp-1">{title}</p>
        <div className="flex items-center gap-2 text-xs text-netflix-light-gray">
          {year && <span>{year}</span>}
          <span className="text-green-500">
            {Math.round(item.vote_average * 10)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
