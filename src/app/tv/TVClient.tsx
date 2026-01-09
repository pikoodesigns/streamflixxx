'use client';

import Hero from '@/components/home/Hero';
import MovieRow from '@/components/movies/MovieRow';
import AdBanner from '@/components/ads/AdBanner';
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
        {sections.map((section, index) => (
          <div key={section.id}>
            <MovieRow
              title={section.title}
              movies={section.movies}
              showRank={section.showRank}
            />
            {/* Insert ad after every 3rd row */}
            {(index + 1) % 3 === 0 && index < sections.length - 1 && (
              <AdBanner 
                type={index % 6 === 2 ? 'native' : 'banner300x250'} 
                className="my-6 sm:my-8"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
