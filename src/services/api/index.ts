
// Main API index file
// Re-export all API functionality

// Types
export type { Media, MediaDetails } from './types';

// Config & Utils
export { TMDB_API_KEY, TMDB_BASE_URL, FALLBACK_MEDIA } from './config';
export { getImageUrl, formatDate } from './utils';

// API Functions
export { fetchTrending } from './trending';
export { fetchPopularMovies, fetchTopRatedMovies } from './movies';
export { fetchPopularTVShows, fetchTopRatedTVShows } from './tv';
export { fetchMediaDetails, fetchRecommendations, getVideoUrl } from './details';
export { searchMedia } from './search';
