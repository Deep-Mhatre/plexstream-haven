
import { Media } from './types';
import { fetchFromOMDB, processOMDBItem } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch popular movies from OMDB
export const fetchPopularMovies = async (): Promise<Media[]> => {
  try {
    // Using "action" as a popular movie genre search
    const data = await fetchFromOMDB({ s: 'action', type: 'movie', y: new Date().getFullYear().toString() });
    
    if (data.Search && data.Search.length > 0) {
      return data.Search.map((item: any) => processOMDBItem(item, 'movie'));
    }
    
    return FALLBACK_MEDIA.filter(item => item.media_type === 'movie');
  } catch (error) {
    console.error('Popular movies fetch error:', error);
    return FALLBACK_MEDIA.filter(item => item.media_type === 'movie');
  }
};

// Fetch top rated movies from OMDB
export const fetchTopRatedMovies = async (): Promise<Media[]> => {
  try {
    // Using "drama" as it often has higher ratings
    const data = await fetchFromOMDB({ s: 'drama', type: 'movie' });
    
    if (data.Search && data.Search.length > 0) {
      return data.Search.map((item: any) => processOMDBItem(item, 'movie'));
    }
    
    return FALLBACK_MEDIA.filter(item => item.media_type === 'movie');
  } catch (error) {
    console.error('Top rated movies fetch error:', error);
    return FALLBACK_MEDIA.filter(item => item.media_type === 'movie');
  }
};
