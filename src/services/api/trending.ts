
import { Media } from './types';
import { fetchFromOMDB, processOMDBItem } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch trending movies and TV shows from OMDB (using popular searches since OMDB doesn't have trending)
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  try {
    // For trending, we'll search for popular terms since OMDB doesn't have a trending endpoint
    // Using "marvel" as it generally returns popular content
    const data = await fetchFromOMDB({ s: 'marvel', type: 'movie' });
    
    if (data.Search && data.Search.length > 0) {
      return data.Search.map((item: any) => processOMDBItem(item, 'movie'));
    }
    
    return FALLBACK_MEDIA;
  } catch (error) {
    console.error('Trending fetch error:', error);
    return FALLBACK_MEDIA;
  }
};
