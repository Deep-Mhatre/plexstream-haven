
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { Media, getImageUrl } from '@/services/api';

interface HeroProps {
  media?: Media;
  isLoading?: boolean;
}

const Hero = ({ media, isLoading = false }: HeroProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="w-full h-[85vh] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={getImageUrl(media.backdrop_path, 'original')} 
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
            {title}
          </h1>
          
          <div className="flex items-center text-white/80 text-sm md:text-base mb-6 space-x-4">
            {releaseYear && <span>{releaseYear}</span>}
            <span className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              {media.vote_average.toFixed(1)}
            </span>
            <span className="px-2 py-1 bg-white/10 rounded text-white text-xs">
              {media.media_type === 'movie' ? 'Movie' : 'TV Series'}
            </span>
          </div>
          
          <p className="text-white/90 text-sm md:text-base mb-8 line-clamp-3">
            {media.overview}
          </p>
          
          <div className="flex flex-wrap items-center space-x-4">
            <Button 
              size="lg"
              className="bg-white hover:bg-white/90 text-primary font-medium group"
              onClick={() => navigate(`/details/${media.media_type}/${media.id}`)}
            >
              <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Watch Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate(`/details/${media.media_type}/${media.id}`)}
            >
              <Info className="mr-2 h-4 w-4" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
