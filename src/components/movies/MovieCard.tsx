'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlay, FiPlus, FiChevronDown, FiCheck } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import { getImageUrl, getTitle, getReleaseYear, getMediaType } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  index?: number;
  showRank?: boolean;
}

export default function MovieCard({ movie, index = 0, showRank = false }: MovieCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const mediaType = getMediaType(movie);
  const isInWatchlist = useAppSelector(state => selectIsInWatchlist(state, movie.id, mediaType));

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${mediaType}/${movie.id}`);
  };

  const handleCardClick = () => {
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${mediaType}/${movie.id}`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative flex-shrink-0 w-[130px] sm:w-[160px] md:w-[200px] lg:w-[240px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Rank Number */}
      {showRank && (
        <div className="absolute -left-2 sm:-left-4 bottom-0 z-10 text-[80px] sm:text-[100px] md:text-[120px] font-bold text-netflix-black [-webkit-text-stroke:2px_rgba(255,255,255,0.3)] leading-none">
          {index + 1}
        </div>
      )}

      {/* Card Image */}
      <div className={cn(
        'relative aspect-video rounded overflow-hidden transition-transform duration-300',
        isHovered && 'sm:scale-110 sm:z-30 sm:shadow-2xl'
      )}>
        <Image
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'backdrop', 'medium')}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 130px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 240px"
        />

        {/* Mobile Tap Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden flex items-end p-2">
          <p className="text-white text-xs font-medium line-clamp-1">{title}</p>
        </div>

        {/* Desktop Hover Content */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden sm:block absolute inset-0 bg-gradient-to-t from-netflix-dark-gray to-transparent"
          >
            {/* Expanded Card Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-netflix-dark-gray rounded-b">
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={handlePlay}
                  className="p-2 bg-white rounded-full hover:bg-white/80 transition-colors"
                  title="Play"
                >
                  <FiPlay size={16} fill="black" className="text-black" />
                </button>
                <button
                  onClick={handleWatchlist}
                  className="p-2 border border-white/50 rounded-full hover:border-white transition-colors"
                  title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
                >
                  {isInWatchlist ? (
                    <FiCheck size={16} className="text-white" />
                  ) : (
                    <FiPlus size={16} className="text-white" />
                  )}
                </button>
                <button
                  onClick={handleMoreInfo}
                  className="ml-auto p-2 border border-white/50 rounded-full hover:border-white transition-colors"
                  title="More Info"
                >
                  <FiChevronDown size={16} className="text-white" />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-white/80">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="px-1 border border-white/50 text-[10px]">
                  {movie.adult ? '18+' : 'PG-13'}
                </span>
                {year && <span>{year}</span>}
              </div>

              {/* Title */}
              <p className="text-white text-sm font-medium mt-1 line-clamp-1">{title}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Default Title (when not hovered) - Hidden on mobile since we show it in overlay */}
      {!isHovered && (
        <p className="hidden sm:block text-white/80 text-xs sm:text-sm mt-2 line-clamp-1 group-hover:text-white transition-colors">
          {title}
        </p>
      )}
    </motion.div>
  );
}
