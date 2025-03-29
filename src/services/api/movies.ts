
import { Media } from './types';
import { fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch popular movies
export const fetchPopularMovies = async (): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === 'movie')
  };
  const data = await fetchFromAPI('/movie/popular', fallbackData);
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
