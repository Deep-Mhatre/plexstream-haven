
import { TMDB_API_KEY, TMDB_BASE_URL } from './config';

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

// Get TMDB image URL 
export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w300' | 'w185' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  
  // If it's already a full URL, return it directly
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
