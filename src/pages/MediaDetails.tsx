
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMediaDetails, fetchRecommendations, MediaDetails as MediaDetailsType } from '@/services/api';
import Navbar from '@/components/Navbar';
import FeaturedMedia from '@/components/FeaturedMedia';
import MediaSlider from '@/components/MediaSlider';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MediaDetails = () => {
  const { mediaType, id } = useParams<{ mediaType: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Validate params
  useEffect(() => {
    if (!mediaType || !id || (mediaType !== 'movie' && mediaType !== 'tv')) {
      navigate('/browse');
    }
  }, [mediaType, id, navigate]);
  
  // Fetch media details
  const { data: mediaDetails, isLoading: detailsLoading, error: detailsError } = useQuery({
    queryKey: ['mediaDetails', mediaType, id],
    queryFn: () => fetchMediaDetails(mediaType!, parseInt(id!)),
    enabled: !!mediaType && !!id,
  });
  
  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations', mediaType, id],
    queryFn: () => fetchRecommendations(mediaType!, parseInt(id!)),
    enabled: !!mediaType && !!id,
  });
  
  if (!isAuthenticated) {
    return null; // Don't render the page if not authenticated
  }
  
  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <LoaderCircle className="h-10 w-10 animate-spin text-accent" />
        </div>
      </div>
    );
  }
  
  if (detailsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't load the content you're looking for.
          </p>
          <button 
            className="text-accent hover:underline"
            onClick={() => navigate('/browse')}
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }
  
  if (!mediaDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The {mediaType === 'movie' ? 'movie' : 'TV show'} you're looking for doesn't exist or has been removed.
          </p>
          <button 
            className="text-accent hover:underline"
            onClick={() => navigate('/browse')}
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Featured Media Section */}
        <FeaturedMedia media={mediaDetails} />
        
        {/* Cast Section */}
        {mediaDetails.credits && mediaDetails.credits.cast && mediaDetails.credits.cast.length > 0 && (
          <section className="py-12 container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaDetails.credits.cast.slice(0, 6).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                    <img
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                          : 'https://via.placeholder.com/185x278?text=No+Image'
                      }
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/185x278?text=No+Image';
                      }}
                    />
                  </div>
                  <h3 className="font-medium text-sm">{person.name}</h3>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Details Section */}
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Left column - General Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Status: </span>
                    <span>{mediaDetails.status}</span>
                  </div>
                  
                  {mediaDetails.release_date && (
                    <div>
                      <span className="text-sm text-muted-foreground">Release Date: </span>
                      <span>{new Date(mediaDetails.release_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {mediaDetails.first_air_date && (
                    <div>
                      <span className="text-sm text-muted-foreground">First Air Date: </span>
                      <span>{new Date(mediaDetails.first_air_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {mediaDetails.runtime && (
                    <div>
                      <span className="text-sm text-muted-foreground">Runtime: </span>
                      <span>{Math.floor(mediaDetails.runtime / 60)}h {mediaDetails.runtime % 60}m</span>
                    </div>
                  )}
                  
                  {mediaDetails.number_of_seasons && (
                    <div>
                      <span className="text-sm text-muted-foreground">Seasons: </span>
                      <span>{mediaDetails.number_of_seasons}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Middle column - Genres */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {mediaDetails.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-background rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Right column - Production Companies */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Production</h3>
                <div className="space-y-3">
                  {mediaDetails.production_companies.slice(0, 3).map((company) => (
                    <div key={company.id} className="flex items-center space-x-2">
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                          alt={company.name}
                          className="h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-background rounded"></div>
                      )}
                      <span className="text-sm">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <section className="py-12 container mx-auto px-4">
            <MediaSlider 
              title="Recommended for You" 
              media={recommendations} 
              isLoading={recommendationsLoading}
            />
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MediaDetails;
