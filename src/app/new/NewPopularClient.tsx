'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MovieRow from '@/components/movies/MovieRow';
import type { Movie } from '@/types';

interface NewPopularClientProps {
  trendingToday: Movie[];
  upcoming: Movie[];
  popularMovies: Movie[];
  popularTV: Movie[];
}

type Tab = 'trending' | 'upcoming' | 'movies' | 'tv';

export default function NewPopularClient({
  trendingToday,
  upcoming,
  popularMovies,
  popularTV,
}: NewPopularClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('trending');

  const tabs = [
    { id: 'trending' as Tab, label: '🔥 Trending Now' },
    { id: 'upcoming' as Tab, label: '📅 Coming Soon' },
    { id: 'movies' as Tab, label: '🎬 Popular Movies' },
    { id: 'tv' as Tab, label: '📺 Popular TV Shows' },
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case 'trending':
        return trendingToday;
      case 'upcoming':
        return upcoming;
      case 'movies':
        return popularMovies;
      case 'tv':
        return popularTV;
      default:
        return trendingToday;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-12">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          New & Popular
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-netflix-dark-gray text-white hover:bg-netflix-gray'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MovieRow
          title={tabs.find(t => t.id === activeTab)?.label || ''}
          movies={getActiveContent()}
        />
      </motion.div>

      {/* Additional Sections */}
      <div className="mt-8">
        {activeTab !== 'trending' && (
          <MovieRow title="Trending This Week" movies={trendingToday} />
        )}
        {activeTab !== 'movies' && (
          <MovieRow title="Top Movies" movies={popularMovies} showRank />
        )}
        {activeTab !== 'tv' && (
          <MovieRow title="Top TV Shows" movies={popularTV} showRank />
        )}
      </div>
    </div>
  );
}
