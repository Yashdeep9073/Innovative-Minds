
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from './UI';
import { University, UniversityProgram, TutorRequest } from '../types';
import { submitTutorRequest } from '../services/tutorService';
import { CheckCircle, Loader2, Search, GraduationCap } from 'lucide-react';

interface Props {
  university: University;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (request: TutorRequest) => void;
}

export const TutorMatchingModal: React.FC<Props> = ({ university, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [studentNumber, setStudentNumber] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Derived Data
  const program = university.faculties.flatMap(f => f.programs).find(p => p.program_id === selectedProgramId);
  const yearData = program?.years.find(y => y.year === selectedYear);
  const semesterData = yearData?.semesters.find(s => s.semester === selectedSemester);
  const availableModules = semesterData?.modules || [];

  const handleModuleToggle = (modName: string) => {
    setSelectedModules(prev => prev.includes(modName) ? prev.filter(m => m !== modName) : [...prev, modName]);
  };

  const handleSearch = async () => {
    if (!studentNumber || !selectedProgramId || !selectedModules.length) {
        alert("Please complete all fields.");
        return;
    }

    setStep(2);

    try {
        const result = await submitTutorRequest({
            universityId: university.id,
            universityName: university.name,
            studentNumber,
            level: program?.level || 'Degree',
            year: selectedYear,
            semester: selectedSemester,
            selectedModules
        });
        
        setStep(3);
        // Delay success callback slightly so user sees the match screen
        setTimeout(() => onSuccess(result), 1000); 
    } catch (e) {
        console.error(e);
        alert("Matching failed. Please try again.");
        setStep(1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tutor Match: ${university.shortName}`}>
      
      {/* STEP 1: FORM */}
      {step === 1 && (
        <div className="space-y-4">
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                 <GraduationCap size={18} /> Tell Us About Your Academic Needs
              </h3>
              <p className="text-xs text-blue-700 mt-1">We'll match you with a tutor specializing in your exact modules.</p>
           </div>

           <Input label="University" value={university.name} disabled className="bg-gray-100" />
           <Input label="Student Number" value={studentNumber} onChange={e => setStudentNumber(e.target.value)} placeholder="e.g. 202100456" />

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program / Degree</label>
              <select 
                 className="w-full border rounded-xl p-3 bg-white"
                 value={selectedProgramId}
                 onChange={e => { setSelectedProgramId(e.target.value); setSelectedYear(''); setSelectedSemester(''); }}
              >
                 <option value="">Select Program</option>
                 {university.faculties.flatMap(f => f.programs).map(p => (
                    <option key={p.program_id} value={p.program_id}>{p.program_name} ({p.level})</option>
                 ))}
              </select>
           </div>

           {program && (
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select className="w-full border rounded-xl p-3" value={selectedYear} onChange={e => { setSelectedYear(e.target.value); setSelectedSemester(''); }}>
                       <option value="">Select Year</option>
                       {program.years.map(y => <option key={y.year} value={y.year}>{y.year}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select className="w-full border rounded-xl p-3" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
                       <option value="">Select Semester</option>
                       {yearData?.semesters.map(s => <option key={s.semester} value={s.semester}>{s.semester}</option>)}
                    </select>
                 </div>
              </div>
           )}

           {availableModules.length > 0 && (
              <div className="border rounded-xl p-4 bg-gray-50">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Select Courses for Tutoring:</label>
                 <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableModules.map(mod => (
                       <label key={mod.id} className="flex items-center gap-3 p-2 bg-white rounded border hover:border-blue-300 cursor-pointer">
                          <input 
                             type="checkbox" 
                             checked={selectedModules.includes(mod.name)}
                             onChange={() => handleModuleToggle(mod.name)}
                             className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span className="text-sm">{mod.code} - {mod.name}</span>
                       </label>
                    ))}
                 </div>
              </div>
           )}

           <Button className="w-full mt-4" size="lg" onClick={handleSearch} disabled={!selectedModules.length}>
              Find My Tutor Now
           </Button>
        </div>
      )}

      {/* STEP 2: SEARCHING ANIMATION */}
      {step === 2 && (
         <div className="py-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-[#D62828] rounded-full border-t-transparent animate-spin"></div>
               <Search className="absolute inset-0 m-auto text-[#D62828] animate-pulse" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Searching for the best personalised tutor for you...</h3>
            <p className="text-sm text-gray-500 mb-8 px-8">Matching your syllabus with our expert database.</p>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mx-4">
               <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Please Wait</p>
               <p className="text-sm font-bold text-gray-800">THIS MAY DELAY DEPENDING ON YOUR INTERNET CONNECTION. DO NOT CANCEL OR CLOSE.</p>
            </div>
         </div>
      )}

      {/* STEP 3: MATCH FOUND */}
      {step === 3 && (
         <div className="py-8 text-center animate-in fade-in zoom-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
               <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">We have found a match!</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
               You have been matched with a verified expert tutor specialized in <span className="font-bold text-[#D62828]">{university.shortName}</span> curriculum.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 text-left flex gap-4 items-center">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">IM</div>
               <div>
                  <p className="font-bold text-gray-900">IMI Virtual Tutor</p>
                  <p className="text-xs text-gray-500">Verified • 4.9/5 Rating</p>
               </div>
            </div>
            
            <p className="text-sm text-gray-500 animate-pulse">Redirecting to Dashboard...</p>
         </div>
      )}

    </Modal>
  );
};
