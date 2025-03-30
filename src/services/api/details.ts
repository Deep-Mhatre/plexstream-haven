import { MediaDetails } from './types';
import { fetchFromOMDB, processOMDBItem, fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch movie or TV show details from OMDB
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MediaDetails> => {
  try {
    // Fetch details from OMDB using the IMDB ID
    const data = await fetchFromOMDB({ i: id, plot: 'full' });
    
    if (!data || data.Response === "False") {
      throw new Error(data?.Error || "Failed to fetch media details");
    }
    
    // Process the basic media data
    const processedData = processOMDBItem(data, mediaType);
    
    // Get video URL for trailers
    const videoUrl = await getVideoUrl(mediaType, id, data.Title);
    
    // Add additional details specific to MediaDetails type
    return {
      ...processedData,
      genres: data.Genre ? data.Genre.split(',').map((name: string, id: number) => ({ 
        id, 
        name: name.trim() 
      })) : [],
      status: 'Released',
      tagline: data.Awards !== "N/A" ? data.Awards : "",
      runtime: data.Runtime !== "N/A" ? parseInt(data.Runtime) : 0,
      production_companies: [],
      credits: {
        cast: data.Actors !== "N/A" ? data.Actors.split(',').map((name: string, id: number) => ({ 
          id, 
          name: name.trim(),
          character: "",
          profile_path: null
        })) : [],
        crew: data.Director !== "N/A" ? [{ 
          id: 1, 
          name: data.Director, 
          job: "Director",
          department: "Directing", 
          profile_path: null
        }] : []
      },
      videos: {
        results: videoUrl ? [
          {
            id: '1',
            key: videoUrl.includes('youtube.com/watch?v=') ? 
              videoUrl.split('youtube.com/watch?v=')[1] : 
              'trailer',
            name: 'Trailer',
            site: 'YouTube',
            type: 'Trailer',
            official: true
          }
        ] : []
      },
      number_of_seasons: mediaType === 'tv' && data.totalSeasons !== "N/A" ? 
        parseInt(data.totalSeasons) : undefined,
      number_of_episodes: undefined
    };
  } catch (error) {
    console.error('Media details fetch error:', error);
    
    // Return fallback data
    const fallbackDetail = {
      ...FALLBACK_MEDIA.find(item => item.media_type === mediaType) as any,
      genres: [{ id: 1, name: 'Drama' }],
      status: 'Released',
      production_companies: [],
      credits: {
        cast: [],
        crew: []
      },
      videos: {
        results: []
      }
    };
    
    return fallbackDetail;
  }
};

// Fetch recommendations based on a movie or TV show (using OMDB similar genre search)
export const fetchRecommendations = async (mediaType: 'movie' | 'tv', id: string): Promise<any[]> => {
  try {
    // First get the details to extract genre
    const details = await fetchMediaDetails(mediaType, id);
    const genre = details.genres && details.genres.length > 0 ? details.genres[0].name : 'drama';
    
    // Search for similar content using the first genre
    const data = await fetchFromOMDB({ s: genre, type: mediaType === 'movie' ? 'movie' : 'series' });
    
    if (data.Search && data.Search.length > 0) {
      // Filter out the current media from recommendations
      return data.Search
        .filter((item: any) => item.imdbID !== id)
        .map((item: any) => processOMDBItem(item, mediaType));
    }
    
    return FALLBACK_MEDIA.filter(item => item.media_type === mediaType);
  } catch (error) {
    console.error('Recommendations fetch error:', error);
    return FALLBACK_MEDIA.filter(item => item.media_type === mediaType);
  }
};

// Improved video URL fetching with multiple fallbacks
export const getVideoUrl = async (mediaType: 'movie' | 'tv', id: string, title: string): Promise<string | null> => {
  try {
    // Try multiple strategies to get a valid video URL
    
    // Strategy 1: Try TMDB API if ID is a TMDB ID or we can find a TMDB ID
    if (!id.startsWith('tt')) {
      // Direct TMDB ID, fetch videos directly
      try {
        const videosData = await fetchFromAPI(`/${mediaType}/${id}/videos`);
        if (videosData?.results && videosData.results.length > 0) {
          const trailer = videosData.results.find((video: any) => 
            video.site === 'YouTube' && 
            (video.type === 'Trailer' || video.type === 'Teaser')
          );
          
          if (trailer && trailer.key) {
            return `https://www.youtube.com/watch?v=${trailer.key}`;
          }
        }
      } catch (error) {
        console.error('TMDB direct videos fetch error:', error);
      }
    } else {
      // IMDB ID, try to find corresponding TMDB content first
      try {
        const searchQuery = encodeURIComponent(title);
        const searchResults = await fetchFromAPI(`/search/${mediaType}?query=${searchQuery}`);
        
        if (searchResults?.results && searchResults.results.length > 0) {
          const tmdbId = searchResults.results[0].id;
          const videosData = await fetchFromAPI(`/${mediaType}/${tmdbId}/videos`);
          
          if (videosData?.results && videosData.results.length > 0) {
            const trailer = videosData.results.find((video: any) => 
              video.site === 'YouTube' && 
              (video.type === 'Trailer' || video.type === 'Teaser')
            );
            
            if (trailer && trailer.key) {
              return `https://www.youtube.com/watch?v=${trailer.key}`;
            }
          }
        }
      } catch (error) {
        console.error('TMDB search and videos fetch error:', error);
      }
    }
    
    // Strategy 2: Try direct YouTube search with specific parameters
    const year = new Date().getFullYear();
    const exactSearchQuery = `${title} ${mediaType === 'movie' ? 'movie' : 'tv'} trailer ${year} official`;
    
    // Return YouTube search URL
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(exactSearchQuery)}`;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    
    // Final fallback - just search for the title
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`;
  }
};

// New function to track user viewing history
export const trackMediaView = async (userId: string, mediaId: string, mediaType: 'movie' | 'tv', title: string): Promise<void> => {
  try {
    if (!userId || !mediaId) return;
    
    const historyItem = {
      userId,
      mediaId,
      mediaType,
      title,
      timestamp: new Date().toISOString()
    };
    
    // Save to local storage for now (can be replaced with API call later)
    const historyKey = `plexstream_history_${userId}`;
    const historyJson = localStorage.getItem(historyKey);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    // Remove duplicate if exists
    const updatedHistory = history.filter((item: any) => item.mediaId !== mediaId);
    updatedHistory.unshift(historyItem); // Add to beginning
    
    // Keep only last 50 items
    if (updatedHistory.length > 50) {
      updatedHistory.pop();
    }
    
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error tracking media view:', error);
  }
};

// New function to get user viewing history
export const getUserHistory = (userId: string): any[] => {
  try {
    if (!userId) return [];
    
    const historyKey = `plexstream_history_${userId}`;
    const historyJson = localStorage.getItem(historyKey);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting user history:', error);
    return [];
  }
};
