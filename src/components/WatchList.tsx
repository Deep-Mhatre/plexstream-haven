
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WatchListItem {
  id: string;
  title: string;
  mediaType: 'movie' | 'tv';
  posterPath: string | null;
  addedAt: string;
}

const WatchList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [watchList, setWatchList] = useState<WatchListItem[]>([]);
  
  // Load watch list from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    
    try {
      const watchListKey = `plexstream_watchlist_${user.id}`;
      const storedWatchList = localStorage.getItem(watchListKey);
      
      if (storedWatchList) {
        setWatchList(JSON.parse(storedWatchList));
      }
    } catch (error) {
      console.error('Error loading watch list:', error);
    }
  }, [user?.id]);
  
  // Handle removing item from watch list
  const handleRemoveItem = (id: string) => {
    if (!user?.id) return;
    
    try {
      const updatedWatchList = watchList.filter(item => item.id !== id);
      setWatchList(updatedWatchList);
      
      const watchListKey = `plexstream_watchlist_${user.id}`;
      localStorage.setItem(watchListKey, JSON.stringify(updatedWatchList));
      
      toast({
        title: "Removed from Watch List",
        description: "The item has been removed from your watch list."
      });
    } catch (error) {
      console.error('Error removing item from watch list:', error);
      toast({
        title: "Error",
        description: "There was an error removing the item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle clearing the entire watch list
  const handleClearWatchList = () => {
    if (!user?.id) return;
    
    try {
      setWatchList([]);
      const watchListKey = `plexstream_watchlist_${user.id}`;
      localStorage.removeItem(watchListKey);
      
      toast({
        title: "Watch List Cleared",
        description: "Your watch list has been cleared."
      });
    } catch (error) {
      console.error('Error clearing watch list:', error);
      toast({
        title: "Error",
        description: "There was an error clearing your watch list. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (watchList.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-medium mb-2">Your watch list is empty</h3>
        <p className="text-muted-foreground mb-4">Add movies and TV shows to watch later.</p>
        <Button onClick={() => navigate("/browse")}>Browse Content</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Watch List</h2>
        {watchList.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearWatchList}
            className="flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            Clear List
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {watchList.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-40">
              <img 
                src={getImageUrl(item.posterPath || 
                  `https://via.placeholder.com/500x281?text=${encodeURIComponent(item.title)}`)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end p-3">
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    onClick={() => navigate(`/details/${item.mediaType}/${item.id}`)}
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base truncate cursor-pointer" onClick={() => navigate(`/details/${item.mediaType}/${item.id}`)}>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardFooter className="py-2 px-4 flex justify-between text-xs text-muted-foreground">
              <span>{item.mediaType === 'movie' ? 'Movie' : 'TV Show'}</span>
              <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WatchList;
