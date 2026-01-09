import { getPopular, getTopRated, discoverByGenre, getNowPlaying, getUpcoming } from '@/lib/tmdb';
import MoviesClient from './MoviesClient';

export const revalidate = 3600;

export default async function MoviesPage() {
  try {
    const [
      popularMovies,
      topRatedMovies,
      nowPlayingMovies,
      upcomingMovies,
      actionMovies,
      comedyMovies,
      horrorMovies,
      romanceMovies,
      sciFiMovies,
      thrillerMovies,
      animationMovies,
      documentaries,
    ] = await Promise.all([
      getPopular('movie'),
      getTopRated('movie'),
      getNowPlaying('movie'),
      getUpcoming(),
      discoverByGenre('movie', 28),
      discoverByGenre('movie', 35),
      discoverByGenre('movie', 27),
      discoverByGenre('movie', 10749),
      discoverByGenre('movie', 878),
      discoverByGenre('movie', 53),
      discoverByGenre('movie', 16),
      discoverByGenre('movie', 99),
    ]);

    const sections = [
      { id: 'popular', title: 'Popular Movies', movies: popularMovies.results },
      { id: 'now-playing', title: 'Now Playing', movies: nowPlayingMovies.results },
      { id: 'upcoming', title: 'Upcoming Movies', movies: upcomingMovies.results },
      { id: 'top-rated', title: 'Top Rated Movies', movies: topRatedMovies.results, showRank: true },
      { id: 'action', title: 'Action Movies', movies: actionMovies.results },
      { id: 'comedy', title: 'Comedy Movies', movies: comedyMovies.results },
      { id: 'horror', title: 'Horror Movies', movies: horrorMovies.results },
      { id: 'romance', title: 'Romance Movies', movies: romanceMovies.results },
      { id: 'sci-fi', title: 'Sci-Fi Movies', movies: sciFiMovies.results },
      { id: 'thriller', title: 'Thriller Movies', movies: thrillerMovies.results },
      { id: 'animation', title: 'Animation', movies: animationMovies.results },
      { id: 'documentaries', title: 'Documentaries', movies: documentaries.results },
    ];

    const featuredMovie = popularMovies.results[Math.floor(Math.random() * Math.min(5, popularMovies.results.length))];

    return <MoviesClient sections={sections} featuredMovie={featuredMovie} />;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Unable to load movies</h1>
          <p className="text-netflix-light-gray">Please try again later.</p>
        </div>
      </div>
    );
  }
}
