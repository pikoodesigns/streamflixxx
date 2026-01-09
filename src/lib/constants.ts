// TMDB API Configuration
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  YOUTUBE_BASE_URL: 'https://www.youtube.com/watch?v=',
  YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/',
};

// Image Sizes
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
};

// Movie Genres
export const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// TV Genres
export const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

// Kids-friendly genre IDs
export const KIDS_GENRE_IDS = [16, 10751, 10762, 35, 12];

// Maturity Ratings
export const MATURITY_LEVELS = {
  all: { label: 'All Ages', maxRating: 'G' },
  pg: { label: 'PG', maxRating: 'PG' },
  pg13: { label: 'PG-13', maxRating: 'PG-13' },
  r: { label: 'R', maxRating: 'R' },
};

// Default Avatars
export const DEFAULT_AVATARS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
];

// Avatar Colors (for generated avatars)
export const AVATAR_COLORS = [
  '#E50914', // Netflix Red
  '#B81D24', // Dark Red
  '#221F1F', // Almost Black
  '#F5F5F1', // Light Gray
  '#564D4D', // Brown Gray
  '#831010', // Deep Red
  '#0071EB', // Blue
  '#46D369', // Green
  '#FFD700', // Gold
  '#9B59B6', // Purple
];

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'TV Shows', href: '/tv' },
  { label: 'New & Popular', href: '/new' },
  { label: 'My List', href: '/my-list' },
];

// Category Sections for Home Page
export const HOME_SECTIONS = [
  { id: 'trending', title: 'Trending Now', endpoint: '/trending/all/week' },
  { id: 'popular-movies', title: 'Popular Movies', endpoint: '/movie/popular' },
  { id: 'popular-tv', title: 'Popular TV Shows', endpoint: '/tv/popular' },
  { id: 'top-rated-movies', title: 'Top Rated Movies', endpoint: '/movie/top_rated' },
  { id: 'top-rated-tv', title: 'Top Rated TV Shows', endpoint: '/tv/top_rated' },
  { id: 'action', title: 'Action Movies', endpoint: '/discover/movie?with_genres=28' },
  { id: 'comedy', title: 'Comedy Movies', endpoint: '/discover/movie?with_genres=35' },
  { id: 'horror', title: 'Horror Movies', endpoint: '/discover/movie?with_genres=27' },
  { id: 'romance', title: 'Romance Movies', endpoint: '/discover/movie?with_genres=10749' },
  { id: 'documentaries', title: 'Documentaries', endpoint: '/discover/movie?with_genres=99' },
];

// Placeholder Images
export const PLACEHOLDER_IMAGES = {
  poster: '/placeholder-poster.jpg',
  backdrop: '/placeholder-backdrop.jpg',
  avatar: '/placeholder-avatar.png',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'streamflix_user',
  PROFILES: 'streamflix_profiles',
  ACTIVE_PROFILE: 'streamflix_active_profile',
  WATCHLIST: 'streamflix_watchlist',
  CONTINUE_WATCHING: 'streamflix_continue_watching',
  THEME: 'streamflix_theme',
  AUTH_TOKEN: 'streamflix_auth_token',
};
