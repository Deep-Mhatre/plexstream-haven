
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Info, Plus, Volume2, VolumeX } from 'lucide-react';
import { Media, getImageUrl } from '@/services/api';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HeroProps {
  media?: Media;
  isLoading?: boolean;
}

const Hero = ({ media, isLoading = false }: HeroProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(true);

  // If no media is provided or loading, show a placeholder/loading state
  if (isLoading || !media) {
    return (
      <div className="w-full h-[85vh] bg-slate-900 relative flex items-center justify-center">
        <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center">
          <div className="animate-pulse w-1/2 h-12 bg-slate-700 rounded mb-4"></div>
          <div className="animate-pulse w-3/4 h-6 bg-slate-700 rounded mb-2"></div>
          <div className="animate-pulse w-2/3 h-6 bg-slate-700 rounded mb-6"></div>
          <div className="flex space-x-4 justify-center">
            <div className="animate-pulse w-32 h-10 bg-slate-700 rounded"></div>
            <div className="animate-pulse w-32 h-10 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const title = media.title || media.name || '';
  const releaseYear = media.release_date 
    ? new Date(media.release_date).getFullYear() 
    : media.first_air_date 
      ? new Date(media.first_air_date).getFullYear() 
      : '';

  const handleWatchNow = () => {
    navigate(`/details/${media.media_type}/${media.id}`);
  };

  const handleAddToList = () => {
    toast({
      title: "Added to My List",
      description: `${title} has been added to your list.`,
      variant: "default",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full h-[85vh] relative overflow-hidden">
      {/* Video Background (simulated) */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={getImageUrl(media.backdrop_path, 'original')} 
          alt={title}
          className="w-full h-full object-cover object-center brightness-[0.7] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-primary px-2 py-0.5 rounded text-white text-xs font-bold">NEW</div>
            <div className="text-xs font-semibold text-white/80">TOP 10 TODAY</div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 text-balance">
            {title}
          </h1>
          
          <div className="flex items-center text-white/80 text-sm md:text-base mb-4 space-x-4">
            {releaseYear && <span className="font-medium text-primary">{releaseYear}</span>}
            <span className="flex items-center bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="font-medium">{media.vote_average.toFixed(1)}</span>
            </span>
            <span className={cn(
              "px-2 py-1 rounded text-white text-xs font-bold",
              media.media_type === 'movie' ? "bg-blue-500" : "bg-purple-500"
            )}>
              {media.media_type === 'movie' ? 'MOVIE' : 'TV SERIES'}
            </span>
          </div>
          
          <p className="text-white/90 text-base md:text-lg mb-8 line-clamp-3 max-w-3xl drop-shadow-md">
            {media.overview}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-medium group"
              onClick={handleWatchNow}
            >
              <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" fill="white" />
              Watch Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate(`/details/${media.media_type}/${media.id}`)}
            >
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-white/30 text-white hover:bg-white/10"
              onClick={handleAddToList}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-white/30 text-white hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Age rating and genre pills */}
      <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4 z-10">
        <div className="flex items-center space-x-3">
          <span className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-xs">
            16+
          </span>
          <div className="flex flex-wrap gap-2">
            {["Action", "Drama", "Sci-Fi"].map((genre) => (
              <span key={genre} className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-md text-white/90 text-xs">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
