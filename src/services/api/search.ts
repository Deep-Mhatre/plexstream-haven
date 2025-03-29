
import { Media } from './types';
import { fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

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
