'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlay, FiPlus, FiCheck, FiShare2, FiDownload } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import { getImageUrl, getTitle, getReleaseYear, getTrailer } from '@/lib/tmdb';
import { formatDuration } from '@/lib/utils';
import MovieRow from '@/components/movies/MovieRow';
import type { MovieDetails, Video } from '@/types';

interface MovieDetailClientProps {
  movie: MovieDetails;
  mediaType: 'movie' | 'tv';
}

export default function MovieDetailClient({ movie, mediaType }: MovieDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [trailer, setTrailer] = useState<Video | null>(null);
  
  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const isInWatchlist = useAppSelector(state => selectIsInWatchlist(state, movie.id, mediaType));

  const genres = movie.genres?.map(g => g.name).join(', ') || '';
  const runtime = movie.runtime 
    ? formatDuration(movie.runtime) 
    : movie.episode_run_time?.[0] 
    ? formatDuration(movie.episode_run_time[0]) 
    : null;

  useEffect(() => {
    const fetchTrailer = async () => {
      const trailerData = await getTrailer(mediaType, movie.id);
      setTrailer(trailerData);
    };
    fetchTrailer();
  }, [movie.id, mediaType]);

  const handlePlay = () => {
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
  const writers = movie.credits?.crew.filter(p => p.job === 'Writer' || p.job === 'Screenplay').slice(0, 3) || [];
  const cast = movie.credits?.cast.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[350px] sm:min-h-[400px] md:min-h-[500px]">
        <Image
          src={getImageUrl(movie.backdrop_path, 'backdrop', 'original')}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end sm:items-center px-4 md:px-8 lg:px-12 pb-8 sm:pb-0 pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full"
          >
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
              {title}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4 text-xs sm:text-sm">
              <span className="text-green-500 font-semibold text-sm sm:text-lg">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              {year && <span className="text-white">{year}</span>}
              <span className="px-1.5 sm:px-2 py-0.5 border border-white/50 text-white text-[10px] sm:text-xs">
                {movie.adult ? '18+' : 'PG-13'}
              </span>
              {runtime && <span className="text-white">{runtime}</span>}
              {mediaType === 'tv' && movie.number_of_seasons && (
                <span className="text-white">
                  {movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Tagline - Hidden on very small screens */}
            {movie.tagline && (
              <p className="hidden sm:block text-base md:text-lg text-netflix-light-gray italic mb-2 sm:mb-4">
                "{movie.tagline}"
              </p>
            )}

            {/* Overview */}
            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 max-w-2xl line-clamp-3 sm:line-clamp-none">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handlePlay}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-black font-bold text-sm sm:text-base rounded hover:bg-white/80 transition-colors"
              >
                <FiPlay size={18} className="sm:w-6 sm:h-6" fill="black" />
                <span>Play</span>
              </button>
              <button
                onClick={handleWatchlist}
                className="p-2 sm:p-3 border-2 border-white/50 rounded-full hover:border-white hover:bg-white/10 transition-colors"
                title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {isInWatchlist ? (
                  <FiCheck size={18} className="text-white sm:w-6 sm:h-6" />
                ) : (
                  <FiPlus size={18} className="text-white sm:w-6 sm:h-6" />
                )}
              </button>
              <button
                className="p-2 sm:p-3 border-2 border-white/50 rounded-full hover:border-white hover:bg-white/10 transition-colors"
                title="Share"
              >
                <FiShare2 size={18} className="text-white sm:w-6 sm:h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Download Links Section */}
            <div>
              <h3 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Download Links</h3>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4">
                <a
                  href={`/download/${mediaType}/${movie.id}/1`}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-base rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  <FiDownload size={18} />
                  <span>Link 1 - 720p</span>
                </a>
                <a
                  href={`/download/${mediaType}/${movie.id}/2`}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  <FiDownload size={18} />
                  <span>Link 2 - 1080p</span>
                </a>
                <a
                  href={`/download/${mediaType}/${movie.id}/3`}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm sm:text-base rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  <FiDownload size={18} />
                  <span>Link 3 - 4K</span>
                </a>
              </div>
              <p className="text-netflix-gray text-xs sm:text-sm mt-2 sm:mt-3">
                * Multiple download options available. Select your preferred quality.
              </p>
            </div>

            {/* Genres */}
            {genres && (
              <div>
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Genres</h3>
                <p className="text-netflix-light-gray text-sm sm:text-base">{genres}</p>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Top Cast</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                  {cast.map(person => (
                    <div key={person.id} className="text-center">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-1.5 sm:mb-2 rounded-full overflow-hidden bg-netflix-dark-gray">
                        <Image
                          src={getImageUrl(person.profile_path, 'profile', 'medium')}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-white text-xs sm:text-sm font-medium line-clamp-1">{person.name}</p>
                      <p className="text-netflix-gray text-[10px] sm:text-xs line-clamp-1">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-4 sm:space-y-6">
            {director && (
              <div>
                <h4 className="text-netflix-gray text-xs sm:text-sm">Director</h4>
                <p className="text-white text-sm sm:text-base">{director.name}</p>
              </div>
            )}
            {writers.length > 0 && (
              <div>
                <h4 className="text-netflix-gray text-xs sm:text-sm">Writers</h4>
                <p className="text-white text-sm sm:text-base">{writers.map(w => w.name).join(', ')}</p>
              </div>
            )}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <h4 className="text-netflix-gray text-xs sm:text-sm">Production</h4>
                <p className="text-white text-sm sm:text-base">
                  {movie.production_companies.slice(0, 3).map(c => c.name).join(', ')}
                </p>
              </div>
            )}
            {movie.status && (
              <div>
                <h4 className="text-netflix-gray text-xs sm:text-sm">Status</h4>
                <p className="text-white text-sm sm:text-base">{movie.status}</p>
              </div>
            )}
            {movie.vote_count && (
              <div>
                <h4 className="text-netflix-gray text-xs sm:text-sm">Vote Count</h4>
                <p className="text-white text-sm sm:text-base">{movie.vote_count.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar & Recommendations */}
      <div className="pb-8 sm:pb-12">
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <MovieRow
            title="More Like This"
            movies={movie.similar.results}
          />
        )}
        {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
          <MovieRow
            title="Recommended For You"
            movies={movie.recommendations.results}
          />
        )}
      </div>
    </div>
  );
}
