
import { Media } from './types';
import { fetchFromOMDB, processOMDBItem } from './utils';
import { FALLBACK_MEDIA } from './config';

// Search for movies and TV shows using OMDB
export const searchMedia = async (query: string): Promise<Media[]> => {
  if (!query) return [];
  
  try {
    // Search for movies
    const moviesData = await fetchFromOMDB({ s: query, type: 'movie' });
    const movies = moviesData.Search ? 
      moviesData.Search.map((item: any) => processOMDBItem(item, 'movie')) : [];
    
    // Search for TV shows
    const tvData = await fetchFromOMDB({ s: query, type: 'series' });
    const tvShows = tvData.Search ? 
      tvData.Search.map((item: any) => processOMDBItem(item, 'tv')) : [];
    
    // Combine results
    return [...movies, ...tvShows];
  } catch (error) {
    console.error('Search error:', error);
    return FALLBACK_MEDIA;
  }
};
