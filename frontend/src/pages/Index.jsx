
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTrending, Media } from '@/services/api';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MediaSlider from '@/components/MediaSlider';
import { Play, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredMedia, setFeaturedMedia] = useState(null);
  
  // Fetch trending content
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => fetchTrending(),
  });
  
  // Choose a random featured media from trending on component mount
  useEffect(() => {
    if (trendingData && trendingData.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(10, trendingData.length));
      setFeaturedMedia(trendingData[randomIndex]);
    }
  }, [trendingData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar is now fixed on top with z-index */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {featuredMedia ? (
          <Hero media={featuredMedia} isLoading={trendingLoading} />
        ) : (
          <div className="h-[100vh] relative flex items-center justify-end flex-col bg-slate-900">
            <div className="absolute inset-0 dark-overlay"></div>
            <div className="container mx-auto px-4 z-10 slide-up pb-32">
              <div className="max-w-3xl">
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 blue-glow uppercase">
                  Unlimited Entertainment
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Watch thousands of movies, TV shows, and documentaries instantly with PLEXSTREAM.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-500 hover:bg-blue-600 text-white group"
                    onClick={() => navigate(isAuthenticated ? '/browse' : '/register')}
                  >
                    <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" fill="white" />
                    {isAuthenticated ? 'Start Watching' : 'Join PLEXSTREAM'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => navigate('/pricing')}
                  >
                    <Info className="mr-2 h-5 w-5" />
                    View Plans
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* Movie/Show Sliders */}
      <section className="py-16 bg-background relative z-10 -mt-16">
        <div className="container mx-auto px-4">
          <MediaSlider 
            title="Trending Now" 
            media={trendingData || []} 
            isLoading={trendingLoading}
          />
          
          {/* Features Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose PLEXSTREAM?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Watch on Any Device</h3>
                <p className="text-muted-foreground">
                  Stream on your phone, tablet, laptop, and TV without paying more.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Experience stunning 4K Ultra HD with Dolby Atmos sound.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Multiple Profiles</h3>
                <p className="text-muted-foreground">
                  Create up to 5 profiles for different members of your household.
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="pt-16 pb-8 border-t border-slate-800 mt-16">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md p-1">
                    <div className="absolute inset-0 blur-sm bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md"></div>
                    <span className="relative z-10 text-white font-bold text-lg">P</span>
                  </div>
                  <span className="font-bold text-lg tracking-tight">
                    <span className="mr-1">PLEX</span>
                    <span className="text-blue-500 font-extrabold">STREAM</span>
                  </span>
                </div>
                <p className="text-muted-foreground mt-4 max-w-md">
                  PLEXSTREAM is a streaming service that offers a wide variety of TV shows, movies, anime, documentaries, and more.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">About Us</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Jobs</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">FAQ</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Help Center</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Terms of Use</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Privacy</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Connect</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Twitter</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Instagram</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-blue-400">Facebook</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800">
              <p className="text-center text-muted-foreground text-sm">
                © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Index;
