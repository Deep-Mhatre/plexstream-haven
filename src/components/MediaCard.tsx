
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Media, getImageUrl } from '@/services/api';
import { Play, Info } from 'lucide-react';

interface MediaCardProps {
  media: Media;
  size?: 'small' | 'medium' | 'large';
}

const MediaCard = ({ media, size = 'medium' }: MediaCardProps) => {
  const navigate = useNavigate();
  const title = media.title || media.name || '';
  
  const handleClick = () => {
    navigate(`/details/${media.media_type}/${media.id}`);
  };

  // Determine dimensions based on size prop
  const cardClasses = {
    small: 'w-32 sm:w-36',
    medium: 'w-40 sm:w-48',
    large: 'w-48 sm:w-56',
  }[size];

  return (
    <div 
      className={`${cardClasses} transition-all duration-300 hover-scale relative group`}
      onClick={handleClick}
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted relative">
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
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
              {media.media_type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-white/90 text-xs space-x-2">
              <span className="flex items-center">
                <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {media.vote_average.toFixed(1)}
              </span>
              {(media.release_date || media.first_air_date) && (
                <span>
                  {new Date(media.release_date || media.first_air_date!).getFullYear()}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 bg-white rounded-full hover:bg-white/90 transition-colors">
                <Play className="h-4 w-4 text-primary" />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Info className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="text-sm font-medium truncate">{title}</h3>
      </div>
    </div>
  );
};

export default MediaCard;
