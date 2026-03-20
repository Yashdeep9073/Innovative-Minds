
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Zap, Download, CheckCircle } from 'lucide-react';
import { offlineStorage } from '../utils/offlineStorage';

interface VideoPlayerProps {
  url: string;
  title: string;
  lowDataMode?: boolean;
  onProgress?: (progress: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, lowDataMode, onProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState<'auto' | '360p' | '720p' | '1080p'>('auto');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for local offline version
  useEffect(() => {
    let currentBlobUrl: string | null = null;

    const checkOffline = async () => {
      try {
        const content = await offlineStorage.getContent(url);
        if (content && content.data instanceof Blob) {
          currentBlobUrl = URL.createObjectURL(content.data);
          setLocalUrl(currentBlobUrl);
          console.log(`Playing offline version for: ${title}`);
        }
      } catch (err) {
        console.error("Error checking offline content:", err);
      }
    };
    checkOffline();

    return () => {
      if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    };
  }, [url, title]);

  // Adaptive Bitrate Simulation
  useEffect(() => {
    if (lowDataMode && quality !== '360p') {
      const timer = setTimeout(() => {
        setQuality('360p');
        console.log("Low Data Mode: Capping quality at 360p");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [lowDataMode, quality]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      const p = (current / total) * 100;
      setProgress(p);
      setCurrentTime(current);
      if (onProgress) onProgress(p);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else videoRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div 
      className="relative group bg-black rounded-xl overflow-hidden aspect-video shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={localUrl || url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Buffering Overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Status Badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {localUrl && (
          <div className="flex items-center gap-1 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
            <CheckCircle size={10} /> OFFLINE READY
          </div>
        )}
        {lowDataMode && (
          <div className="flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
            <Zap size={10} /> LOW DATA
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Play/Pause Center Button */}
        {!isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md p-6 rounded-full transition-transform hover:scale-110"
          >
            <Play size={40} className="text-white fill-white" />
          </button>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="relative group/progress h-1.5 bg-white/20 rounded-full cursor-pointer">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg" />
            </div>
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300 h-1 bg-white/20 rounded-full relative">
                   <div className="absolute inset-y-0 left-0 bg-white rounded-full w-3/4" />
                </div>
              </div>

              <span className="text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group/quality">
                <button className="flex items-center gap-1 text-xs font-bold hover:text-blue-400 transition-colors uppercase">
                  <Settings size={16} />
                  {quality === 'auto' ? 'Auto' : quality}
                </button>
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur border border-white/10 rounded-lg p-1 hidden group-hover/quality:block min-w-[100px]">
                  {(['auto', '1080p', '720p', '360p'] as const).map(q => (
                    <button 
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`w-full text-left px-3 py-1.5 text-[10px] rounded hover:bg-white/10 transition-colors ${quality === q ? 'text-blue-400 font-bold' : 'text-white'}`}
                    >
                      {q.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={toggleFullscreen} className="hover:text-blue-400 transition-colors">
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h > 0 ? h : null, m, s]
    .filter(x => x !== null)
    .map(x => x!.toString().padStart(2, '0'))
    .join(':');
}
