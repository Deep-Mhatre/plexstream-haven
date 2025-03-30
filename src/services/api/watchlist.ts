
import { Media } from './types';

export interface WatchListItem {
  id: string;
  title: string;
  mediaType: 'movie' | 'tv';
  posterPath: string | null;
  addedAt: string;
}

// Add media to watch list
export const addToWatchList = (userId: string, media: Media): boolean => {
  try {
    if (!userId || !media) return false;
    
    const watchListItem: WatchListItem = {
      id: media.id,
      title: media.title || media.name || '',
      mediaType: media.media_type as 'movie' | 'tv',
      posterPath: media.poster_path,
      addedAt: new Date().toISOString()
    };
    
    const watchListKey = `plexstream_watchlist_${userId}`;
    const storedWatchList = localStorage.getItem(watchListKey);
    let watchList: WatchListItem[] = storedWatchList ? JSON.parse(storedWatchList) : [];
    
    // Check if already in watch list
    if (watchList.some(item => item.id === media.id)) {
      return false; // Already exists
    }
    
    // Add to watch list
    watchList.push(watchListItem);
    localStorage.setItem(watchListKey, JSON.stringify(watchList));
    
    return true;
  } catch (error) {
    console.error('Error adding to watch list:', error);
    return false;
  }
};

// Remove media from watch list
export const removeFromWatchList = (userId: string, mediaId: string): boolean => {
  try {
    if (!userId || !mediaId) return false;
    
    const watchListKey = `plexstream_watchlist_${userId}`;
    const storedWatchList = localStorage.getItem(watchListKey);
    
    if (!storedWatchList) return false;
    
    let watchList: WatchListItem[] = JSON.parse(storedWatchList);
    
    // Filter out the item
    const updatedWatchList = watchList.filter(item => item.id !== mediaId);
    
    if (updatedWatchList.length === watchList.length) {
      return false; // Item was not in the list
    }
    
    localStorage.setItem(watchListKey, JSON.stringify(updatedWatchList));
    return true;
  } catch (error) {
    console.error('Error removing from watch list:', error);
    return false;
  }
};

// Get user's watch list
export const getWatchList = (userId: string): WatchListItem[] => {
  try {
    if (!userId) return [];
    
    const watchListKey = `plexstream_watchlist_${userId}`;
    const storedWatchList = localStorage.getItem(watchListKey);
    
    return storedWatchList ? JSON.parse(storedWatchList) : [];
  } catch (error) {
    console.error('Error getting watch list:', error);
    return [];
  }
};

// Check if media is in watch list
export const isInWatchList = (userId: string, mediaId: string): boolean => {
  try {
    if (!userId || !mediaId) return false;
    
    const watchList = getWatchList(userId);
    return watchList.some(item => item.id === mediaId);
  } catch (error) {
    console.error('Error checking watch list:', error);
    return false;
  }
};

// Clear watch list
export const clearWatchList = (userId: string): boolean => {
  try {
    if (!userId) return false;
    
    const watchListKey = `plexstream_watchlist_${userId}`;
    localStorage.removeItem(watchListKey);
    
    return true;
  } catch (error) {
    console.error('Error clearing watch list:', error);
    return false;
  }
};
