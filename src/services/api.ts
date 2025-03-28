
// TMDB API configuration
const TMDB_API_KEY = 'api_key_placeholder'; // Will be replaced by backend proxy
const TMDB_BASE_URL = '/api/tmdb'; // Use backend proxy for TMDB requests

// Open Movie Database API configuration
const OMDB_API_KEY = 'api_key_placeholder'; // Will be replaced by backend proxy
const OMDB_BASE_URL = '/api/omdb'; // Use backend proxy for OMDb requests

export interface Media {
  id: string;
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

// Fetch trending movies and TV shows
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  const url = `${TMDB_BASE_URL}/trending/all/${timeWindow}`;
  const data = await fetchFromAPI(url);
  return data.results;
};

// Fetch popular movies
export const fetchPopularMovies = async (): Promise<Media[]> => {
  const url = `${TMDB_BASE_URL}/movie/popular`;
  const data = await fetchFromAPI(url);
  return data.results;
};

// Fetch popular TV shows
export const fetchPopularTVShows = async (): Promise<Media[]> => {
  const url = `${TMDB_BASE_URL}/tv/popular`;
  const data = await fetchFromAPI(url);
  return data.results;
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (): Promise<Media[]> => {
  const url = `${TMDB_BASE_URL}/movie/top_rated`;
  const data = await fetchFromAPI(url);
  return data.results;
};

// Fetch top rated TV shows
export const fetchTopRatedTVShows = async (): Promise<Media[]> => {
  const url = `${TMDB_BASE_URL}/tv/top_rated`;
  const data = await fetchFromAPI(url);
  return data.results;
};

// Fetch movie or TV show details
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MediaDetails> => {
  const url = `${TMDB_BASE_URL}/${mediaType}/${id}?append_to_response=credits,videos`;
  return await fetchFromAPI(url);
};

// Search for movies and TV shows
export const searchMedia = async (query: string): Promise<Media[]> => {
  if (!query) return [];
  const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`;
  const data = await fetchFromAPI(url);
  return data.results.filter((item: any) => 
    item.media_type === 'movie' || item.media_type === 'tv'
  );
};

// Fetch recommendations based on a movie or TV show
export const fetchRecommendations = async (mediaType: 'movie' | 'tv', id: string): Promise<Media[]> => {
  const url = `${TMDB_BASE_URL}/${mediaType}/${id}/recommendations`;
  const data = await fetchFromAPI(url);
  return data.results;
};

// Helper function to make API requests
const fetchFromAPI = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
};

// Get TMDB image URL 
export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w300' | 'w185' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  
  // If it's already a full URL, return it directly
  if (path.startsWith('http')) {
    return path;
  }
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get video URL from OMDb or TMDB
export const getVideoUrl = async (mediaType: 'movie' | 'tv', id: string, title: string): Promise<string | null> => {
  try {
    // First try TMDB videos
    const details = await fetchMediaDetails(mediaType, id);
    const trailer = details.videos?.results.find(video => 
      video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    }
    
    // Fallback to OMDb
    const response = await fetch(`${OMDB_BASE_URL}/?t=${encodeURIComponent(title)}`);
    const data = await response.json();
    
    if (data.imdbID) {
      return `https://www.imdb.com/title/${data.imdbID}/`;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return null;
  }
};
