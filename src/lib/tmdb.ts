import { TMDB_CONFIG, IMAGE_SIZES } from './constants';
import type { Movie, MovieDetails, MovieListResponse, Video } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Helper function for API requests
async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY || '');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Image URL Helpers
export function getImageUrl(
  path: string | null,
  type: 'poster' | 'backdrop' | 'profile' = 'poster',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!path) {
    return type === 'poster' 
      ? '/placeholder-poster.svg' 
      : type === 'backdrop'
      ? '/placeholder-backdrop.svg'
      : '/placeholder-avatar.svg';
  }
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`;
}

// Trending
export async function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'week'
): Promise<MovieListResponse> {
  return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
}

// Popular
export async function getPopular(
  mediaType: 'movie' | 'tv' = 'movie',
  page: number = 1
): Promise<MovieListResponse> {
  return fetchFromTMDB(`/${mediaType}/popular`, { page: page.toString() });
}

// Top Rated
export async function getTopRated(
  mediaType: 'movie' | 'tv' = 'movie',
  page: number = 1
): Promise<MovieListResponse> {
  return fetchFromTMDB(`/${mediaType}/top_rated`, { page: page.toString() });
}

// Now Playing / On Air
export async function getNowPlaying(mediaType: 'movie' | 'tv' = 'movie'): Promise<MovieListResponse> {
  const endpoint = mediaType === 'movie' ? '/movie/now_playing' : '/tv/on_the_air';
  return fetchFromTMDB(endpoint);
}

// Upcoming
export async function getUpcoming(): Promise<MovieListResponse> {
  return fetchFromTMDB('/movie/upcoming');
}

// Get Details
export async function getDetails(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<MovieDetails> {
  return fetchFromTMDB(`/${mediaType}/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  });
}

// Get Videos (Trailers)
export async function getVideos(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<{ results: Video[] }> {
  return fetchFromTMDB(`/${mediaType}/${id}/videos`);
}

// Get Trailer
export async function getTrailer(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<Video | null> {
  const { results } = await getVideos(mediaType, id);
  
  // Priority: Official Trailer > Trailer > Teaser > any video
  const trailer = 
    results.find(v => v.type === 'Trailer' && v.official && v.site === 'YouTube') ||
    results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
    results.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
    results.find(v => v.site === 'YouTube');
  
  return trailer || null;
}

// Search
export async function searchMulti(query: string, page: number = 1): Promise<MovieListResponse> {
  return fetchFromTMDB('/search/multi', { query, page: page.toString() });
}

export async function searchMovies(query: string, page: number = 1): Promise<MovieListResponse> {
  return fetchFromTMDB('/search/movie', { query, page: page.toString() });
}

export async function searchTVShows(query: string, page: number = 1): Promise<MovieListResponse> {
  return fetchFromTMDB('/search/tv', { query, page: page.toString() });
}

// Discover by Genre
export async function discoverByGenre(
  mediaType: 'movie' | 'tv',
  genreId: number,
  page: number = 1
): Promise<MovieListResponse> {
  return fetchFromTMDB(`/discover/${mediaType}`, {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: 'popularity.desc',
  });
}

// Get Genres List
export async function getGenres(mediaType: 'movie' | 'tv'): Promise<{ genres: { id: number; name: string }[] }> {
  return fetchFromTMDB(`/genre/${mediaType}/list`);
}

// Similar
export async function getSimilar(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<MovieListResponse> {
  return fetchFromTMDB(`/${mediaType}/${id}/similar`);
}

// Recommendations
export async function getRecommendations(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<MovieListResponse> {
  return fetchFromTMDB(`/${mediaType}/${id}/recommendations`);
}

// Credits
export async function getCredits(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<{ cast: any[]; crew: any[] }> {
  return fetchFromTMDB(`/${mediaType}/${id}/credits`);
}

// Get title helper
export function getTitle(item: Movie): string {
  return item.title || item.name || 'Unknown Title';
}

// Get release year helper
export function getReleaseYear(item: Movie): string {
  const date = item.release_date || item.first_air_date;
  return date ? new Date(date).getFullYear().toString() : '';
}

// Get media type helper
export function getMediaType(item: Movie): 'movie' | 'tv' {
  if (item.media_type) return item.media_type;
  return item.title ? 'movie' : 'tv';
}
