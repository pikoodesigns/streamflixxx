'use client';

import { useAppSelector } from '@/store/hooks';
import Hero from '@/components/home/Hero';
import MovieRow from '@/components/movies/MovieRow';
import type { Movie } from '@/types';

interface Section {
  id: string;
  title: string;
  movies: Movie[];
  showRank?: boolean;
}

interface HomeClientProps {
  sections: Section[];
  featuredMovie: Movie;
}

export default function HomeClient({ sections, featuredMovie }: HomeClientProps) {
  const { isAuthenticated } = useAppSelector(state => state.user);
  const { items: continueWatchingItems } = useAppSelector(state => state.continueWatching);

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero */}
      <Hero movie={featuredMovie} mediaType={featuredMovie.title ? 'movie' : 'tv'} />

      {/* Content Rows */}
      <div className="mt-4 xs:mt-2 sm:-mt-16 md:-mt-24 lg:-mt-32 relative z-10 pb-12">
        {/* Continue Watching (only if authenticated and has items) */}
        {isAuthenticated && continueWatchingItems.length > 0 && (
          <MovieRow
            title="Continue Watching"
            movies={continueWatchingItems.map(item => ({
              id: item.id,
              title: item.title,
              poster_path: item.posterPath,
              backdrop_path: item.backdropPath,
              overview: '',
              vote_average: 0,
              vote_count: 0,
              popularity: 0,
              genre_ids: [],
              adult: false,
              original_language: 'en',
              media_type: item.mediaType,
            }))}
          />
        )}

        {/* Movie Sections */}
        {sections.map(section => (
          <MovieRow
            key={section.id}
            title={section.title}
            movies={section.movies}
            showRank={section.showRank}
          />
        ))}
      </div>
    </div>
  );
}
