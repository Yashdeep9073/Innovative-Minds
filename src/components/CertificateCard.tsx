
import React from 'react';
import { Workshop, Enrollment } from '../types';
import { Card, Button } from './UI';
import { Award, Lock, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface CertificateCardProps {
  workshop: Workshop;
  enrollment: Enrollment;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ workshop, enrollment }) => {
  const isCompleted = enrollment.status === 'completed';
  const certData = workshop.workshop_structure?.certificate_data;

  if (!certData || !certData.enabled) return null;

  return (
    <Card className={`p-6 border-l-4 ${isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
            <Award size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Official Certificate</h3>
            <p className="text-sm text-gray-600 mb-1">
              {isCompleted 
                ? `Awarded on ${formatDate(enrollment.lastAccessed)}` 
                : "Complete all topics and the final exam to unlock."}
            </p>
            {isCompleted && (
              <div className="flex items-center gap-2 text-xs font-mono text-green-700 bg-green-100 px-2 py-1 rounded w-fit">
                <ShieldCheck size={12} />
                Verified: {certData.verification_id}
              </div>
            )}
          </div>
        </div>

        {isCompleted ? (
          <Button icon={Download} size="sm" className="bg-green-600 hover:bg-green-700 border-none">
            Download
          </Button>
        ) : (
          <div className="text-gray-400">
            <Lock size={20} />
          </div>
        )}
      </div>
    </Card>
  );
};
