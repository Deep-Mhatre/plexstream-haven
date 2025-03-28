
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Helper function for OMDb API requests
const fetchFromOMDb = async (params) => {
  try {
    const url = 'https://www.omdbapi.com/';
    const response = await axios.get(url, {
      params: {
        apikey: OMDB_API_KEY,
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

// Routes
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    const movies = await fetchFromOMDb({ s: query, type: "movie" });
    const tvShows = await fetchFromOMDb({ s: query, type: "series" });
    
    const processedMovies = movies.Search ? 
      movies.Search.map(item => processOMDbItem(item, "movie")) : [];
    
    const processedTVShows = tvShows.Search ? 
      tvShows.Search.map(item => processOMDbItem(item, "tv")) : [];
    
    res.json([...processedMovies, ...processedTVShows]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/media/:mediaType/:id', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
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
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trending', async (req, res) => {
  try {
    const popular = await fetchFromOMDb({ s: "marvel", type: "movie" });
    const results = popular.Search ? popular.Search.map(item => processOMDbItem(item, "movie")) : [];
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/popular', async (req, res) => {
  try {
    const popular = await fetchFromOMDb({ s: "action", type: "movie", y: new Date().getFullYear() });
    const results = popular.Search ? popular.Search.map(item => processOMDbItem(item, "movie")) : [];
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tvshows/popular', async (req, res) => {
  try {
    const popular = await fetchFromOMDb({ s: "series", type: "series" });
    const results = popular.Search ? popular.Search.map(item => processOMDbItem(item, "tv")) : [];
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
