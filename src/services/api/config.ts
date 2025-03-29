
// API configuration
export const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzYxYTQ4NDU3NGE4NGNhODQwODJiM2NjNjg0OTE0MCIsIm5iZiI6MTczOTAyNjEzOS41NTUsInN1YiI6IjY3YTc2ZWRiZGNmNzVhZmJlMmYxMGY3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NZ7j6cUan7jO8BJSLuKu-LO8vZDvFORG1z7JJ6Hfsec'; // User provided JWT token
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'; // TMDB API

// OMDB API configuration
export const OMDB_API_KEY = 'fe53463f'; // User provided OMDB API key
export const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Fallback data for when API is unavailable
import { Media } from './types';

export const FALLBACK_MEDIA: Media[] = [
  {
    id: '1',
    title: 'Fallback Movie',
    poster_path: '/placeholder.jpg',
    backdrop_path: '/placeholder.jpg',
    overview: 'This is a fallback movie when the API is unavailable.',
    vote_average: 8.5,
    release_date: '2023-01-01',
    media_type: 'movie',
    genre_ids: [28, 12, 14]
  },
  {
    id: '2',
    name: 'Fallback TV Show',
    poster_path: '/placeholder.jpg',
    backdrop_path: '/placeholder.jpg',
    overview: 'This is a fallback TV show when the API is unavailable.',
    vote_average: 9.0,
    first_air_date: '2023-01-01',
    media_type: 'tv',
    genre_ids: [18, 10765]
  }
];
