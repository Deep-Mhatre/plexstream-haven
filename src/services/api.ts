
// Open Movie Database API configuration
// This is a placeholder API key - in production, you would use environment variables
// and backend services to handle API keys securely
const OMDB_API_KEY = '8f59f603'; // This is a public demo key
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export interface Media {
  id: string;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  genre_ids: number[];
}

export interface MediaDetails extends Media {
  runtime?: number;
  number_of_seasons?: number;
  genres: Array<{ id: number; name: string }>;
  tagline?: string;
  status: string;
  homepage?: string;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

// Helper function to make API requests
const fetchFromOMDB = async (params: Record<string, string> = {}) => {
  const queryParams = new URLSearchParams({
    apikey: OMDB_API_KEY,
    ...params,
  });
  
  const url = `${OMDB_BASE_URL}/?${queryParams}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`OMDb API request failed: ${response.status}`);
  }
  
  return response.json();
};

// Function to convert OMDb movie data to our Media interface format
const convertOMDbToMedia = (item: any, mediaType: 'movie' | 'tv'): Media => {
  // Extract year for release date
  const year = item.Year?.split('–')[0] || '';
  const formattedDate = year ? `${year}-01-01` : '';
  
  return {
    id: item.imdbID,
    title: mediaType === 'movie' ? item.Title : undefined,
    name: mediaType === 'tv' ? item.Title : undefined,
    poster_path: item.Poster !== 'N/A' ? item.Poster : '',
    backdrop_path: item.Poster !== 'N/A' ? item.Poster : '', // OMDb doesn't provide backdrop, using poster
    overview: item.Plot || 'No overview available',
    vote_average: parseFloat(item.imdbRating || '0') || 0,
    release_date: mediaType === 'movie' ? formattedDate : undefined,
    first_air_date: mediaType === 'tv' ? formattedDate : undefined,
    media_type: mediaType,
    genre_ids: [], // OMDb doesn't provide genre IDs
  };
};

// Function to convert OMDb movie details to our MediaDetails interface format
const convertOMDbToMediaDetails = (item: any, mediaType: 'movie' | 'tv'): MediaDetails => {
  // Extract year for release date
  const year = item.Year?.split('–')[0] || '';
  const formattedDate = year ? `${year}-01-01` : '';
  
  // Convert runtime from string (e.g., "120 min") to number
  let runtime;
  if (item.Runtime && item.Runtime !== 'N/A') {
    const runtimeMatch = item.Runtime.match(/\d+/);
    if (runtimeMatch) {
      runtime = parseInt(runtimeMatch[0], 10);
    }
  }
  
  // Parse genres from string to array of objects
  const genres = item.Genre?.split(', ').map((genre: string, index: number) => ({
    id: index,
    name: genre
  })) || [];
  
  return {
    id: item.imdbID,
    title: mediaType === 'movie' ? item.Title : undefined,
    name: mediaType === 'tv' ? item.Title : undefined,
    poster_path: item.Poster !== 'N/A' ? item.Poster : '',
    backdrop_path: item.Poster !== 'N/A' ? item.Poster : '', // OMDb doesn't provide backdrop, using poster
    overview: item.Plot || 'No overview available',
    vote_average: parseFloat(item.imdbRating || '0') || 0,
    release_date: mediaType === 'movie' ? formattedDate : undefined,
    first_air_date: mediaType === 'tv' ? formattedDate : undefined,
    media_type: mediaType,
    genre_ids: [],
    runtime: runtime,
    number_of_seasons: mediaType === 'tv' ? parseInt(item.totalSeasons, 10) || 1 : undefined,
    genres,
    tagline: item.Awards || 'No tagline available',
    status: 'Released',
    homepage: `https://www.imdb.com/title/${item.imdbID}`,
    production_companies: [{
      id: 1,
      name: item.Production || 'Unknown',
      logo_path: null
    }],
    videos: {
      results: [] // OMDb doesn't provide videos
    },
    credits: {
      cast: item.Actors?.split(', ').map((actor: string, index: number) => ({
        id: index,
        name: actor,
        character: 'Character information not available',
        profile_path: null
      })) || [],
      crew: [
        {
          id: 1,
          name: item.Director || 'Unknown',
          job: 'Director',
          department: 'Directing'
        },
        {
          id: 2,
          name: item.Writer || 'Unknown',
          job: 'Writer',
          department: 'Writing'
        }
      ]
    }
  };
};

// Fetch trending movies and TV shows
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  const trendingMovies = await fetchPopularMovies();
  const trendingTVShows = await fetchPopularTVShows();
  // Combine and shuffle to simulate "trending"
  const combined = [...trendingMovies, ...trendingTVShows];
  return combined.sort(() => Math.random() - 0.5);
};

// Fetch popular movies
export const fetchPopularMovies = async (): Promise<Media[]> => {
  // Using a predefined list of popular movie titles to search
  const popularTitles = ['Inception', 'The Dark Knight', 'Interstellar', 'The Matrix', 'Avatar', 'Avengers', 'Jurassic Park', 'Star Wars', 'Titanic', 'Terminator'];
  
  const promises = popularTitles.map(title => 
    fetchFromOMDB({ s: title, type: 'movie' })
      .then(data => data.Search || [])
  );
  
  const results = await Promise.all(promises);
  const movies = results.flat().slice(0, 20); // Limit to 20 movies
  
  return movies.map(movie => convertOMDbToMedia(movie, 'movie'));
};

// Fetch popular TV shows
export const fetchPopularTVShows = async (): Promise<Media[]> => {
  // Using a predefined list of popular TV show titles to search
  const popularTitles = ['Game of Thrones', 'Breaking Bad', 'Stranger Things', 'The Office', 'Friends', 'The Crown', 'The Mandalorian', 'The Witcher', 'Westworld', 'House of Cards'];
  
  const promises = popularTitles.map(title => 
    fetchFromOMDB({ s: title, type: 'series' })
      .then(data => data.Search || [])
  );
  
  const results = await Promise.all(promises);
  const tvShows = results.flat().slice(0, 20); // Limit to 20 TV shows
  
  return tvShows.map(show => convertOMDbToMedia(show, 'tv'));
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (): Promise<Media[]> => {
  // Using a predefined list of top-rated movie titles to search
  const topRatedTitles = ['The Shawshank Redemption', 'The Godfather', 'Pulp Fiction', 'Schindler\'s List', 'Forrest Gump', 'The Lord of the Rings', 'Fight Club', 'The Silence of the Lambs', 'Goodfellas', 'Seven'];
  
  const promises = topRatedTitles.map(title => 
    fetchFromOMDB({ s: title, type: 'movie' })
      .then(data => data.Search || [])
  );
  
  const results = await Promise.all(promises);
  const movies = results.flat().slice(0, 20); // Limit to 20 movies
  
  return movies.map(movie => convertOMDbToMedia(movie, 'movie'));
};

// Fetch top rated TV shows
export const fetchTopRatedTVShows = async (): Promise<Media[]> => {
  // Using a predefined list of top-rated TV show titles to search
  const topRatedTitles = ['Planet Earth', 'Band of Brothers', 'The Wire', 'Chernobyl', 'True Detective', 'Sherlock', 'Fargo', 'Black Mirror', 'Narcos', 'The Handmaid\'s Tale'];
  
  const promises = topRatedTitles.map(title => 
    fetchFromOMDB({ s: title, type: 'series' })
      .then(data => data.Search || [])
  );
  
  const results = await Promise.all(promises);
  const tvShows = results.flat().slice(0, 20); // Limit to 20 TV shows
  
  return tvShows.map(show => convertOMDbToMedia(show, 'tv'));
};

// Fetch movie or TV show details
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MediaDetails> => {
  const data = await fetchFromOMDB({ i: id, plot: 'full' });
  return convertOMDbToMediaDetails(data, mediaType);
};

// Search for movies and TV shows
export const searchMedia = async (query: string): Promise<Media[]> => {
  // Search for both movies and TV shows
  const [moviesData, tvShowsData] = await Promise.all([
    fetchFromOMDB({ s: query, type: 'movie' }),
    fetchFromOMDB({ s: query, type: 'series' })
  ]);
  
  const movies = (moviesData.Search || []).map((movie: any) => convertOMDbToMedia(movie, 'movie'));
  const tvShows = (tvShowsData.Search || []).map((show: any) => convertOMDbToMedia(show, 'tv'));
  
  return [...movies, ...tvShows];
};

// Fetch recommendations based on a movie or TV show
export const fetchRecommendations = async (mediaType: 'movie' | 'tv', id: string): Promise<Media[]> => {
  // Get the details of the media to use for finding similar content
  const details = await fetchMediaDetails(mediaType, id);
  
  // Use the first genre to search for similar content
  const genre = details.genres[0]?.name || '';
  
  if (genre) {
    // Search by genre
    const data = await fetchFromOMDB({ s: genre, type: mediaType === 'movie' ? 'movie' : 'series' });
    const recommendations = (data.Search || [])
      .filter((item: any) => item.imdbID !== id) // Exclude the current media
      .map((item: any) => convertOMDbToMedia(item, mediaType));
    
    return recommendations.slice(0, 10); // Limit to 10 recommendations
  }
  
  // If no genre is available, return empty array
  return [];
};

// Get image URL (no modifications needed for OMDb as it directly provides full image URLs)
export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w300' | 'w185' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return path; // OMDb directly provides full image URLs
};

