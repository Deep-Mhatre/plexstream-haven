
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaDetails, getImageUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Play, Plus, ThumbsUp, Info, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FeaturedMediaProps {
  media: MediaDetails;
  onPlay?: () => void;
}

const FeaturedMedia = ({ media, onPlay }: FeaturedMediaProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const title = media.title || media.name || '';
  
  const releaseYear = media.release_date 
    ? new Date(media.release_date).getFullYear() 
    : media.first_air_date 
      ? new Date(media.first_air_date).getFullYear() 
      : '';
      
  const director = media.credits?.crew.find(person => person.job === 'Director');
  const trailer = media.videos?.results.find(video => 
    video.site === 'YouTube' && 
    (video.type === 'Trailer' || video.type === 'Teaser')
  );

  const handleAddToList = () => {
    toast({
      title: "Added to My List",
      description: `${title} has been added to your list.`,
      variant: "default",
    });
  };

  const handleLike = () => {
    toast({
      title: "Rated",
      description: `You liked ${title}.`,
      variant: "default",
    });
  };

  return (
    <div className="w-full bg-background relative">
      {/* Backdrop image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={getImageUrl(media.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div 
            className="w-48 md:w-72 mx-auto md:mx-0 flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl relative group">
              <img
                src={getImageUrl(media.poster_path, 'w500')}
                alt={title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={onPlay}
                >
                  <Play className="mr-2 h-4 w-4" fill="currentColor" />
                  Play
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Details */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={cn(
                "px-2 py-0.5 text-xs font-bold text-white",
                media.media_type === 'movie' ? "bg-blue-500" : "bg-purple-500"
              )}>
                {media.media_type === 'movie' ? 'MOVIE' : 'TV SERIES'}
              </div>
              {media.vote_average > 7.5 && (
                <div className="px-2 py-0.5 bg-yellow-500 text-xs font-bold text-black">
                  TOP RATED
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-balance">
              {title} {releaseYear && <span className="text-white/70">({releaseYear})</span>}
            </h1>
            
            {media.tagline && (
              <p className="text-xl text-white/80 italic mb-6">"{media.tagline}"</p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center bg-primary/20 text-primary px-3 py-1 rounded-full">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{media.vote_average.toFixed(1)}</span>
              </div>
              
              {media.media_type === 'movie' && media.runtime && (
                <span className="text-white/70 bg-white/10 px-3 py-1 rounded-full text-sm">
                  {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
                </span>
              )}
              
              {media.media_type === 'tv' && media.number_of_seasons && (
                <span className="text-white/70 bg-white/10 px-3 py-1 rounded-full text-sm">
                  {media.number_of_seasons} {media.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                </span>
              )}
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {media.genres.map(genre => (
                <Badge key={genre.id} variant="outline" className="bg-white/5 text-white/90 border-white/20 hover:bg-white/10">
                  {genre.name}
                </Badge>
              ))}
            </div>
            
            <p className="text-base text-white/90 mb-8 max-w-3xl">
              {media.overview}
            </p>
            
            {director && (
              <p className="text-sm text-white/70 mb-6">
                <span className="font-medium">Director:</span> {director.name}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white group" onClick={onPlay}>
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" fill="white" />
                Watch Now
              </Button>
              
              {trailer && (
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                  }}
                >
                  <Info className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-11 w-11 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={handleAddToList}
              >
                <Plus className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-11 w-11 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={handleLike}
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMedia;
