'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX, 
  FiMaximize,
  FiMinimize,
  FiArrowLeft,
  FiSkipBack,
  FiSkipForward,
  FiSettings
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleMute, setMuted } from '@/store/slices/uiSlice';
import { updateProgress } from '@/store/slices/continueWatchingSlice';
import type { Video, MovieDetails } from '@/types';
import { getTitle, getMediaType } from '@/lib/tmdb';

interface VideoPlayerProps {
  videoKey: string;
  title: string;
  movieDetails?: MovieDetails;
  onClose?: () => void;
}

export default function VideoPlayer({ videoKey, title, movieDetails, onClose }: VideoPlayerProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isMuted } = useAppSelector(state => state.ui);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Hide controls after inactivity
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4000);
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'm':
          dispatch(toggleMute());
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          handleBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Save progress when unmounting
  useEffect(() => {
    return () => {
      if (movieDetails && progress > 0) {
        const mediaType = getMediaType(movieDetails);
        dispatch(updateProgress({
          id: movieDetails.id,
          mediaType,
          title: getTitle(movieDetails),
          posterPath: movieDetails.poster_path,
          backdropPath: movieDetails.backdrop_path,
          progress,
          timestamp: currentTime,
          lastWatched: new Date().toISOString(),
        }));
      }
    };
  }, [dispatch, movieDetails, progress, currentTime]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle touch/click on the overlay to show controls
  const handleOverlayInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    resetControlsTimeout();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black"
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
    >
      {/* YouTube Embed */}
      <iframe
        ref={playerRef}
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&playsinline=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        style={{ border: 'none' }}
      />

      {/* Clickable overlay to intercept clicks from iframe */}
      <div 
        className="absolute inset-0 z-10"
        onClick={handleOverlayInteraction}
        onTouchStart={handleOverlayInteraction}
      />

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/60"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-4 safe-area-inset-top">
              <button
                onClick={handleBack}
                className="p-2 sm:p-3 bg-black/50 hover:bg-white/20 rounded-full transition-colors active:scale-95"
              >
                <FiArrowLeft size={20} className="text-white sm:w-6 sm:h-6" />
              </button>
              <h1 className="text-white text-base sm:text-xl md:text-2xl font-medium truncate flex-1">
                {title}
              </h1>
            </div>

            {/* Center Play Button - Tap to toggle */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-4 sm:p-5 bg-black/50 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <FiPause className="text-white w-10 h-10 sm:w-12 sm:h-12" />
                ) : (
                  <FiPlay className="text-white w-10 h-10 sm:w-12 sm:h-12 ml-1" />
                )}
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-4 safe-area-inset-bottom">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-white text-xs sm:text-sm w-10 sm:w-12">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 h-1 sm:h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer touch-none">
                  <div
                    className="h-full bg-netflix-red rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white text-xs sm:text-sm w-10 sm:w-12 text-right">
                  {formatTime(duration || 120)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-2 sm:p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                  >
                    {isPlaying ? (
                      <FiPause className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <FiPlay className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>

                  {/* Skip Back - Hidden on very small screens */}
                  <button className="hidden xs:block p-2 sm:p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-95">
                    <FiSkipBack className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Skip Forward - Hidden on very small screens */}
                  <button className="hidden xs:block p-2 sm:p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-95">
                    <FiSkipForward className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Volume */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleMute());
                    }}
                    className="p-2 sm:p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                  >
                    {isMuted ? (
                      <FiVolumeX className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <FiVolume2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 sm:gap-3">
                  {/* Settings - Hidden on mobile */}
                  <button className="hidden sm:block p-2 sm:p-2.5 hover:bg-white/20 rounded-full transition-colors">
                    <FiSettings className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="p-2 sm:p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                  >
                    {isFullscreen ? (
                      <FiMinimize className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <FiMaximize className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
