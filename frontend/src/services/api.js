// API functions for fetching media data
const API_KEY = "your_omdb_api_key"; // Replace with your actual API key

// Base functions for API requests
const fetchFromOMDb = async (params) => {
  const baseUrl = "https://www.omdbapi.com/";
  const url = new URL(baseUrl);
  
  // Add API key and parameters
  url.searchParams.append("apikey", API_KEY);
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch data");
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Process OMDb data into our app's format
const processOMDbItem = (item, mediaType = "movie") => {
  return {
    id: item.imdbID,
    title: item.Title,
    name: item.Title,
    overview: item.Plot,
    poster_path: item.Poster !== "N/A" ? item.Poster : null,
    backdrop_path: null, // OMDb doesn't provide backdrop images
    release_date: item.Released !== "N/A" ? item.Released : item.Year,
    first_air_date: item.Released !== "N/A" ? item.Released : item.Year,
    vote_average: item.imdbRating !== "N/A" ? parseFloat(item.imdbRating) : 0,
    media_type: mediaType,
    genre_ids: item.Genre ? item.Genre.split(", ").map(g => g.trim()) : [],
    genres: item.Genre ? item.Genre.split(", ").map((name, id) => ({ id, name })) : []
  };
};

// Public API functions
export const searchMedia = async (query) => {
  try {
    const movies = await fetchFromOMDb({ s: query, type: "movie" });
    const tvShows = await fetchFromOMDb({ s: query, type: "series" });
    
    const processedMovies = movies.Search ? 
      movies.Search.map(item => processOMDbItem(item, "movie")) : [];
    
    const processedTVShows = tvShows.Search ? 
      tvShows.Search.map(item => processOMDbItem(item, "tv")) : [];
    
    return [...processedMovies, ...processedTVShows];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

export const getMediaDetails = async (mediaType, id) => {
  try {
    const data = await fetchFromOMDb({ i: id, plot: "full" });
    const processedData = processOMDbItem(data, mediaType);
    
    // Add additional details
    processedData.credits = {
      cast: data.Actors ? data.Actors.split(", ").map((name, id) => ({ id, name, character: "" })) : [],
      crew: data.Director ? [{ id: 1, name: data.Director, job: "Director" }] : []
    };
    
    processedData.videos = { results: [] };
    processedData.tagline = data.Awards !== "N/A" ? data.Awards : "";
    processedData.runtime = data.Runtime !== "N/A" ? parseInt(data.Runtime, 10) : 0;
    
    if (mediaType === "tv") {
      processedData.number_of_seasons = data.totalSeasons !== "N/A" ? parseInt(data.totalSeasons, 10) : 1;
    }
    
    return processedData;
  } catch (error) {
    console.error("Get media details error:", error);
    throw error;
  }
};

export const getTrendingMedia = async () => {
  // Since OMDb doesn't have a trending endpoint, we'll use some predefined searches
  try {
    const popular = await fetchFromOMDb({ s: "marvel", type: "movie" });
    return popular.Search ? popular.Search.map(item => processOMDbItem(item, "movie")) : [];
  } catch (error) {
    console.error("Get trending error:", error);
    return [];
  }
};

export const getPopularMovies = async () => {
  try {
    const popular = await fetchFromOMDb({ s: "action", type: "movie", y: new Date().getFullYear() });
    return popular.Search ? popular.Search.map(item => processOMDbItem(item, "movie")) : [];
  } catch (error) {
    console.error("Get popular movies error:", error);
    return [];
  }
};

export const getPopularTVShows = async () => {
  try {
    const popular = await fetchFromOMDb({ s: "series", type: "series" });
    return popular.Search ? popular.Search.map(item => processOMDbItem(item, "tv")) : [];
  } catch (error) {
    console.error("Get popular TV shows error:", error);
    return [];
  }
};

// Helper function for image URLs
export const getImageUrl = (path, size = "original") => {
  if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
  
  // If it's already a full URL (like from OMDb), return it directly
  if (path.startsWith("http")) {
    return path;
  }
  
  // Otherwise, construct a URL (this is a backup for any TMDb paths that might remain)
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Media type for JSDoc
/**
 * @typedef {Object} Media
 * @property {string} id - The media ID
 * @property {string} [title] - The movie title
 * @property {string} [name] - The TV show name
 * @property {string} overview - The overview/description
 * @property {string} poster_path - The poster image path
 * @property {string} backdrop_path - The backdrop image path
 * @property {string} [release_date] - The movie release date
 * @property {string} [first_air_date] - The TV show first air date
 * @property {number} vote_average - The rating
 * @property {string} media_type - The media type (movie or tv)
 * @property {Array<number>} genre_ids - The genre IDs
 */

/**
 * @typedef {Object} MediaDetails
 * @property {Media} - All Media properties
 * @property {Object} credits - Cast and crew information
 * @property {Object} videos - Video links
 */

export { Media, MediaDetails };
