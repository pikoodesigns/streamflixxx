import { getTrending, getPopular, getUpcoming } from '@/lib/tmdb';
import NewPopularClient from './NewPopularClient';

export const revalidate = 3600;

export default async function NewPopularPage() {
  try {
    const [trending, upcoming, popularMovies, popularTV] = await Promise.all([
      getTrending('all', 'day'),
      getUpcoming(),
      getPopular('movie'),
      getPopular('tv'),
    ]);

    return (
      <NewPopularClient
        trendingToday={trending.results}
        upcoming={upcoming.results}
        popularMovies={popularMovies.results}
        popularTV={popularTV.results}
      />
    );
  } catch (error) {
    console.error('Error fetching new & popular:', error);
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Unable to load content</h1>
          <p className="text-netflix-light-gray">Please try again later.</p>
        </div>
      </div>
    );
  }
}
