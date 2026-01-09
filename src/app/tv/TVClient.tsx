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

interface TVClientProps {
  sections: Section[];
  featuredShow: Movie;
}

export default function TVClient({ sections, featuredShow }: TVClientProps) {
  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero */}
      <Hero movie={featuredShow} mediaType="tv" />

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
