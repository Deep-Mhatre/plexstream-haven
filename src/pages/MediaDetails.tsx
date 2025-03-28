
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Play, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { fetchMediaDetails, fetchRecommendations, getImageUrl } from '@/services/api';
import { formatDate } from '@/lib/utils';
import VideoPlayer from '@/components/VideoPlayer';

const MediaDetails = () => {
  const { mediaType, id } = useParams<{ mediaType: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  
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

  // Log user view to backend for recommendation system
  useEffect(() => {
    if (media) {
      fetch(`/api/history/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: id, mediaType, title: media.title || media.name })
      }).catch(err => console.error('Failed to log view history:', err));
    }
  }, [media, id, mediaType]);
  
  if (isMediaLoading || !media) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const handleBackClick = () => navigate(-1);
  
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
                  <span className="font-semibold">{media.vote_average.toFixed(1)}</span>
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
                  <span
                    key={genre.id}
                    className="px-2 py-1 bg-secondary rounded-full text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4 pt-2">
                <Button className="gap-2" onClick={() => setShowVideo(true)}>
                  <Play className="h-4 w-4" />
                  Watch Trailer
                </Button>
                <Button variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to List
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
              <VideoPlayer />
            </div>
          </div>
        </div>
      )}
      
      {/* Details tabs section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cast">Cast</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed">{media.overview || 'No overview available.'}</p>
            </div>
            
            {recommendations && recommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.slice(0, 6).map(item => (
                    <div 
                      key={item.id} 
                      className="movie-card cursor-pointer"
                      onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <img 
                          src={getImageUrl(item.poster_path)} 
                          alt={item.title || item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="mt-2 font-medium truncate">{item.title || item.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cast">
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            {renderCast()}
          </TabsContent>
          
          <TabsContent value="crew">
            <h2 className="text-2xl font-bold mb-6">Crew</h2>
            {renderCrew()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MediaDetails;
