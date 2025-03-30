
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserHistory } from '@/services/api/details';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface HistoryItem {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  title: string;
  timestamp: string;
}

const UserHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get user history
  const history = getUserHistory(user?.id || '');
  
  // Handle clear history
  const handleClearHistory = () => {
    try {
      if (!user?.id) return;
      
      localStorage.removeItem(`plexstream_history_${user.id}`);
      toast({
        title: "History cleared",
        description: "Your watch history has been cleared."
      });
      
      // Force re-render
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error clearing history",
        description: "There was an error clearing your history. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (history.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-medium mb-2">No watch history</h3>
        <p className="text-muted-foreground">Start watching movies and TV shows to build your history.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Continue Watching</h2>
        {history.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearHistory}
            className="flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {history.slice(0, 8).map((item: HistoryItem) => (
          <Card 
            key={item.mediaId} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/details/${item.mediaType}/${item.mediaId}`)}
          >
            <div className="relative h-40">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img 
                src={getImageUrl(`https://via.placeholder.com/500x281?text=${encodeURIComponent(item.title)}`)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/details/${item.mediaType}/${item.mediaId}`);
                  }}
                >
                  <Play className="h-4 w-4 fill-current" />
                </Button>
                <span className="text-white text-sm">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base truncate">{item.title}</CardTitle>
            </CardHeader>
            <CardFooter className="py-2 px-4 flex justify-between text-xs text-muted-foreground">
              <span>{item.mediaType === 'movie' ? 'Movie' : 'TV Show'}</span>
              <span>
                {new Date(item.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
