
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 'h-2', 
  colorClass = 'bg-[#D62828]',
  showLabel = false
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`} 
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};
