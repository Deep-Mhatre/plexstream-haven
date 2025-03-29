
import { MediaDetails } from './types';
import { fetchFromOMDB, processOMDBItem, fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch movie or TV show details from OMDB
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MediaDetails> => {
  try {
    // Fetch details from OMDB using the IMDB ID
    const data = await fetchFromOMDB({ i: id, plot: 'full' });
    
    // Process the basic media data
    const processedData = processOMDBItem(data, mediaType);
    
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
        results: []
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

// Get video URL for a media (still using TMDB for trailers as OMDB doesn't provide video links)
export const getVideoUrl = async (mediaType: 'movie' | 'tv', id: string, title: string): Promise<string | null> => {
  try {
    // First try TMDB videos
    const details = await fetchFromAPI(`/${mediaType}/${id}/videos`);
    const trailer = details.results?.find((video: any) => 
      video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    }
    
    // If no trailer found, search YouTube using the title as fallback
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return null;
  }
};
