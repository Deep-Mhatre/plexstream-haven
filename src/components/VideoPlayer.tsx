
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl: string;
  title: string;
  onClose?: () => void;
  autoPlay?: boolean;
}

const VideoPlayer = ({ 
  videoUrl, 
  thumbnailUrl, 
  title, 
  onClose,
  autoPlay = false 
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [volume, setVolume] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=${autoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}`;
    }
    
    return null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  
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
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      video.currentTime = 0;
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && videoRef.current && !youtubeEmbedUrl) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        setIsPlaying(false);
      });
    } else if (!isPlaying && videoRef.current && !youtubeEmbedUrl) {
      videoRef.current.pause();
    }
  }, [isPlaying, youtubeEmbedUrl]);

  useEffect(() => {
    if (videoRef.current && !youtubeEmbedUrl) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, youtubeEmbedUrl]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
      });
    } else {
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

  return (
    <div 
      ref={playerRef} 
      className="relative w-full h-full bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {youtubeEmbedUrl ? (
        <iframe
          className="w-full h-full"
          src={youtubeEmbedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={thumbnailUrl}
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
        >
          <source src={actualVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {onClose && (
        <button 
          className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-white" />
        </button>
      )}
      
      {!youtubeEmbedUrl && (
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
