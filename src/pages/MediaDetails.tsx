
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Play, Plus, Star, Film, Video, Heart, BookmarkPlus, Share2, MessageCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  fetchMediaDetails, 
  fetchRecommendations, 
  getImageUrl, 
  getVideoUrl,
  trackMediaView
} from '@/services/api';
import { 
  addToWatchList, 
  removeFromWatchList, 
  isInWatchList 
} from '@/services/api/watchlist';
import { formatDate } from '@/lib/utils';
import VideoPlayer from '@/components/VideoPlayer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const MediaDetails = () => {
  const { mediaType, id } = useParams<{ mediaType: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [inWatchList, setInWatchList] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  
  // Check if media is in watch list
  useEffect(() => {
    if (user?.id && id) {
      setInWatchList(isInWatchList(user.id, id));
    }
  }, [user?.id, id]);
  
  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ['media', mediaType, id],
    queryFn: () => fetchMediaDetails(mediaType || 'movie', id || ''),
    enabled: !!mediaType && !!id,
  });
  
  const { data: recommendations, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: ['recommendations', mediaType, id],
    queryFn: () => fetchRecommendations(mediaType || 'movie', id || ''),
    enabled: !!mediaType && !!id,
  });

  // Fetch video URL if not available in media data
  useEffect(() => {
    const fetchVideo = async () => {
      if (media && (!media.videos || !media.videos.results || media.videos.results.length === 0)) {
        try {
          const url = await getVideoUrl(mediaType || 'movie', id || '', media.title || media.name || '');
          setVideoUrl(url);
        } catch (error) {
          console.error('Failed to fetch video URL:', error);
        }
      } else if (media?.videos?.results?.[0]?.key) {
        setVideoUrl(`https://www.youtube.com/watch?v=${media.videos.results[0].key}`);
      }
    };
    
    fetchVideo();
  }, [media, mediaType, id]);

  // Log user view to backend for recommendation system
  useEffect(() => {
    if (media && user?.id) {
      trackMediaView(
        user.id, 
        id || '', 
        mediaType as 'movie' | 'tv', 
        media.title || media.name || ''
      );
      
      try {
        // Also try to send to backend API if available
        fetch(`/api/history/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            mediaId: id, 
            mediaType, 
            title: media.title || media.name 
          })
        }).catch(err => console.error('Failed to log view history:', err));
      } catch (error) {
        // Ignore errors from history logging
      }
    }
  }, [media, id, mediaType, user?.id]);
  
  if (isMediaLoading || !media) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const handleBackClick = () => navigate(-1);
  
  const handleWatchNow = () => {
    setShowVideo(true);
    setIsFullscreenMode(true);
    toast({
      title: "Starting playback",
      description: `Now playing ${media.title || media.name}`,
    });
  };
  
  const handleWatchTrailer = () => {
    setShowVideo(true);
    setIsFullscreenMode(false);
    toast({
      title: "Playing trailer",
      description: `Trailer for ${media.title || media.name}`,
    });
  };
  
  const handleToggleWatchList = () => {
    if (!user?.id) {
      toast({
        title: "Login required",
        description: "Please login to add items to your watch list",
        variant: "destructive"
      });
      return;
    }
    
    if (inWatchList) {
      if (removeFromWatchList(user.id, id || '')) {
        setInWatchList(false);
        toast({
          title: "Removed from watch list",
          description: `${media.title || media.name} has been removed from your watch list`
        });
      }
    } else {
      if (addToWatchList(user.id, media)) {
        setInWatchList(true);
        toast({
          title: "Added to watch list",
          description: `${media.title || media.name} has been added to your watch list`
        });
      }
    }
  };
  
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: media.title || media.name || '',
        text: `Check out ${media.title || media.name} on PlexStream`,
        url: url
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard"
        });
      }).catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Failed to copy link",
          description: "Please try again or copy the URL manually",
          variant: "destructive"
        });
      });
    }
  };
  
  const handleRateMedia = (newRating: number) => {
    if (!user?.id) {
      toast({
        title: "Login required",
        description: "Please login to rate content",
        variant: "destructive"
      });
      return;
    }
    
    // Save rating to localStorage
    try {
      const ratingsKey = `plexstream_ratings_${user.id}`;
      const storedRatings = localStorage.getItem(ratingsKey);
      const ratings = storedRatings ? JSON.parse(storedRatings) : {};
      
      ratings[`${mediaType}_${id}`] = newRating;
      localStorage.setItem(ratingsKey, JSON.stringify(ratings));
      
      setRating(newRating);
      toast({
        title: "Rating saved",
        description: `You rated ${media.title || media.name} ${newRating}/10`
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error saving rating",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  // Get user's saved rating
  useEffect(() => {
    if (user?.id && mediaType && id) {
      try {
        const ratingsKey = `plexstream_ratings_${user.id}`;
        const storedRatings = localStorage.getItem(ratingsKey);
        
        if (storedRatings) {
          const ratings = JSON.parse(storedRatings);
          const savedRating = ratings[`${mediaType}_${id}`];
          
          if (savedRating) {
            setRating(savedRating);
          }
        }
      } catch (error) {
        console.error('Error loading rating:', error);
      }
    }
  }, [user?.id, mediaType, id]);
  
  const title = media.title || media.name || '';
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : 
                     media.first_air_date ? new Date(media.first_air_date).getFullYear() : '';
  
  const backdropUrl = getImageUrl(media.backdrop_path || media.poster_path);
  const posterUrl = getImageUrl(media.poster_path);
  
  const renderCast = () => {
    if (!media.credits || !media.credits.cast || media.credits.cast.length === 0) {
      return <p>No cast information available</p>;
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.credits.cast.slice(0, 8).map(person => (
          <div key={person.id} className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary mb-2">
              {person.profile_path ? (
                <img 
                  src={getImageUrl(person.profile_path, 'w185')} 
                  alt={person.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <p className="font-medium text-sm">{person.name}</p>
            <p className="text-xs text-muted-foreground">{person.character}</p>
          </div>
        ))}
      </div>
    );
  };
  
  const renderCrew = () => {
    if (!media.credits || !media.credits.crew || media.credits.crew.length === 0) {
      return <p>No crew information available</p>;
    }
    
    // Group crew by department
    const departments: Record<string, Array<typeof media.credits.crew[0]>> = {};
    media.credits.crew.forEach(person => {
      if (!departments[person.department]) {
        departments[person.department] = [];
      }
      departments[person.department].push(person);
    });
    
    return (
      <div className="space-y-6">
        {Object.entries(departments).map(([department, people]) => (
          <div key={department}>
            <h3 className="text-lg font-semibold mb-4">{department}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {people.slice(0, 6).map(person => (
                <div key={person.id} className="space-y-1">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.job}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderUserRating = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Rate This {mediaType === 'movie' ? 'Movie' : 'Show'}</h3>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              onClick={() => handleRateMedia(star)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                rating && star <= rating 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {star}
            </button>
          ))}
          {rating && (
            <span className="ml-4 text-sm">
              Your rating: <strong>{rating}/10</strong>
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">User Reviews</h3>
          <Button variant="outline" size="sm">Write a Review</Button>
        </div>
        
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-muted-foreground mb-3">
            No reviews for this {mediaType === 'movie' ? 'movie' : 'show'} yet.
          </p>
          <Button variant="secondary">Be the first to review</Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Hero section with backdrop */}
      <div 
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 pt-24">
          <Button
            variant="ghost" 
            size="icon"
            className="absolute top-4 left-4 rounded-full bg-background/50 hover:bg-background/70"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={posterUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {title} {releaseYear ? `(${releaseYear})` : ''}
                </h1>
                {media.tagline && (
                  <p className="mt-2 italic text-muted-foreground">{media.tagline}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{media.vote_average ? media.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                
                <Separator orientation="vertical" className="h-5" />
                
                {media.release_date && (
                  <>
                    <span>{formatDate(media.release_date)}</span>
                    <Separator orientation="vertical" className="h-5" />
                  </>
                )}
                
                {media.first_air_date && (
                  <>
                    <span>{formatDate(media.first_air_date)}</span>
                    <Separator orientation="vertical" className="h-5" />
                  </>
                )}
                
                {media.runtime && (
                  <span>{Math.floor(media.runtime / 60)}h {media.runtime % 60}m</span>
                )}
                
                {media.number_of_seasons && (
                  <span>{media.number_of_seasons} {media.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {media.genres?.map(genre => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  className="gap-2 bg-red-600 hover:bg-red-700 text-white" 
                  onClick={handleWatchNow}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={handleWatchTrailer}
                >
                  <Film className="h-4 w-4" />
                  Watch Trailer
                </Button>
                
                <Button 
                  variant={inWatchList ? "default" : "secondary"} 
                  className="gap-2"
                  onClick={handleToggleWatchList}
                >
                  {inWatchList ? (
                    <>
                      <BookmarkPlus className="h-4 w-4" />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add to List
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <Button 
              className="absolute top-2 right-2 z-10" 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowVideo(false)}
            >
              Close
            </Button>
            <div className="aspect-video w-full">
              <VideoPlayer 
                videoUrl={videoUrl || 
                  (media.videos?.results?.[0]?.key ? 
                    `https://www.youtube.com/watch?v=${media.videos.results[0].key}` : 
                    undefined)
                }
                thumbnailUrl={backdropUrl}
                title={title}
                autoPlay={true}
                onClose={() => setShowVideo(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Details tabs section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed">{media.overview || 'No overview available.'}</p>
              
              {renderUserRating()}
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button className="gap-2" onClick={handleWatchNow}>
                  <Play className="h-4 w-4 fill-current" />
                  Watch Now
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="secondary" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cast" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Cast</h2>
              {renderCast()}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Crew</h2>
              {renderCrew()}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {renderReviews()}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-8">
            <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
            {isRecommendationsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] rounded-lg w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendations.slice(0, 12).map(item => (
                  <div 
                    key={item.id} 
                    className="movie-card cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden">
                      <img 
                        src={getImageUrl(item.poster_path)} 
                        alt={item.title || item.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mt-2 font-medium truncate">{item.title || item.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recommendations available</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MediaDetails;
