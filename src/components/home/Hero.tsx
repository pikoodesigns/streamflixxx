'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlay, FiInfo, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleMute } from '@/store/slices/uiSlice';
import { getImageUrl, getTitle, getReleaseYear, getTrailer } from '@/lib/tmdb';
import { truncateText } from '@/lib/utils';
import { MOVIE_GENRES, TV_GENRES } from '@/lib/constants';
import type { Movie, Video } from '@/types';

interface HeroProps {
  movie: Movie;
  mediaType?: 'movie' | 'tv';
}

export default function Hero({ movie, mediaType = 'movie' }: HeroProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isMuted } = useAppSelector(state => state.ui);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const genres = movie.genre_ids
    .slice(0, 3)
    .map(id => (mediaType === 'movie' ? MOVIE_GENRES[id] : TV_GENRES[id]))
    .filter(Boolean)
    .join(' • ');

  useEffect(() => {
    const fetchTrailer = async () => {
      const trailerData = await getTrailer(mediaType, movie.id);
      setTrailer(trailerData);
      
      // Show video after a delay
      const timer = setTimeout(() => {
        if (trailerData) setShowVideo(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    };

    fetchTrailer();
  }, [movie.id, mediaType]);

  const handlePlay = () => {
    router.push(`/watch/${mediaType}/${movie.id}`);
  };

  const handleMoreInfo = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  return (
    <div className="relative w-full h-[85vw] xs:h-[75vw] sm:h-[56.25vw] max-h-[85vh] min-h-[380px] xs:min-h-[350px] sm:min-h-[400px] md:min-h-[450px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(movie.backdrop_path, 'backdrop', 'original')}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top sm:object-center"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/70 sm:via-netflix-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/20 sm:via-transparent to-transparent" />
      </div>

      {/* Video Background */}
      {showVideo && trailer && (
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailer.key}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media"
            className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none"
            style={{ border: 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-12 xs:pb-10 sm:pb-0 sm:items-center px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-[90%] xs:max-w-xl lg:max-w-2xl w-full"
        >
          {/* Title */}
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg line-clamp-2">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3 text-xs sm:text-sm text-white/90 mb-2 sm:mb-4">
            <span className="text-green-500 font-semibold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            {year && <span>{year}</span>}
            {genres && <span className="hidden xs:inline">{genres}</span>}
          </div>

          {/* Overview */}
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-white/90 mb-3 xs:mb-4 sm:mb-6 line-clamp-2 xs:line-clamp-3 sm:line-clamp-3 md:line-clamp-4 drop-shadow">
            {truncateText(movie.overview || 'No description available.', 250)}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePlay}
              className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-6 md:px-8 py-1.5 xs:py-2 sm:py-3 bg-white text-black font-semibold text-xs xs:text-sm sm:text-base rounded hover:bg-white/80 transition-colors active:scale-95"
            >
              <FiPlay size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="black" />
              <span>Play</span>
            </button>
            <button
              onClick={handleMoreInfo}
              className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-6 md:px-8 py-1.5 xs:py-2 sm:py-3 bg-white/30 text-white font-semibold text-xs xs:text-sm sm:text-base rounded hover:bg-white/20 transition-colors backdrop-blur-sm active:scale-95"
            >
              <FiInfo size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span>More Info</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mute Button */}
      {showVideo && trailer && (
        <button
          onClick={() => dispatch(toggleMute())}
          className="hidden sm:flex absolute right-4 md:right-12 bottom-1/3 z-20 p-2 rounded-full border border-white/50 text-white hover:bg-white/10 transition-colors"
        >
          {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>
      )}

      {/* Age Rating Badge */}
      <div className="absolute right-4 md:right-12 bottom-4 xs:bottom-6 sm:bottom-1/3 sm:mt-16 z-20 flex items-center gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-black/60 border-l-2 border-white">
        <span className="text-white text-xs sm:text-sm">
          {movie.adult ? '18+' : 'PG-13'}
        </span>
      </div>
    </div>
  );
}
