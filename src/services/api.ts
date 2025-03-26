
// This is a placeholder API key - in production, you would use environment variables
// and backend services to handle API keys securely
const TMDB_API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // This is a public demo key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  genre_ids: number[];
}

export interface MediaDetails extends Media {
  runtime?: number;
  number_of_seasons?: number;
  genres: Array<{ id: number; name: string }>;
  tagline?: string;
  status: string;
  homepage?: string;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

// Helper function to make API requests
const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });
  
  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.status}`);
  }
  
  return response.json();
};

// Fetch trending movies and TV shows
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  const data = await fetchFromTMDB(`/trending/all/${timeWindow}`);
  return data.results.map((item: any) => ({
    ...item,
    media_type: item.media_type,
  }));
};

// Fetch popular movies
export const fetchPopularMovies = async (): Promise<Media[]> => {
  const data = await fetchFromTMDB('/movie/popular');
  return data.results.map((item: any) => ({
    ...item,
    media_type: 'movie',
  }));
};

// Fetch popular TV shows
export const fetchPopularTVShows = async (): Promise<Media[]> => {
  const data = await fetchFromTMDB('/tv/popular');
  return data.results.map((item: any) => ({
    ...item,
    media_type: 'tv',
  }));
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (): Promise<Media[]> => {
  const data = await fetchFromTMDB('/movie/top_rated');
  return data.results.map((item: any) => ({
    ...item,
    media_type: 'movie',
  }));
};

// Fetch top rated TV shows
export const fetchTopRatedTVShows = async (): Promise<Media[]> => {
  const data = await fetchFromTMDB('/tv/top_rated');
  return data.results.map((item: any) => ({
    ...item,
    media_type: 'tv',
  }));
};

// Fetch movie or TV show details
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: number): Promise<MediaDetails> => {
  const data = await fetchFromTMDB(`/${mediaType}/${id}`, {
    append_to_response: 'videos,credits',
  });
  return {
    ...data,
    media_type: mediaType,
  };
};

// Search for movies and TV shows
export const searchMedia = async (query: string): Promise<Media[]> => {
  const data = await fetchFromTMDB('/search/multi', { query });
  return data.results
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item: any) => ({
      ...item,
      media_type: item.media_type,
    }));
};

// Fetch recommendations based on a movie or TV show
export const fetchRecommendations = async (mediaType: 'movie' | 'tv', id: number): Promise<Media[]> => {
  const data = await fetchFromTMDB(`/${mediaType}/${id}/recommendations`);
  return data.results.map((item: any) => ({
    ...item,
    media_type: item.media_type || mediaType,
  }));
};

// Get image URL
export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w300' | 'w185' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
