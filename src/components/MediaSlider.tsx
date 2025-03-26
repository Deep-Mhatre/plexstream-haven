
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Media } from '@/services/api';
import MediaCard from './MediaCard';

interface MediaSliderProps {
  title: string;
  media: Media[];
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

const MediaSlider = ({ title, media, size = 'medium', isLoading = false }: MediaSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = sliderRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -container.clientWidth * 0.8 : container.clientWidth * 0.8;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  // Calculate the width of each slide based on size
  const slideWidth = {
    small: 'w-32 sm:w-36 md:w-40',
    medium: 'w-40 sm:w-48 md:w-56',
    large: 'w-48 sm:w-56 md:w-64',
  }[size];

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-hidden">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className={`${slideWidth} animate-pulse`}>
                <div className="aspect-[2/3] bg-slate-700 rounded-lg"></div>
                <div className="h-4 bg-slate-700 rounded mt-2 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!media.length) {
    return null;
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="relative group">
        {/* Left Arrow */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground border border-border shadow-md transition-opacity duration-300 ${
            showLeftArrow ? 'opacity-80 hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Media Cards Container */}
        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none"
          onScroll={handleScroll}
        >
          {media.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} media={item} size={size} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground border border-border shadow-md transition-opacity duration-300 ${
            showRightArrow ? 'opacity-80 hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MediaSlider;
