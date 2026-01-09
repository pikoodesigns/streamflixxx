import { getTrending, getPopular, getTopRated, discoverByGenre } from '@/lib/tmdb';
import HomeClient from './HomeClient';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  try {
    const [
      trending,
      popularMovies,
      popularTV,
      topRatedMovies,
      topRatedTV,
      actionMovies,
      comedyMovies,
      horrorMovies,
      romanceMovies,
      documentaries,
    ] = await Promise.all([
      getTrending('all', 'week'),
      getPopular('movie'),
      getPopular('tv'),
      getTopRated('movie'),
      getTopRated('tv'),
      discoverByGenre('movie', 28),
      discoverByGenre('movie', 35),
      discoverByGenre('movie', 27),
      discoverByGenre('movie', 10749),
      discoverByGenre('movie', 99),
    ]);

    const sections = [
      { id: 'trending', title: 'Trending Now', movies: trending.results },
      { id: 'popular-movies', title: 'Popular Movies', movies: popularMovies.results },
      { id: 'popular-tv', title: 'Popular TV Shows', movies: popularTV.results },
      { id: 'top-rated-movies', title: 'Top Rated Movies', movies: topRatedMovies.results, showRank: true },
      { id: 'top-rated-tv', title: 'Top Rated TV Shows', movies: topRatedTV.results },
      { id: 'action', title: 'Action Movies', movies: actionMovies.results },
      { id: 'comedy', title: 'Comedy Movies', movies: comedyMovies.results },
      { id: 'horror', title: 'Horror Movies', movies: horrorMovies.results },
      { id: 'romance', title: 'Romance Movies', movies: romanceMovies.results },
      { id: 'documentaries', title: 'Documentaries', movies: documentaries.results },
    ];

    // Get a featured movie for the hero
    const featuredMovie = trending.results[Math.floor(Math.random() * Math.min(5, trending.results.length))];

    return <HomeClient sections={sections} featuredMovie={featuredMovie} />;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Unable to load content</h1>
          <p className="text-netflix-light-gray">Please check your API key and try again.</p>
        </div>
      </div>
    );
  }
}
