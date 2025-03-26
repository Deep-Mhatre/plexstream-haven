
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaDetails, getImageUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface FeaturedMediaProps {
  media: MediaDetails;
}

const FeaturedMedia = ({ media }: FeaturedMediaProps) => {
  const navigate = useNavigate();
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

  return (
    <div className="w-full bg-background relative">
      {/* Backdrop image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={getImageUrl(media.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60"></div>
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
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src={getImageUrl(media.poster_path, 'w500')}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          {/* Details */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              {title} {releaseYear && <span className="text-muted-foreground">({releaseYear})</span>}
            </h1>
            
            {media.tagline && (
              <p className="text-xl text-muted-foreground italic mb-6">"{media.tagline}"</p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="font-medium">{media.vote_average.toFixed(1)}</span>
              </div>
              
              {media.media_type === 'movie' && media.runtime && (
                <span className="text-muted-foreground">
                  {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
                </span>
              )}
              
              {media.media_type === 'tv' && media.number_of_seasons && (
                <span className="text-muted-foreground">
                  {media.number_of_seasons} {media.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                </span>
              )}
              
              <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                {media.media_type === 'movie' ? 'Movie' : 'TV Series'}
              </Badge>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {media.genres.map(genre => (
                <Badge key={genre.id} variant="secondary" className="rounded-full">
                  {genre.name}
                </Badge>
              ))}
            </div>
            
            <p className="text-base mb-8 max-w-3xl">
              {media.overview}
            </p>
            
            {director && (
              <p className="text-sm text-muted-foreground mb-6">
                <span className="font-medium">Director:</span> {director.name}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" className="group">
                <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Watch Now
              </Button>
              
              {trailer && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                  }}
                >
                  Watch Trailer
                </Button>
              )}
              
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <Plus className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
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
