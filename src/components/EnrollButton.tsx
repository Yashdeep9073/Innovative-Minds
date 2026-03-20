
import React, { useState } from 'react';
import { Button } from './UI';
import { auth, enrollUserInWorkshop } from '../services/firebase';
import { User } from '../types';
import { Lock, Clock, AlertCircle } from 'lucide-react';

interface EnrollButtonProps {
  workshopId: string;
  courseId?: string; // Legacy support
  user: User | null;
  enrollmentStatus?: 'enrolled' | 'limit_reached' | 'available' | 'loading';
  className?: string;
  onEnrollmentSuccess?: () => void;
}

export const EnrollButton: React.FC<EnrollButtonProps> = ({ 
  workshopId, 
  courseId,
  user, 
  enrollmentStatus = 'available',
  className = '',
  onEnrollmentSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks
    setError(null);

    // 1. Target ID Resolution
    const targetId = workshopId || courseId;
    if (!targetId) {
        setError("Error: Invalid Workshop ID");
        return;
    }

    // 2. Auth Check
    let uid = auth.currentUser?.uid;
    // Fallback to prop user if firebase auth is slow/syncing, or if using mock data
    if (!uid && user?.id) uid = user.id;

    if (!uid) {
        // Final fallback: check window mock for demo purposes (common in this app structure)
        const mockUser = (window as any).currentUser;
        if(mockUser) uid = mockUser.uid || mockUser.id;
        
        if (!uid) {
            alert("Please log in to enroll in this workshop.");
            return;
        }
    }

    setLoading(true);

    try {
      await enrollUserInWorkshop(uid, targetId);
      setSuccess(true);
      if (onEnrollmentSuccess) onEnrollmentSuccess();
    } catch (err: any) {
      console.error("Enrollment failed:", err);
      setError(err.message || "Failed to enroll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success || enrollmentStatus === 'enrolled') {
    return (
      <Button variant="secondary" disabled className={`w-full ${className}`} icon={Clock}>
        In Progress
      </Button>
    );
  }

  if (enrollmentStatus === 'limit_reached') {
    return (
      <Button variant="outline" disabled className={`w-full ${className}`} icon={Lock}>
        Limit Reached (Max 3)
      </Button>
    );
  }

  return (
    <div className="w-full">
        <Button 
            variant="primary" 
            onClick={handleEnroll} 
            isLoading={loading || enrollmentStatus === 'loading'}
            className={`w-full ${className}`}
        >
            {loading ? 'Enrolling...' : 'Enroll Now'}
        </Button>
        {error && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </div>
        )}
    </div>
  );
};
