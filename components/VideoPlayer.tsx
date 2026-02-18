
import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden shadow-lg group ${className}`}>
      {/* Aspect Ratio Container (16:9) */}
      <div className="pb-[56.25%] relative">
        <iframe
          src={url}
          title={title || 'Video Content'}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D62828]"></div>
          </div>
        )}
      </div>

      {title && (
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <h3 className="text-white font-bold text-sm truncate">{title}</h3>
        </div>
      )}
    </div>
  );
};
