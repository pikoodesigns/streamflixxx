import { getPopular, getTopRated, discoverByGenre, getNowPlaying } from '@/lib/tmdb';
import TVClient from './TVClient';

export const revalidate = 3600;

export default async function TVShowsPage() {
  try {
    const [
      popularTV,
      topRatedTV,
      onAirTV,
      actionTV,
      comedyTV,
      crimeTV,
      dramaTV,
      sciFiTV,
      animationTV,
      realityTV,
      documentaryTV,
    ] = await Promise.all([
      getPopular('tv'),
      getTopRated('tv'),
      getNowPlaying('tv'),
      discoverByGenre('tv', 10759),
      discoverByGenre('tv', 35),
      discoverByGenre('tv', 80),
      discoverByGenre('tv', 18),
      discoverByGenre('tv', 10765),
      discoverByGenre('tv', 16),
      discoverByGenre('tv', 10764),
      discoverByGenre('tv', 99),
    ]);

    const sections = [
      { id: 'popular', title: 'Popular TV Shows', movies: popularTV.results },
      { id: 'on-air', title: 'Currently Airing', movies: onAirTV.results },
      { id: 'top-rated', title: 'Top Rated TV Shows', movies: topRatedTV.results, showRank: true },
      { id: 'action', title: 'Action & Adventure', movies: actionTV.results },
      { id: 'comedy', title: 'Comedy Shows', movies: comedyTV.results },
      { id: 'crime', title: 'Crime Shows', movies: crimeTV.results },
      { id: 'drama', title: 'Drama Series', movies: dramaTV.results },
      { id: 'sci-fi', title: 'Sci-Fi & Fantasy', movies: sciFiTV.results },
      { id: 'animation', title: 'Animation', movies: animationTV.results },
      { id: 'reality', title: 'Reality TV', movies: realityTV.results },
      { id: 'documentary', title: 'Documentaries', movies: documentaryTV.results },
    ];

    const featuredShow = popularTV.results[Math.floor(Math.random() * Math.min(5, popularTV.results.length))];

    return <TVClient sections={sections} featuredShow={featuredShow} />;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Unable to load TV shows</h1>
          <p className="text-netflix-light-gray">Please try again later.</p>
        </div>
      </div>
    );
  }
}
