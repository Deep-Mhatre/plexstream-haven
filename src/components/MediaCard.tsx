
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Media, getImageUrl } from '@/services/api';
import { Play, Info, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface MediaCardProps {
  media: Media;
  size?: 'small' | 'medium' | 'large';
}

const MediaCard = ({ media, size = 'medium' }: MediaCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const title = media.title || media.name || '';
  
  const handleClick = () => {
    navigate(`/details/${media.media_type}/${media.id}`);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Added to My List",
      description: `${title} has been added to your list.`,
    });
  };

  // Determine dimensions based on size prop
  const cardClasses = {
    small: 'w-32 sm:w-36',
    medium: 'w-40 sm:w-48',
    large: 'w-48 sm:w-56',
  }[size];

  return (
    <motion.div 
      className={`${cardClasses} transition-all duration-300 relative group cursor-pointer`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted relative shadow-md">
        {/* Poster Image */}
        <img
          src={getImageUrl(media.poster_path, size === 'small' ? 'w185' : 'w500')}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/500x750?text=No+Image';
          }}
        />
        
        {/* Rating badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm p-1 rounded-md flex items-center">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
          <span className="text-white text-xs font-medium">{media.vote_average.toFixed(1)}</span>
        </div>
        
        {/* Media type badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-white text-xs font-bold bg-primary/80 backdrop-blur-sm">
          {media.media_type === 'movie' ? 'MOVIE' : 'TV'}
        </div>
        
        {/* Overlay on hover */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
        >
          <h3 className="text-white font-medium mb-1 line-clamp-2">{title}</h3>
          
          <div className="flex items-center text-white/90 text-xs space-x-2 mb-2">
            {(media.release_date || media.first_air_date) && (
              <span>
                {new Date(media.release_date || media.first_air_date!).getFullYear()}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="flex-1 py-1.5 bg-white rounded-md hover:bg-white/90 transition-colors flex items-center justify-center"
              aria-label="Play"
            >
              <Play className="h-4 w-4 text-primary" fill="currentColor" />
              <span className="ml-1 text-primary text-xs font-medium">Play</span>
            </button>
            <button 
              className="p-1.5 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
              aria-label="Add to list"
              onClick={handleAddToList}
            >
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Title (visible when not hovered) */}
      <div className={`mt-2 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-sm font-medium truncate">{title}</h3>
      </div>
    </motion.div>
  );
};

export default MediaCard;
