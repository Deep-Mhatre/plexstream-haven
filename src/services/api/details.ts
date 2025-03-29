
import { MediaDetails } from './types';
import { fetchFromAPI } from './utils';
import { FALLBACK_MEDIA } from './config';

// Fetch movie or TV show details
export const fetchMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MediaDetails> => {
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
  
  return await fetchFromAPI(`/${mediaType}/${id}?append_to_response=credits,videos`, fallbackDetail);
};

// Fetch recommendations based on a movie or TV show
export const fetchRecommendations = async (mediaType: 'movie' | 'tv', id: string): Promise<any[]> => {
  const fallbackData = { 
    results: FALLBACK_MEDIA.filter(item => item.media_type === mediaType)
  };
  const data = await fetchFromAPI(`/${mediaType}/${id}/recommendations`, fallbackData);
  return data.results || [];
};

// Get video URL from TMDB
export const getVideoUrl = async (mediaType: 'movie' | 'tv', id: string, title: string): Promise<string | null> => {
  try {
    // First try TMDB videos
    const details = await fetchMediaDetails(mediaType, id);
    const trailer = details.videos?.results.find(video => 
      video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return null;
  }
};
