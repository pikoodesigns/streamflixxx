'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlay, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import { closeModal } from '@/store/slices/uiSlice';
import { getImageUrl, getTitle, getReleaseYear, getMediaType } from '@/lib/tmdb';
import { formatDuration, truncateText } from '@/lib/utils';
import { MOVIE_GENRES, TV_GENRES } from '@/lib/constants';
import type { MovieDetails } from '@/types';

interface MovieModalProps {
  movie: MovieDetails;
  mediaType: 'movie' | 'tv';
  onClose: () => void;
}

export default function MovieModal({ movie, mediaType, onClose }: MovieModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const isInWatchlist = useAppSelector(state => selectIsInWatchlist(state, movie.id, mediaType));

  const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A';
  const runtime = movie.runtime 
    ? formatDuration(movie.runtime) 
    : movie.episode_run_time?.[0] 
    ? formatDuration(movie.episode_run_time[0]) 
    : 'N/A';

  const handlePlay = () => {
    onClose();
    router.push(`/watch/${mediaType}/${movie.id}`);
  };

  const handleWatchlist = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist({ id: movie.id, mediaType }));
    } else {
      dispatch(addToWatchlist({
        id: movie.id,
        mediaType,
        title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        addedAt: new Date().toISOString(),
      }));
    }
  };

  const director = movie.credits?.crew.find(p => p.job === 'Director');
  const cast = movie.credits?.cast.slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-netflix-dark-gray rounded-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-netflix-dark-gray rounded-full hover:bg-white/20 transition-colors"
        >
          <FiX size={24} className="text-white" />
        </button>

        {/* Backdrop */}
        <div className="relative h-[40vh] min-h-[300px]">
          <Image
            src={getImageUrl(movie.backdrop_path, 'backdrop', 'large')}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-gray via-transparent to-transparent" />
          
          {/* Title & Actions */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black font-semibold rounded hover:bg-white/80 transition-colors"
              >
                <FiPlay size={20} fill="black" />
                <span>Play</span>
              </button>
              <button
                onClick={handleWatchlist}
                className="p-3 border-2 border-white/50 rounded-full hover:border-white transition-colors"
                title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {isInWatchlist ? (
                  <FiCheck size={20} className="text-white" />
                ) : (
                  <FiPlus size={20} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="md:col-span-2">
              {/* Metadata */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                {year && <span className="text-white/80">{year}</span>}
                <span className="px-2 border border-white/50 text-white/80 text-xs">
                  {movie.adult ? '18+' : 'PG-13'}
                </span>
                {runtime !== 'N/A' && (
                  <span className="text-white/80">{runtime}</span>
                )}
                {mediaType === 'tv' && movie.number_of_seasons && (
                  <span className="text-white/80">
                    {movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Overview */}
              <p className="text-white/90 text-base leading-relaxed mb-4">
                {movie.overview || 'No description available.'}
              </p>
            </div>

            {/* Side Info */}
            <div className="text-sm">
              {cast.length > 0 && (
                <p className="mb-2">
                  <span className="text-netflix-gray">Cast: </span>
                  <span className="text-white">
                    {cast.map(c => c.name).join(', ')}
                  </span>
                </p>
              )}
              {genres && (
                <p className="mb-2">
                  <span className="text-netflix-gray">Genres: </span>
                  <span className="text-white">{genres}</span>
                </p>
              )}
              {director && (
                <p className="mb-2">
                  <span className="text-netflix-gray">Director: </span>
                  <span className="text-white">{director.name}</span>
                </p>
              )}
              {movie.tagline && (
                <p className="mt-4 italic text-netflix-light-gray">
                  "{movie.tagline}"
                </p>
              )}
            </div>
          </div>

          {/* Similar Titles */}
          {movie.similar?.results && movie.similar.results.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">More Like This</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {movie.similar.results.slice(0, 8).map(similar => (
                  <div
                    key={similar.id}
                    onClick={() => {
                      onClose();
                      router.push(`/${mediaType}/${similar.id}`);
                    }}
                    className="relative aspect-video rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all"
                  >
                    <Image
                      src={getImageUrl(similar.backdrop_path || similar.poster_path, 'backdrop', 'small')}
                      alt={getTitle(similar)}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                      <span className="text-white text-xs line-clamp-2">
                        {getTitle(similar)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
