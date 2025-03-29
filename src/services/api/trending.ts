
import { Media } from './types';
import { fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch trending movies and TV shows
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  const fallbackData = { results: FALLBACK_MEDIA };
  const data = await fetchFromAPI(`/trending/all/${timeWindow}`, fallbackData);
  return data.results || [];
};
