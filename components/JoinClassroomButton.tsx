
import React, { useState } from 'react';
import { Button } from './UI';
import { auth, getUserEnrollments } from '../services/firebase';
import { PlayCircle, Loader2, Lock } from 'lucide-react';

interface JoinClassroomButtonProps {
  courseId: string;
  courseTitle?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onNavigate: (path: string) => void;
}

export const JoinClassroomButton: React.FC<JoinClassroomButtonProps> = ({ 
  courseId, 
  courseTitle, 
  className = '', 
  variant = 'primary',
  size = 'md',
  onNavigate 
}) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);

    try {
      const user = auth.currentUser;
      
      // 1. Auth Check
      if (!user) {
        // Redirect to login with return context
        sessionStorage.setItem('redirect_after_login', `orientation/${courseId}`);
        onNavigate('login');
        return;
      }

      // 2. Enrollment Check
      // We check existing enrollments to determine routing
      const enrollments = await getUserEnrollments(user.uid);
      const enrollment = enrollments.find(e => e.workshopId === courseId || e.workshopId === courseId);

      if (enrollment) {
        // 3. Direct Routing to Player if enrolled
        // Prompt 2 requirement: "Redirects to: /learning/{courseId}" which maps to 'player' in App.tsx
        onNavigate(`player/${courseId}`);
      } else {
        // 4. Not Enrolled -> Go to Enrollment Wizard
        // Preserve context
        sessionStorage.setItem('pending_enrollment_id', courseId);
        onNavigate(`enroll/${courseId}`);
      }

    } catch (error) {
      console.error("Join Classroom Error:", error);
      alert("System could not verify enrollment. Redirecting to support.");
      onNavigate('contact-us');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={handleJoin}
      disabled={loading}
      icon={loading ? Loader2 : PlayCircle}
    >
      {loading ? 'Verifying Access...' : 'Join Live Classroom'}
    </Button>
  );
};
