
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
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// TMDB API base URL
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function for TMDB API requests
const fetchFromTMDb = async (endpoint, params = {}) => {
  try {
    const url = `${TMDB_BASE_URL}${endpoint}`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        ...params
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('TMDB API error:', error.message);
    throw error;
  }
};

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
    console.error('OMDb API error:', error.message);
    throw error;
  }
};

// TMDB Routes
app.get('/api/tmdb/trending/:mediaType/:timeWindow', async (req, res) => {
  try {
    const { mediaType, timeWindow } = req.params;
    const data = await fetchFromTMDb(`/trending/${mediaType}/${timeWindow}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/movie/popular', async (req, res) => {
  try {
    const data = await fetchFromTMDb('/movie/popular');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/tv/popular', async (req, res) => {
  try {
    const data = await fetchFromTMDb('/tv/popular');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/movie/top_rated', async (req, res) => {
  try {
    const data = await fetchFromTMDb('/movie/top_rated');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/tv/top_rated', async (req, res) => {
  try {
    const data = await fetchFromTMDb('/tv/top_rated');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/:mediaType/:id', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const append = req.query.append_to_response || 'videos,credits';
    const data = await fetchFromTMDb(`/${mediaType}/${id}`, { append_to_response: append });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/:mediaType/:id/recommendations', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const data = await fetchFromTMDb(`/${mediaType}/${id}/recommendations`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tmdb/search/multi', async (req, res) => {
  try {
    const { query } = req.query;
    const data = await fetchFromTMDb('/search/multi', { query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OMDb Routes
app.get('/api/omdb', async (req, res) => {
  try {
    const data = await fetchFromOMDb(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fallback trending endpoint for backward compatibility
app.get('/api/trending', async (req, res) => {
  try {
    const data = await fetchFromTMDb('/trending/all/week');
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
