
import React from 'react';
import { FreePersonalisedTuitions } from '../components/FreePersonalisedTuitions';

export const FreeTuitionsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 font-inter">
      {/* We reuse the component but give it a page context */}
      <FreePersonalisedTuitions onNavigate={onNavigate} onMatch={() => onNavigate('dashboard')} />
      
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-600">
        <h3 className="font-bold text-lg mb-2">How It Works</h3>
        <p className="max-w-2xl mx-auto">
          We partner with top universities to provide free academic support. Select your institution, 
          input your student details, and our system matches you with a qualified virtual tutor and study resources tailored to your exact syllabus.
        </p>
      </div>
    </div>
  );
};
