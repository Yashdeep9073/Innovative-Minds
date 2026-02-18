
import React, { useEffect, useState } from 'react';
import { Workshop, User } from '../types';
import { WorkshopCard } from './WorkshopCard';
import { getWorkshops, getUserEnrollments } from '../services/firebase';
import { AlertCircle } from 'lucide-react';

interface WorkshopListProps {
  user: User | null;
  limit?: number;
  category?: string;
  onNavigate?: (path: string) => void;
}

export const WorkshopList: React.FC<WorkshopListProps> = ({ user, limit, category, onNavigate }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allWorkshops = await getWorkshops();
        let filtered = allWorkshops;
        
        if (category && category !== 'All') {
          filtered = filtered.filter(w => w.category === category);
        }
        
        if (limit) {
          filtered = filtered.slice(0, limit);
        }

        setWorkshops(filtered);

        if (user) {
          const enrollments = await getUserEnrollments(user.id);
          const ids = new Set(enrollments.filter(e => e.status === 'in_progress').map(e => e.workshopId));
          setEnrolledIds(ids);
        }
      } catch (err) {
        console.error("Failed to load workshops", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, limit, category]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D62828]"></div>
      </div>
    );
  }

  if (workshops.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 flex flex-col items-center">
         <AlertCircle size={24} className="mb-2 text-gray-400"/>
         <p>No workshops found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workshops.map(w => {
         const isEnrolled = enrolledIds.has(w.id) || enrolledIds.has(w.course_id);
         return (
            <WorkshopCard 
              key={w.id} 
              workshop={w} 
              user={user}
              onNavigate={onNavigate}
              enrollmentStatus={isEnrolled ? 'enrolled' : 'available'}
            />
         );
      })}
    </div>
  );
};
