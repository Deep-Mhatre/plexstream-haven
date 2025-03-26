
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMedia, Media, getImageUrl } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle, X, Film, Tv } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchMedia(searchQuery);
      setResults(data.slice(0, 6)); // Limit to 6 results for better UX
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      searchMovies(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, searchMovies]);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClick = (item: Media) => {
    navigate(`/details/${item.media_type}/${item.id}`);
    if (onClose) onClose();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-12 py-6 text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {loading ? (
            <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : query ? (
            <Button variant="ghost" size="icon" onClick={() => setQuery('')} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => (
            <div
              key={`${item.media_type}-${item.id}`}
              className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200"
              onClick={() => handleClick(item)}
            >
              <div className="h-16 w-11 rounded overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(item.poster_path, 'w185')}
                  alt={item.title || item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/185x278?text=No+Image';
                  }}
                />
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <h4 className="text-sm font-medium truncate">
                  {item.title || item.name}
                </h4>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  {item.media_type === 'movie' ? (
                    <Film className="h-3 w-3 mr-1" />
                  ) : (
                    <Tv className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {item.media_type === 'movie' ? 'Movie' : 'TV Show'}{' '}
                    {item.release_date &&
                      `• ${new Date(item.release_date).getFullYear()}`}
                    {item.first_air_date &&
                      `• ${new Date(item.first_air_date).getFullYear()}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {debouncedQuery && results.length === 0 && !loading && (
        <div className="mt-4 text-center py-8">
          <p className="text-muted-foreground">No results found for "{debouncedQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
