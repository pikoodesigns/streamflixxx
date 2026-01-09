// Movie/TV Show Types
export interface Movie {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  media_type?: 'movie' | 'tv';
}

export interface MovieDetails extends Movie {
  runtime?: number;
  episode_run_time?: number[];
  status: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  homepage?: string;
  imdb_id?: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  videos?: VideoResults;
  credits?: Credits;
  similar?: MovieListResponse;
  recommendations?: MovieListResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

// Video Types
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResults {
  results: Video[];
}

// Cast & Crew Types
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

// API Response Types
export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// User/Profile Types
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  maturityLevel: 'all' | 'pg' | 'pg13' | 'r';
}

export interface User {
  id: string;
  email: string;
  name: string;
  profiles: UserProfile[];
  activeProfileId: string | null;
  createdAt: string;
}

// Watchlist Types
export interface WatchlistItem {
  id: number;
  mediaType: 'movie' | 'tv';
  addedAt: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
}

// Continue Watching Types
export interface ContinueWatchingItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  progress: number; // percentage 0-100
  timestamp: number; // seconds
  lastWatched: string;
}

// Search Types
export interface SearchResults {
  movies: Movie[];
  tvShows: Movie[];
  totalResults: number;
}
