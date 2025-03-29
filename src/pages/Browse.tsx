
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchTrending, 
  fetchPopularMovies, 
  fetchPopularTVShows, 
  fetchTopRatedMovies, 
  fetchTopRatedTVShows,
  Media
} from '@/services/api';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect as useReactEffect } from 'react';

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
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => fetchTrending(),
  });
  
  // Fetch popular movies
  const { data: popularMovies, isLoading: popularMoviesLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => fetchPopularMovies(),
  });
  
  // Fetch popular TV shows
  const { data: popularTVShows, isLoading: popularTVShowsLoading } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: () => fetchPopularTVShows(),
  });
  
  // Fetch top rated movies
  const { data: topRatedMovies, isLoading: topRatedMoviesLoading } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => fetchTopRatedMovies(),
  });
  
  // Fetch top rated TV shows
  const { data: topRatedTVShows, isLoading: topRatedTVShowsLoading } = useQuery({
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
            {trendingData && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(trendingData, null, 2)}
                </pre>
              </div>
            )}
            
            {popularMovies && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(popularMovies, null, 2)}
                </pre>
              </div>
            )}
            
            {popularTVShows && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Popular TV Shows</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(popularTVShows, null, 2)}
                </pre>
              </div>
            )}
            
            {topRatedMovies && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Top Rated Movies</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(topRatedMovies, null, 2)}
                </pre>
              </div>
            )}
            
            {topRatedTVShows && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Top Rated TV Shows</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(topRatedTVShows, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="movies" className="space-y-10">
            {popularMovies && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(popularMovies, null, 2)}
                </pre>
              </div>
            )}
            
            {topRatedMovies && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Top Rated Movies</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(topRatedMovies, null, 2)}
                </pre>
              </div>
            )}
            
            {trendingData && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Trending Movies</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(trendingData.filter(item => item.media_type === 'movie'), null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tv" className="space-y-10">
            {popularTVShows && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Popular TV Shows</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(popularTVShows, null, 2)}
                </pre>
              </div>
            )}
            
            {topRatedTVShows && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Top Rated TV Shows</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(topRatedTVShows, null, 2)}
                </pre>
              </div>
            )}
            
            {trendingData && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Trending TV Shows</h2>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(trendingData.filter(item => item.media_type === 'tv'), null, 2)}
                </pre>
              </div>
            )}
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
