// TMDB API configuration
const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzYxYTQ4NDU3NGE4NGNhODQwODJiM2NjNjg0OTE0MCIsIm5iZiI6MTczOTAyNjEzOS41NTUsInN1YiI6IjY3YTc2ZWRiZGNmNzVhZmJlMmYxMGY3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NZ7j6cUan7jO8BJSLuKu-LO8vZDvFORG1z7JJ6Hfsec'; // User provided JWT token
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'; // Directly use TMDB API

// Fallback data for when API is unavailable
const FALLBACK_MEDIA: Media[] = [
  {
    id: '1',
    title: 'Fallback Movie',
    poster_path: '/placeholder.jpg',
    backdrop_path: '/placeholder.jpg',
    overview: 'This is a fallback movie when the API is unavailable.',
    vote_average: 8.5,
    release_date: '2023-01-01',
    media_type: 'movie',
    genre_ids: [28, 12, 14]
  },
  {
    id: '2',
    name: 'Fallback TV Show',
    poster_path: '/placeholder.jpg',
    backdrop_path: '/placeholder.jpg',
    overview: 'This is a fallback TV show when the API is unavailable.',
    vote_average: 9.0,
    first_air_date: '2023-01-01',
    media_type: 'tv',
    genre_ids: [18, 10765]
  }
];

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

// Helper function to make API requests with fallback and authorization header for TMDB
const fetchFromAPI = async (endpoint: string, fallbackData: any = null): Promise<any> => {
  try {
    console.log(`Fetching from: ${TMDB_BASE_URL}${endpoint}`);
    
    // Make direct API call with Authorization header
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    if (fallbackData) {
      console.log('Using fallback data');
      return fallbackData;
    }
    throw error;
  }
};

// Fetch trending movies and TV shows
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  const fallbackData = { results: FALLBACK_MEDIA };
  const data = await fetchFromAPI(`/trending/all/${timeWindow}`, fallbackData);
  return data.results || [];
};

// Fetch popular movies
export const fetchPopularMovies = async (): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === 'movie')
  };
  const data = await fetchFromAPI('/movie/popular', fallbackData);
  return data.results || [];
};

// Fetch popular TV shows
export const fetchPopularTVShows = async (): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === 'tv')
  };
  const data = await fetchFromAPI('/tv/popular', fallbackData);
  return data.results || [];
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === 'movie')
  };
  const data = await fetchFromAPI('/movie/top_rated', fallbackData);
  return data.results || [];
};

// Fetch top rated TV shows
export const fetchTopRatedTVShows = async (): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === 'tv')
  };
  const data = await fetchFromAPI('/tv/top_rated', fallbackData);
  return data.results || [];
};

// Fetch movie or TV show details
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MediaDetails> => {
  const fallbackDetail = {
    ...FALLBACK_MEDIA.find(item => item.media_type === mediaType) as Media,
    genres: [{ id: 1, name: 'Drama' }],
    status: 'Released',
    production_companies: [],
    credits: {
      cast: [],
      crew: []
    },
    videos: {
      results: []
    }
  };
  
  return await fetchFromAPI(`/${mediaType}/${id}?append_to_response=credits,videos`, fallbackDetail);
};

// Search for movies and TV shows
export const searchMedia = async (query: string): Promise<Media[]> => {
  if (!query) return [];
  
  try {
    const data = await fetchFromAPI(`/search/multi?query=${encodeURIComponent(query)}`);
    return data.results.filter((item: any) => 
      item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (error) {
    console.error('Search error:', error);
    return FALLBACK_MEDIA;
  }
};

// Fetch recommendations based on a movie or TV show
export const fetchRecommendations = async (mediaType: 'movie' | 'tv', id: string): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === mediaType)
  };
  const data = await fetchFromAPI(`/${mediaType}/${id}/recommendations`, fallbackData);
  return data.results || [];
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

// Get video URL from TMDB
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
    
    return null;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return null;
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
