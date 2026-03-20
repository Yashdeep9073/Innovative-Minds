
import React, { useState, useEffect } from 'react';
import { Button } from './UI';
import { GraduationCap, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { University } from '../types';
import { getUniversities } from '../services/tutorService';
import { TutorMatchingModal } from './TutorMatchingModal';

interface Props {
  onNavigate: (p: string) => void;
  onMatch: () => void;
}

export const FreePersonalisedTuitions: React.FC<Props> = ({ onNavigate, onMatch }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  useEffect(() => {
    getUniversities().then(setUniversities);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-10"></div>
         
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-400 text-black font-bold text-sm mb-6 animate-pulse">
                  <GraduationCap size={16}/> New Feature
               </div>
               <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Free Personalised Tuitions</h2>
               <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
                  Struggling with exams? Get matched with an expert tutor in minutes — <span className="font-bold text-yellow-400">absolutely free</span>.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-sm">
               {[
                  "Access Verified Past Exam Papers",
                  "Personalised 1-on-1 Virtual Tutors",
                  "AI-Powered Semester Revision Plans",
                  "Mock Exams per Semester Module",
                  "Real-time Performance Tracking",
                  "Certified Academic Resources"
               ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                     <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                     <span className="font-bold">{feat}</span>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
               {universities.map((uni) => (
                  <div 
                     key={uni.id} 
                     className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-lg group h-32 relative overflow-hidden"
                     onClick={() => setSelectedUni(uni)}
                  >
                     <img src={uni.logo} alt={uni.name} className="h-16 object-contain group-hover:opacity-10 transition-opacity duration-300" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 p-2 text-center">
                        <span className="text-gray-900 font-bold text-sm leading-tight">{uni.name}</span>
                        <span className="text-green-600 font-semibold text-xs mt-1">Tuition Available</span>
                     </div>
                  </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button size="lg" className="rounded-full px-12 py-5 text-xl font-bold bg-yellow-400 text-black hover:bg-yellow-300 border-none shadow-2xl" onClick={() => setSelectedUni(universities[0])}>
                  <Search size={20} className="mr-2"/> Find My Tutor Now
               </Button>
               <Button size="lg" variant="outline" className="rounded-full px-10 py-5 text-lg border-white text-white hover:bg-white/10" onClick={() => onNavigate('universities')}>
                  View All Universities <ArrowRight size={20} className="ml-2"/>
               </Button>
            </div>
         </div>

         {/* MODAL HANDLER */}
         {selectedUni && (
            <TutorMatchingModal 
                university={selectedUni} 
                isOpen={!!selectedUni} 
                onClose={() => setSelectedUni(null)} 
                onSuccess={(req) => { setSelectedUni(null); onMatch(); }}
            />
         )}
    </section>
  );
};
