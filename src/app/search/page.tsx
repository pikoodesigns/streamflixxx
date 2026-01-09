import { searchMulti } from '@/lib/tmdb';
import SearchClient from './SearchClient';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query } = await searchParams;
  
  if (!query) {
    return <SearchClient query="" results={[]} />;
  }

  try {
    const results = await searchMulti(query);
    // Filter to only movies and TV shows
    const filteredResults = results.results.filter(
      item => item.media_type === 'movie' || item.media_type === 'tv'
    );
    
    return <SearchClient query={query} results={filteredResults} />;
  } catch (error) {
    console.error('Error searching:', error);
    return <SearchClient query={query} results={[]} error="Search failed. Please try again." />;
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q: query } = await searchParams;
  return {
    title: query ? `Search: ${query} - StreamFlix` : 'Search - StreamFlix',
  };
}
