'use client';

import Hero from '@/components/home/Hero';
import MovieRow from '@/components/movies/MovieRow';
import type { Movie } from '@/types';

interface Section {
  id: string;
  title: string;
  movies: Movie[];
  showRank?: boolean;
}

interface MoviesClientProps {
  sections: Section[];
  featuredMovie: Movie;
}

export default function MoviesClient({ sections, featuredMovie }: MoviesClientProps) {
  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero */}
      <Hero movie={featuredMovie} mediaType="movie" />

      {/* Content Rows */}
      <div className="-mt-32 relative z-10 pb-12">
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
