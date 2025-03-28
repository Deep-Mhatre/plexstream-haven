import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMediaDetails, fetchSimilarMedia } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Play, Plus, Heart, Share2, ChevronLeft } from 'lucide-react';
import MediaSlider from '@/components/MediaSlider';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

const MediaDetails = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideo, setShowVideo] = useState(false);
  
  const { data: media, isLoading: mediaLoading } = useQuery({
    queryKey: ['mediaDetails', mediaType, id],
    queryFn: () => fetchMediaDetails(mediaType, id.toString()),
  });
  
  const { data: similarMedia, isLoading: similarLoading } = useQuery({
    queryKey: ['similarMedia', mediaType, id],
    queryFn: () => fetchSimilarMedia(mediaType, id.toString()),
    enabled: !!media,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddToFavorites = () => {
    toast({
      title: "Added to Favorites",
      description: `This media has been added to your favorites.`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: `Share this media with your friends.`,
    });
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  if (mediaLoading || !media) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse w-full h-64 bg-slate-700 rounded-lg mb-4"></div>
          <div className="animate-pulse w-3/4 h-8 bg-slate-700 rounded-lg mb-2"></div>
          <div className="animate-pulse w-1/2 h-6 bg-slate-700 rounded-lg mb-6"></div>
          <div className="flex space-x-4">
            <div className="animate-pulse w-32 h-10 bg-slate-700 rounded-lg"></div>
            <div className="animate-pulse w-32 h-10 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    name,
    overview,
    vote_average,
    release_date,
    first_air_date,
    genres,
    runtime,
    number_of_seasons,
    number_of_episodes,
    backdrop_path,
    poster_path,
    videos,
  } = media;

  const mediaTitle = title || name;
  const backdropUrl = `https://image.tmdb.org/t/p/original/${backdrop_path || poster_path}`;
  const formattedReleaseDate = release_date ? formatDate(release_date) : null;
  const formattedFirstAirDate = first_air_date ? formatDate(first_air_date) : null;
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[60vh] md:h-[75vh] lg:h-[90vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt={mediaTitle || 'Media Backdrop'}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="container mx-auto px-4 relative z-10 flex items-center h-full">
            <div className="max-w-4xl text-white">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 left-4 md:top-8 md:left-8 bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={handleGoBack}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
              </Button>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{mediaTitle}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-lg font-semibold">{rating} / 10</span>
                <span className="text-gray-300">
                  {mediaType === 'movie' ? formattedReleaseDate : formattedFirstAirDate}
                </span>
                {genres && (
                  <div className="flex items-center space-x-2">
                    {genres.map((genre) => (
                      <span key={genre.id} className="px-2 py-1 rounded-full bg-gray-800 text-sm">{genre.name}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-lg mb-6 line-clamp-3">{overview}</p>
              
              <div className="flex items-center space-x-4">
                <Button onClick={handlePlayVideo}>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to List
                </Button>
                <Button variant="ghost" onClick={handleAddToFavorites}>
                  <Heart className="mr-2 h-4 w-4" />
                  Favorite
                </Button>
                <Button variant="ghost" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <Button 
              className="absolute top-2 right-2 z-10" 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowVideo(false)}
            >
              Close
            </Button>
            <div className="aspect-video w-full">
              <VideoPlayer 
                videoUrl={videos?.results?.[0]?.key ? 
                  `https://www.youtube.com/watch?v=${videos.results[0].key}` : 
                  undefined
                }
                thumbnailUrl={backdropUrl}
                title={mediaTitle}
                autoPlay={true}
                onClose={() => setShowVideo(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex border-b border-gray-700">
            <button
              className={`px-6 py-3 ${activeTab === 'overview' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}
              onClick={() => handleTabClick('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 ${activeTab === 'details' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}
              onClick={() => handleTabClick('details')}
            >
              Details
            </button>
            <button
              className={`px-6 py-3 ${activeTab === 'reviews' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}
              onClick={() => handleTabClick('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <p className="text-gray-300">{overview}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p>
                      <strong>Release Date:</strong> {formattedReleaseDate || formattedFirstAirDate}
                    </p>
                    {mediaType === 'movie' ? (
                      <p>
                        <strong>Runtime:</strong> {runtime} minutes
                      </p>
                    ) : (
                      <>
                        <p>
                          <strong>Seasons:</strong> {number_of_seasons}
                        </p>
                        <p>
                          <strong>Episodes:</strong> {number_of_episodes}
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    {genres && (
                      <div>
                        <strong>Genres:</strong>
                        <ul className="list-disc list-inside">
                          {genres.map((genre) => (
                            <li key={genre.id}>{genre.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <p className="text-gray-300">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar Media Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <MediaSlider title="Similar Media" media={similarMedia || []} isLoading={similarLoading} />
        </div>
      </section>
    </div>
  );
};

export default MediaDetails;
