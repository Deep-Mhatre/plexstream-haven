
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Minimize, SkipBack, SkipForward, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl: string;
  title: string;
  onClose?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
}

const VideoPlayer = ({ 
  videoUrl, 
  thumbnailUrl, 
  title, 
  onClose,
  autoPlay = false,
  showControls = true
}: VideoPlayerProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isVideoError, setIsVideoError] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=${autoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}&enablejsapi=1&controls=${showControls ? 1 : 0}`;
    }
    
    // If it's a search URL, extract the search query and embed the first result
    const searchRegex = /youtube\.com\/results\?search_query=([^&]+)/;
    const searchMatch = url?.match(searchRegex);
    
    if (searchMatch && searchMatch[1]) {
      const searchQuery = decodeURIComponent(searchMatch[1]);
      console.log('Using YouTube search query:', searchQuery);
      // Create an embed that searches and plays the first result
      return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}&autoplay=${autoPlay ? 1 : 0}`;
    }
    
    return null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  
  // Default video or fallback
  const actualVideoUrl = youtubeEmbedUrl ? null : (videoUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || youtubeEmbedUrl) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsVideoError(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      video.currentTime = 0;
      toast({
        title: "Playback finished",
        description: `Finished playing ${title}`,
      });
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setIsVideoError(true);
      setIsPlaying(false);
      toast({
        title: "Playback error",
        description: "Unable to play the video. Trying alternative sources.",
        variant: "destructive"
      });
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [title, toast]);

  useEffect(() => {
    if (isPlaying && videoRef.current && !youtubeEmbedUrl) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        setIsPlaying(false);
        setIsVideoError(true);
        toast({
          title: "Playback failed",
          description: "Unable to play the video. Please try again later.",
          variant: "destructive"
        });
      });
    } else if (!isPlaying && videoRef.current && !youtubeEmbedUrl) {
      videoRef.current.pause();
    }
  }, [isPlaying, youtubeEmbedUrl, toast]);

  useEffect(() => {
    if (videoRef.current && !youtubeEmbedUrl) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, youtubeEmbedUrl]);

  // Load user preferences for video playback
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('plexstream_volume');
      const savedMuted = localStorage.getItem('plexstream_muted');
      const savedSubtitles = localStorage.getItem('plexstream_subtitles');
      
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }
      
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true');
      }
      
      if (savedSubtitles !== null) {
        setShowSubtitles(savedSubtitles === 'true');
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }, []);

  // Save user preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem('plexstream_volume', volume.toString());
      localStorage.setItem('plexstream_muted', isMuted.toString());
      localStorage.setItem('plexstream_subtitles', showSubtitles.toString());
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }, [volume, isMuted, showSubtitles]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * (duration || 0);
    setProgress(value[0]);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        toast({
          title: "Fullscreen error",
          description: "Unable to enter fullscreen mode",
          variant: "destructive"
        });
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }
  };

  const retryPlayback = () => {
    setIsVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(true);
    } else if (youtubeEmbedUrl) {
      // Reload iframe
      const container = playerRef.current;
      if (container) {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          const src = iframe.src;
          iframe.src = src;
        }
      }
    }
  };

  const renderErrorMessage = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-6 text-center">
      <p className="text-white text-lg mb-4">Unable to load video content</p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="bg-white/10 hover:bg-white/20 text-white"
          onClick={retryPlayback}
        >
          Retry
        </Button>
        <Button 
          variant="outline" 
          className="bg-white/10 hover:bg-white/20 text-white"
          onClick={() => {
            // Try YouTube search as fallback
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`, '_blank');
          }}
        >
          Search on YouTube
        </Button>
      </div>
    </div>
  );

  return (
    <div 
      ref={playerRef} 
      className="relative w-full h-full bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {isBuffering && !youtubeEmbedUrl && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      {youtubeEmbedUrl ? (
        <iframe
          className="w-full h-full"
          src={youtubeEmbedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster={thumbnailUrl}
            playsInline
            preload="metadata"
            autoPlay={autoPlay}
          >
            <source src={actualVideoUrl} type="video/mp4" />
            {showSubtitles && (
              <track 
                kind="subtitles" 
                src="" 
                srcLang="en" 
                label="English" 
                default 
              />
            )}
            Your browser does not support the video tag.
          </video>
          
          {isVideoError && renderErrorMessage()}
        </>
      )}
      
      {onClose && (
        <button 
          className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-white" />
        </button>
      )}
      
      {!youtubeEmbedUrl && !isVideoError && (
        <>
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              isPlaying && !isControlsVisible ? "opacity-0" : "opacity-100",
              isPlaying && !isControlsVisible ? "pointer-events-none" : "pointer-events-auto"
            )}
            onClick={togglePlay}
          >
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-full">
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white" />
              ) : (
                <Play className="h-12 w-12 text-white" fill="white" />
              )}
            </div>
          </div>
          
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-5 transition-opacity duration-300",
              isPlaying && !isControlsVisible ? "opacity-0" : "opacity-100",
              isPlaying && !isControlsVisible ? "pointer-events-none" : "pointer-events-auto"
            )}
          >
            <div className="mb-4">
              <Slider
                value={[progress]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" fill="white" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                  onClick={skipForward}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center space-x-2 group relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "text-white hover:bg-white/10",
                    showSubtitles && "bg-white/20"
                  )}
                  onClick={toggleSubtitles}
                >
                  <Subtitles className="h-5 w-5" />
                </Button>
                
                <span className="text-white/90 text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-white/90 text-sm hidden sm:inline-block">
                  {title}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
