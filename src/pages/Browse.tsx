
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
import UserHistory from '@/components/UserHistory';
import { Badge } from '@/components/ui/badge';
import { Star, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Browse = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
  const [sortOption, setSortOption] = useState<'popularity' | 'rating' | 'recent'>('popularity');
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  
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

  // Function to sort and filter media items
  const sortAndFilterMedia = (items: Media[] | undefined) => {
    if (!items) return items;
    
    let filteredItems = [...items];
    
    // Apply genre filter
    if (genreFilter) {
      filteredItems = filteredItems.filter(item => 
        item.genres?.some(genre => genre.name === genreFilter) || 
        item.genre_ids?.includes(parseInt(genreFilter))
      );
    }
    
    // Apply year filter
    if (yearFilter) {
      filteredItems = filteredItems.filter(item => {
        const releaseYear = item.release_date 
          ? new Date(item.release_date).getFullYear() 
          : item.first_air_date 
            ? new Date(item.first_air_date).getFullYear() 
            : null;
        return releaseYear === yearFilter;
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'rating':
        filteredItems.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'recent':
        filteredItems.sort((a, b) => {
          const dateA = a.release_date || a.first_air_date || '';
          const dateB = b.release_date || b.first_air_date || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        break;
      // popularity is default and already sorted
    }
    
    return filteredItems;
  };

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
    
    const sortedItems = sortAndFilterMedia(items);
    
    if (sortedItems && sortedItems.length === 0) {
      return <div className="text-muted-foreground">No matching items found with current filters</div>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedItems && sortedItems.map((item) => (
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
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-yellow-500/90 text-white">
                    {item.vote_average.toFixed(1)}
                  </Badge>
                  {item.media_type && (
                    <Badge variant="outline" className="bg-black/50 text-white border-none">
                      {item.media_type === 'movie' ? 'Movie' : 'TV'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{item.title || item.name}</CardTitle>
              <CardDescription>
                {item.release_date || item.first_air_date 
                  ? new Date(item.release_date || item.first_air_date || '').getFullYear() 
                  : 'Unknown year'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.overview}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
              {item.genres && item.genres.slice(0, 3).map(genre => (
                <Badge key={genre.id} variant="outline" className="text-xs">
                  {genre.name}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  // Extract available genres from data
  const getAllGenres = () => {
    const allItems = [
      ...(trendingData || []),
      ...(popularMovies || []),
      ...(popularTVShows || [])
    ];
    
    const genreSet = new Set<string>();
    
    allItems.forEach(item => {
      if (item.genres) {
        item.genres.forEach(genre => {
          genreSet.add(genre.name);
        });
      }
    });
    
    return Array.from(genreSet).sort();
  };
  
  // Get available release years
  const getAvailableYears = () => {
    const allItems = [
      ...(trendingData || []),
      ...(popularMovies || []),
      ...(popularTVShows || [])
    ];
    
    const yearSet = new Set<number>();
    
    allItems.forEach(item => {
      const releaseYear = item.release_date 
        ? new Date(item.release_date).getFullYear() 
        : item.first_air_date 
          ? new Date(item.first_air_date).getFullYear() 
          : null;
      
      if (releaseYear) {
        yearSet.add(releaseYear);
      }
    });
    
    return Array.from(yearSet).sort((a, b) => b - a); // Sort descending
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero media={featuredMedia!} isLoading={trendingLoading} />
      
      {/* Content Sections */}
      <div className="container mx-auto px-4 py-10">
        {user && <UserHistory />}
        
        <div className="mt-10">
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold">Browse</h2>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="movies">Movies</TabsTrigger>
                  <TabsTrigger value="tv">TV Shows</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Genres</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-40 overflow-y-auto">
                      <DropdownMenuCheckboxItem
                        checked={genreFilter === null}
                        onCheckedChange={() => setGenreFilter(null)}
                      >
                        All Genres
                      </DropdownMenuCheckboxItem>
                      {getAllGenres().map(genre => (
                        <DropdownMenuCheckboxItem
                          key={genre}
                          checked={genreFilter === genre}
                          onCheckedChange={(checked) => checked ? setGenreFilter(genre) : setGenreFilter(null)}
                        >
                          {genre}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Release Year</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-40 overflow-y-auto">
                      <DropdownMenuCheckboxItem
                        checked={yearFilter === null}
                        onCheckedChange={() => setYearFilter(null)}
                      >
                        All Years
                      </DropdownMenuCheckboxItem>
                      {getAvailableYears().map(year => (
                        <DropdownMenuCheckboxItem
                          key={year}
                          checked={yearFilter === year}
                          onCheckedChange={(checked) => checked ? setYearFilter(year) : setYearFilter(null)}
                        >
                          {year}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setSortOption('popularity')}
                      className={sortOption === 'popularity' ? 'bg-muted' : ''}
                    >
                      Popularity
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortOption('rating')}
                      className={sortOption === 'rating' ? 'bg-muted' : ''}
                    >
                      Rating
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortOption('recent')}
                      className={sortOption === 'recent' ? 'bg-muted' : ''}
                    >
                      Most Recent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
