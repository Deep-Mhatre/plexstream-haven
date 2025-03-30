
import { TMDB_API_KEY, TMDB_BASE_URL, OMDB_API_KEY, OMDB_BASE_URL } from './config';

// Helper function to make API requests with fallback and authorization header for TMDB
export const fetchFromAPI = async (endpoint: string, fallbackData: any = null): Promise<any> => {
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

// Helper function to make OMDB API requests
export const fetchFromOMDB = async (params: Record<string, string>): Promise<any> => {
  try {
    // Build the URL with parameters
    const url = new URL(OMDB_BASE_URL);
    url.searchParams.append('apikey', OMDB_API_KEY);
    
    // Add all other parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log(`Fetching from OMDB: ${url.toString()}`);
    
    // Make the API request
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`OMDB API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // OMDB returns { Response: "False" } when there's an error
    if (data.Response === "False") {
      throw new Error(data.Error || "OMDB returned an error");
    }
    
    return data;
  } catch (error) {
    console.error('OMDB API request failed:', error);
    throw error;
  }
};

// Process OMDB item to match our Media format
export const processOMDBItem = (item: any, mediaType: 'movie' | 'tv' = 'movie'): any => {
  return {
    id: item.imdbID,
    title: mediaType === 'movie' ? item.Title : undefined,
    name: mediaType === 'tv' ? item.Title : undefined,
    poster_path: item.Poster !== "N/A" ? item.Poster : null,
    backdrop_path: null, // OMDB doesn't provide backdrop images
    overview: item.Plot !== "N/A" ? item.Plot : "No plot available",
    vote_average: item.imdbRating !== "N/A" ? parseFloat(item.imdbRating) : 0,
    release_date: mediaType === 'movie' && item.Released !== "N/A" ? item.Released : undefined,
    first_air_date: mediaType === 'tv' && item.Released !== "N/A" ? item.Released : undefined,
    media_type: mediaType,
    genre_ids: item.Genre ? item.Genre.split(',').map((g: string) => g.trim()) : [],
    year: item.Year !== "N/A" ? item.Year : undefined
  };
};

// Get TMDB image URL with proper fallback for OMDB images
export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w300' | 'w185' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  
  // If it's already a full URL (like from OMDB), return it directly
  if (path.startsWith('http')) {
    return path;
  }
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
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
