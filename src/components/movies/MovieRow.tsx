'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from './MovieCard';
import type { Movie } from '@/types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  showRank?: boolean;
}

export default function MovieRow({ title, movies, showRank = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative px-4 md:px-8 lg:px-12 mb-6 sm:mb-8 group/row">
      {/* Title */}
      <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4 hover:text-netflix-light-gray cursor-pointer transition-colors">
        {title}
        <span className="text-netflix-red ml-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          ›
        </span>
      </h2>

      {/* Row Container */}
      <div className="relative">
        {/* Left Arrow - Hidden on mobile */}
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity items-center justify-center hover:bg-black/80"
          aria-label="Scroll left"
        >
          <FiChevronLeft size={32} className="text-white" />
        </button>

        {/* Movies */}
        <div
          ref={rowRef}
          className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2 sm:pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              showRank={showRank}
            />
          ))}
        </div>

        {/* Right Arrow - Hidden on mobile */}
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity items-center justify-center hover:bg-black/80"
          aria-label="Scroll right"
        >
          <FiChevronRight size={32} className="text-white" />
        </button>
      </div>
    </div>
  );
}
