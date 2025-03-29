
import { Media } from './types';
import { fetchFromOMDB, processOMDBItem } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch popular TV shows from OMDB
export const fetchPopularTVShows = async (): Promise<Media[]> => {
  try {
    // Using "series" as a search term
    const data = await fetchFromOMDB({ s: 'series', type: 'series' });
    
    if (data.Search && data.Search.length > 0) {
      return data.Search.map((item: any) => processOMDBItem(item, 'tv'));
    }
    
    return FALLBACK_MEDIA.filter(item => item.media_type === 'tv');
  } catch (error) {
    console.error('Popular TV shows fetch error:', error);
    return FALLBACK_MEDIA.filter(item => item.media_type === 'tv');
  }
};

// Fetch top rated TV shows from OMDB
export const fetchTopRatedTVShows = async (): Promise<Media[]> => {
  try {
    // Using "drama" as a quality TV genre
    const data = await fetchFromOMDB({ s: 'drama', type: 'series' });
    
    if (data.Search && data.Search.length > 0) {
      return data.Search.map((item: any) => processOMDBItem(item, 'tv'));
    }
    
    return FALLBACK_MEDIA.filter(item => item.media_type === 'tv');
  } catch (error) {
    console.error('Top rated TV shows fetch error:', error);
    return FALLBACK_MEDIA.filter(item => item.media_type === 'tv');
  }
};
