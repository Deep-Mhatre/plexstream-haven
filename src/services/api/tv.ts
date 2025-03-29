
import { Media } from './types';
import { fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch popular TV shows
export const fetchPopularTVShows = async (): Promise<Media[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === 'tv')
  };
  const data = await fetchFromAPI('/tv/popular', fallbackData);
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
