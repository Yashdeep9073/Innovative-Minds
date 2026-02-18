
import React from 'react';
import { Workshop, User } from '../types';
import { EnrollButton } from './EnrollButton';
import { Card, Button } from './UI';
import { Clock, FileText, Users, PlayCircle, Lock, Sparkles } from 'lucide-react';
import { formatDuration, getDifficultyColor } from '../utils/helpers';

interface WorkshopCardProps {
  workshop: Workshop;
  user: User | null;
  onNavigate?: (path: string) => void;
  enrollmentStatus?: 'enrolled' | 'limit_reached' | 'available' | 'loading';
  variant?: 'standard' | 'compact';
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ 
  workshop, 
  user, 
  onNavigate,
  enrollmentStatus = 'available',
  variant = 'standard'
}) => {
  
  // Safe fallback for ID (Critical for legacy vs V2 data)
  // Prioritize unique document ID, then logical IDs
  const id = workshop.id || workshop.workshop_id || workshop.course_id;

  // Guard clause to prevent rendering cards without valid IDs
  if (!id) {
      console.error("WorkshopCard rendered without an ID:", workshop);
      return null;
  }

  const handleNavigate = () => {
    if (onNavigate) {
      if (enrollmentStatus === 'enrolled') {
        onNavigate(`player/${id}`);
      } else {
        onNavigate(`workshops/${id}`);
      }
    }
  };

  const isCompact = variant === 'compact';

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 h-full flex flex-col group border border-gray-100 overflow-hidden bg-white ${enrollmentStatus === 'enrolled' ? 'ring-2 ring-green-500/20' : ''} ${isCompact ? 'min-w-[280px] max-w-[280px]' : ''}`}>
      <div className={`${isCompact ? 'h-36' : 'h-48'} bg-gray-200 relative overflow-hidden cursor-pointer`} onClick={handleNavigate}>
        {workshop.image_url ? (
          <img 
            src={workshop.image_url} 
            alt={workshop.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 group-hover:scale-110" 
            loading="lazy"
            width={isCompact ? 280 : 400}
            height={isCompact ? 144 : 192}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            No Image Available
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#D62828] uppercase shadow-sm">
          {workshop.category || 'General'}
        </div>

        {/* AI Recommendations Badge (Simulated logic based on tags) */}
        {workshop.search_tags?.includes('AI') && (
           <div className="absolute bottom-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <Sparkles size={8} className="text-yellow-300" /> AI Pick
           </div>
        )}

        {workshop.status === 'live' && (
           <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold animate-pulse">
              LIVE
           </div>
        )}
        
        {enrollmentStatus === 'enrolled' && (
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
               <PlayCircle size={48} className="text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all"/>
           </div>
        )}
      </div>

      <div className={`${isCompact ? 'p-4' : 'p-5'} flex-1 flex flex-col`}>
        <h3 
          className={`font-bold ${isCompact ? 'text-sm mb-1' : 'text-lg mb-2'} line-clamp-2 text-gray-900 group-hover:text-[#D62828] transition-colors cursor-pointer`}
          onClick={handleNavigate}
          title={workshop.title}
        >
          {workshop.title}
        </h3>
        
        {!isCompact && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
            {workshop.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3 mt-1">
            {workshop.level && (
               <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getDifficultyColor(workshop.level)}`}>
                   {workshop.level}
               </span>
            )}
            {!isCompact && workshop.presenter && (
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded flex items-center gap-1 border border-blue-100">
                    <Users size={8}/> {workshop.presenter}
                </span>
            )}
        </div>

        <div className={`flex flex-wrap gap-3 text-xs text-gray-400 ${isCompact ? 'mb-3' : 'mb-4 border-t pt-3 border-gray-100'}`}>
           <div className="flex items-center gap-1">
             <Clock size={12} />
             <span>{formatDuration(workshop.durationMinutes || 60)}</span>
           </div>
           {!isCompact && (
             <div className="flex items-center gap-1">
               <FileText size={12} />
               <span>{workshop.workshop_structure?.topics.length || 0} Modules</span>
             </div>
           )}
        </div>

        <div className="mt-auto">
           {enrollmentStatus === 'enrolled' ? (
                <Button 
                    className="w-full text-xs" 
                    size="sm"
                    variant="secondary"
                    onClick={() => onNavigate && onNavigate(`player/${id}`)}
                    icon={PlayCircle}
                >
                    Resume
                </Button>
           ) : (
                <EnrollButton 
                    workshopId={id} 
                    courseId={workshop.course_id || workshop.workshop_id}
                    user={user} 
                    enrollmentStatus={enrollmentStatus}
                    className="text-xs"
                    onEnrollmentSuccess={() => onNavigate && onNavigate(`player/${id}`)}
                />
           )}
        </div>
      </div>
    </Card>
  );
};
