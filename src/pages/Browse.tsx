
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchTrending, 
  fetchPopularMovies, 
  fetchPopularTVShows, 
  fetchTopRatedMovies, 
  fetchTopRatedTVShows,
  Media,
  getImageUrl
} from '@/services/api';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect as useReactEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Browse = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
  
  // Redirect if not authenticated
  useReactEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch trending content
  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['trending'],
    queryFn: () => fetchTrending(),
  });
  
  // Fetch popular movies
  const { data: popularMovies, isLoading: popularMoviesLoading, error: popularMoviesError } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => fetchPopularMovies(),
  });
  
  // Fetch popular TV shows
  const { data: popularTVShows, isLoading: popularTVShowsLoading, error: popularTVShowsError } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: () => fetchPopularTVShows(),
  });
  
  // Fetch top rated movies
  const { data: topRatedMovies, isLoading: topRatedMoviesLoading, error: topRatedMoviesError } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => fetchTopRatedMovies(),
  });
  
  // Fetch top rated TV shows
  const { data: topRatedTVShows, isLoading: topRatedTVShowsLoading, error: topRatedTVShowsError } = useQuery({
    queryKey: ['topRatedTVShows'],
    queryFn: () => fetchTopRatedTVShows(),
  });
  
  // Choose a random featured media from trending on component mount
  useEffect(() => {
    if (trendingData && trendingData.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(10, trendingData.length));
      setFeaturedMedia(trendingData[randomIndex]);
    }
  }, [trendingData]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // Update featured media based on selected tab
    if (value === 'movies' && popularMovies && popularMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, popularMovies.length));
      setFeaturedMedia(popularMovies[randomIndex]);
    } else if (value === 'tv' && popularTVShows && popularTVShows.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, popularTVShows.length));
      setFeaturedMedia(popularTVShows[randomIndex]);
    } else if (trendingData && trendingData.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(10, trendingData.length));
      setFeaturedMedia(trendingData[randomIndex]);
    }
  };
  
  if (!isAuthenticated) {
    return null; // Don't render the page if not authenticated
  }

  // Helper function to render media items
  const renderMediaItems = (items: Media[] | undefined, isLoading: boolean, error: Error | null) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">Failed to load data: {error.message}</div>;
    }
    
    if (!items || items.length === 0) {
      return <div className="text-muted-foreground">No items found</div>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
          >
            <div className="relative h-40 bg-muted">
              <img 
                src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')} 
                alt={item.title || item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{item.title || item.name}</CardTitle>
              <CardDescription>
                {item.release_date || item.first_air_date 
                  ? new Date(item.release_date || item.first_air_date || '').getFullYear() 
                  : 'Unknown year'}
                 • {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.overview}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-sm">{item.vote_average.toFixed(1)}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero media={featuredMedia!} isLoading={trendingLoading} />
      
      {/* Content Sections */}
      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Browse</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-10">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
              {renderMediaItems(trendingData, trendingLoading, trendingError)}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
              {renderMediaItems(popularMovies, popularMoviesLoading, popularMoviesError)}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Popular TV Shows</h2>
              {renderMediaItems(popularTVShows, popularTVShowsLoading, popularTVShowsError)}
            </div>
          </TabsContent>
          
          <TabsContent value="movies" className="space-y-10">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
              {renderMediaItems(popularMovies, popularMoviesLoading, popularMoviesError)}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Top Rated Movies</h2>
              {renderMediaItems(topRatedMovies, topRatedMoviesLoading, topRatedMoviesError)}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Trending Movies</h2>
              {trendingData ? 
                renderMediaItems(
                  trendingData.filter(item => item.media_type === 'movie'), 
                  trendingLoading, 
                  trendingError
                ) : 
                renderMediaItems([], trendingLoading, trendingError)
              }
            </div>
          </TabsContent>
          
          <TabsContent value="tv" className="space-y-10">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Popular TV Shows</h2>
              {renderMediaItems(popularTVShows, popularTVShowsLoading, popularTVShowsError)}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Top Rated TV Shows</h2>
              {renderMediaItems(topRatedTVShows, topRatedTVShowsLoading, topRatedTVShowsError)}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Trending TV Shows</h2>
              {trendingData ? 
                renderMediaItems(
                  trendingData.filter(item => item.media_type === 'tv'), 
                  trendingLoading, 
                  trendingError
                ) : 
                renderMediaItems([], trendingLoading, trendingError)
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary rounded-sm p-1">
                <span className="text-white font-bold text-lg">PLEX</span>
              </div>
              <span className="font-bold text-lg tracking-tight">STREAM</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Use</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</a>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Browse;
