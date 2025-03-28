
const axios = require('axios');

// Helper function for OMDb API requests
const fetchFromOMDb = async (params) => {
  try {
    const url = 'https://www.omdbapi.com/';
    const response = await axios.get(url, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        ...params
      }
    });
    
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'Failed to fetch data');
    }
    
    return response.data;
  } catch (error) {
    console.error('API error:', error);
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

// @desc    Search for movies and TV shows
// @route   GET /api/media/search
// @access  Public
const searchMedia = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const movies = await fetchFromOMDb({ s: query, type: "movie" });
    const tvShows = await fetchFromOMDb({ s: query, type: "series" });
    
    const processedMovies = movies.Search ? 
      movies.Search.map(item => processOMDbItem(item, "movie")) : [];
    
    const processedTVShows = tvShows.Search ? 
      tvShows.Search.map(item => processOMDbItem(item, "tv")) : [];
    
    res.json([...processedMovies, ...processedTVShows]);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get media details
// @route   GET /api/media/:mediaType/:id
// @access  Public
const getMediaDetails = async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    
    if (!mediaType || !id) {
      return res.status(400).json({ error: 'Media type and ID are required' });
    }
    
    const data = await fetchFromOMDb({ i: id, plot: "full" });
    const processedData = processOMDbItem(data, mediaType);
    
    // Add additional details
    processedData.credits = {
      cast: data.Actors ? data.Actors.split(", ").map((name, id) => ({ id, name, character: "" })) : [],
      crew: data.Director ? [{ id: 1, name: data.Director, job: "Director" }] : []
    };
    
    processedData.videos = { results: [] };
    processedData.tagline = data.Awards !== "N/A" ? data.Awards : "";
    processedData.runtime = data.Runtime !== "N/A" ? parseInt(data.Runtime) : 0;
    
    if (mediaType === "tv") {
      processedData.number_of_seasons = data.totalSeasons !== "N/A" ? parseInt(data.totalSeasons, 10) : 1;
    }
    
    res.json(processedData);
  } catch (error) {
    console.error('Get media details error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get trending media
// @route   GET /api/media/trending
// @access  Public
const getTrending = async (req, res) => {
  try {
    const popular = await fetchFromOMDb({ s: "marvel", type: "movie" });
    const results = popular.Search ? popular.Search.map(item => processOMDbItem(item, "movie")) : [];
    res.json(results);
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get popular movies
// @route   GET /api/media/movies/popular
// @access  Public
const getPopularMovies = async (req, res) => {
  try {
    const popular = await fetchFromOMDb({ s: "action", type: "movie", y: new Date().getFullYear() });
    const results = popular.Search ? popular.Search.map(item => processOMDbItem(item, "movie")) : [];
    res.json(results);
  } catch (error) {
    console.error('Get popular movies error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get popular TV shows
// @route   GET /api/media/tvshows/popular
// @access  Public
const getPopularTVShows = async (req, res) => {
  try {
    const popular = await fetchFromOMDb({ s: "series", type: "series" });
    const results = popular.Search ? popular.Search.map(item => processOMDbItem(item, "tv")) : [];
    res.json(results);
  } catch (error) {
    console.error('Get popular TV shows error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

module.exports = {
  searchMedia,
  getMediaDetails,
  getTrending,
  getPopularMovies,
  getPopularTVShows
};
