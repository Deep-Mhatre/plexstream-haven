
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
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
  
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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {featuredMedia ? (
          <Hero media={featuredMedia} isLoading={trendingLoading} />
        ) : (
          <div className="h-[85vh] relative flex items-center bg-slate-900">
            <div className="absolute inset-0 hero-gradient"></div>
            <div className="container mx-auto px-4 z-10 slide-up">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Unlimited movies, TV shows, and more
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Watch anywhere. Cancel anytime. Premium streaming experience with PLEXSTREAM.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 group"
                    onClick={() => navigate(isAuthenticated ? '/browse' : '/register')}
                  >
                    <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
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
      
      {/* Content Previews */}
      <section className="py-16 bg-background">
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
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Experience stunning 4K Ultra HD with Dolby Atmos sound.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            
            <div className="text-center mt-16">
              <Button 
                size="lg" 
                onClick={() => navigate('/pricing')}
                className="animate-pulse-subtle"
              >
                View Our Plans
              </Button>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">What is PLEXSTREAM?</h3>
                <p className="text-muted-foreground">
                  PLEXSTREAM is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">How much does PLEXSTREAM cost?</h3>
                <p className="text-muted-foreground">
                  Watch PLEXSTREAM on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹99 to ₹299 a month. No extra costs, no contracts.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Where can I watch?</h3>
                <p className="text-muted-foreground">
                  Watch anywhere, anytime. Sign in with your PLEXSTREAM account to watch instantly on the web at plexstream.com from your personal computer or on any internet-connected device.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">How do I cancel?</h3>
                <p className="text-muted-foreground">
                  PLEXSTREAM is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-6">
                Ready to watch? Join PLEXSTREAM today and start streaming.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate(isAuthenticated ? '/browse' : '/register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="bg-primary rounded-sm p-1">
                  <span className="text-white font-bold text-lg">PLEX</span>
                </div>
                <span className="font-bold text-lg tracking-tight">STREAM</span>
              </div>
              <p className="text-muted-foreground mt-4 max-w-md">
                PLEXSTREAM is a streaming service that offers a wide variety of TV shows, movies, anime, documentaries, and more.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Jobs</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Use</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
