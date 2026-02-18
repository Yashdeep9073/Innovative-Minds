
import React, { useEffect, useState } from 'react';
import { Workshop, Enrollment } from '../types';
import { getWorkshopById, getUserEnrollments, auth, updateDoc, doc, db, setDoc, serverTimestamp } from '../services/firebase';
import { Button, Card } from '../components/UI';
import { 
  BookOpen, Clock, Users, ShieldCheck, Award, FileText, CheckCircle, 
  AlertCircle, PlayCircle, MapPin, Zap, Monitor, HelpCircle, 
  MessageSquare, Brain, Calendar, Info, LogOut
} from 'lucide-react';
import { JoinClassroomButton } from '../components/JoinClassroomButton';
import { reconstructWorkshopFromId } from '../services/workshopData';

interface Props {
  courseId?: string;
  onNavigate: (p: string) => void;
}

export const CourseOrientationPage: React.FC<Props> = ({ courseId, onNavigate }) => {
  const [course, setCourse] = useState<Workshop | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!courseId) return;
      const user = auth.currentUser;
      if (!user) {
        onNavigate('login');
        return;
      }

      // 1. Fetch Course Data (with recovery)
      let c = await getWorkshopById(courseId);
      
      // Auto-Reconstruct if missing (Critical for AI courses)
      if (!c && courseId.startsWith('ai-gen')) {
          console.log("Orientation: Reconstructing missing AI course...");
          c = reconstructWorkshopFromId(courseId) || undefined;
          if (c) {
              await setDoc(doc(db, 'workshops', courseId), {
                  ...c,
                  status: 'published',
                  visible: true,
                  updated_at: serverTimestamp()
              });
          }
      }

      if (c) {
        setCourse(c);
        // 2. Check & Auto-Populate Orientation Data if missing/thin
        if (!c.workshop_structure?.orientation?.learning_outcomes?.length || !c.workshop_structure?.orientation?.how_it_works) {
           console.log("Orientation data incomplete. Auto-generating...");
           setGenerating(true);
           
           const enrichedOrientation = {
             welcome_message: c.workshop_structure?.orientation?.welcome_message || `Welcome to ${c.title}. This orientation will guide you through the academic requirements and learning outcomes.`,
             how_it_works: "This course follows the IMI 3-Cycle Learning Method: Fundamentals, Application, and Analysis.",
             learning_outcomes: [
               `Master core concepts of ${c.category}`,
               "Apply theoretical knowledge to real-world Zambian scenarios",
               "Develop critical analysis skills for industry leadership",
               "Prepare for professional certification exams"
             ],
             estimated_effort: "4-6 hours per week",
             technical_requirements: ["Stable Internet (3G/4G/Starlink)", "PDF Reader", "Audio-enabled device"],
             community_rules: ["Respect diverse viewpoints", "No plagiarism", "Active participation required"]
           };
           
           // Update Local State
           const updatedCourse = { 
             ...c, 
             workshop_structure: { 
               ...c.workshop_structure!, 
               orientation: { ...c.workshop_structure!.orientation, ...enrichedOrientation } 
             } 
           };
           setCourse(updatedCourse);
           
           // Persist to Firestore (Auto-Repair)
           try {
             const ref = doc(db, 'workshops', c.id);
             await updateDoc(ref, { 
                "workshop_structure.orientation": enrichedOrientation 
             });
           } catch(e) { console.warn("Auto-save orientation failed", e); }
           
           setGenerating(false);
        }
      }

      // 3. Fetch Enrollment
      const enrollments = await getUserEnrollments(user.uid);
      const enr = enrollments.find(e => e.workshopId === courseId || e.workshopId === c?.course_id);
      if (enr) setEnrollment(enr);
      else {
         // If course is AI generated and enrollment missing, allow staying on orientation 
         // (User will click "Join Live Classroom" which triggers auto-enroll in Player)
         if (!courseId.startsWith('ai-gen')) {
             onNavigate(`enroll/${courseId}`);
         }
      }

      setLoading(false);
    };
    init();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D62828] mb-4"></div>
       <p className="text-gray-600 font-medium">{generating ? "Auto-Generating Orientation Content..." : "Loading Classroom..."}</p>
    </div>
  );

  if (!course) return <div className="p-8 text-center">Course not found.</div>;

  const orientation = course.workshop_structure!.orientation;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* 1. Header */}
      <header className="bg-gray-900 text-white pb-24 pt-16 px-4">
         <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-400 text-xs font-bold mb-4">
                     <BookOpen size={14} /> {course.category} Department
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black mb-4">{course.title}</h1>
                  <p className="text-xl text-gray-300 max-w-2xl">{orientation.welcome_message}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[150px]">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Your Status</p>
                  <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-2">
                     <CheckCircle size={20} /> {enrollment?.status === 'in_progress' ? 'Active' : 'Ready'}
                  </div>
               </div>
            </div>
         </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-16 pb-20 space-y-8">
         
         {/* 17. Primary Action Card */}
         <Card className="p-8 border-t-4 border-[#D62828] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <PlayCircle size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Begin?</h2>
                  <p className="text-gray-600">You are currently at <span className="font-bold text-[#D62828]">{Math.round(enrollment?.progress || 0)}%</span> completion.</p>
                  <p className="text-sm text-gray-500 mt-1">Next Topic: Module {((enrollment?.currentTopicIndex || 0) + 1)}</p>
               </div>
               
               {/* SMART BUTTON WITH REDIRECTION LOGIC */}
               <JoinClassroomButton 
                  courseId={course.id} 
                  onNavigate={onNavigate} 
                  className="rounded-full px-12 py-4 text-lg shadow-lg bg-[#D62828] hover:bg-red-700 w-full md:w-auto"
               />
            </div>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Academic Structure */}
            <div className="md:col-span-2 space-y-8">
               
               {/* 3. Outcomes */}
               <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="text-blue-600"/> Learning Outcomes</h3>
                  <Card className="p-6 bg-white">
                     <ul className="space-y-3">
                        {orientation.learning_outcomes.map((outcome, i) => (
                           <li key={i} className="flex gap-3 text-gray-700">
                              <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                              {outcome}
                           </li>
                        ))}
                     </ul>
                  </Card>
               </section>

               {/* 4. Timeline & 5. Breakdown */}
               <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="text-purple-600"/> Course Roadmap</h3>
                  <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
                     <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#D62828] border-2 border-white"></div>
                        <h4 className="font-bold text-gray-800">Orientation (You are here)</h4>
                        <p className="text-sm text-gray-500">Review policy and setup.</p>
                     </div>
                     <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                        <h4 className="font-bold text-gray-800">Mandatory Core Modules</h4>
                        <p className="text-sm text-gray-500">3 Topics • Sequential Learning</p>
                     </div>
                     <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                        <h4 className="font-bold text-gray-800">Elective Specializations</h4>
                        <p className="text-sm text-gray-500">Choose 2 Topics based on career interest.</p>
                     </div>
                     <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-400 border-2 border-white"></div>
                        <h4 className="font-bold text-gray-800">Final Examination</h4>
                        <p className="text-sm text-gray-500">Proctored Online Exam (Fee Applies)</p>
                     </div>
                  </div>
               </section>

               {/* 6. Assessment & 9. Rules */}
               <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck className="text-green-600"/> Academic Policy</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Card className="p-5 bg-gray-50 border-gray-200">
                        <h4 className="font-bold text-sm mb-2 text-gray-800">Assessment Rules</h4>
                        <ul className="text-xs text-gray-600 space-y-2">
                           <li>• Minimum 76% pass mark for all quizzes.</li>
                           <li>• Final Exam has 2 attempts max.</li>
                           <li>• Plagiarism check enabled for assignments.</li>
                        </ul>
                     </Card>
                     <Card className="p-5 bg-gray-50 border-gray-200">
                        <h4 className="font-bold text-sm mb-2 text-gray-800">Certification</h4>
                        <ul className="text-xs text-gray-600 space-y-2">
                           <li>• Complete all topics to unlock exam.</li>
                           <li>• Certificate issued instantly upon passing.</li>
                           <li>• Verifiable via IMI Global Registry.</li>
                        </ul>
                     </Card>
                  </div>
               </section>

            </div>

            {/* Right Column: Support & Tools */}
            <div className="space-y-6">
               
               {/* 10. Instructor */}
               <Card className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users size={18}/> Course Faculty</h4>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">Dr</div>
                     <div>
                        <p className="font-bold text-sm">Dr. J. Mwale</p>
                        <p className="text-xs text-gray-500">Lead Instructor</p>
                     </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Message Instructor</Button>
               </Card>

               {/* 19. AI Assistant */}
               <Card className="p-6 bg-blue-900 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Brain size={64}/></div>
                  <h4 className="font-bold mb-2 relative z-10">AI Tutor Active</h4>
                  <p className="text-xs text-blue-200 mb-4 relative z-10">
                     "I am trained on this specific course material. Ask me to explain concepts or summarize videos anytime."
                  </p>
                  <Button size="sm" className="w-full bg-white text-blue-900 hover:bg-blue-50 border-none relative z-10">Try AI Assistant</Button>
               </Card>

               {/* 14. Effort & 15. Tech */}
               <Card className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Info size={18}/> Requirements</h4>
                  <div className="space-y-4 text-sm text-gray-600">
                     <div className="flex justify-between border-b pb-2">
                        <span>Est. Effort</span>
                        <span className="font-bold">{(course.durationMinutes || 120)/60} Hours</span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                        <span>Skill Level</span>
                        <span className="font-bold">{course.level}</span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                        <span>Device</span>
                        <span className="font-bold">Mobile / PC</span>
                     </div>
                  </div>
               </Card>

               {/* 16. Support */}
               <Card className="p-6 bg-yellow-50 border-yellow-100">
                  <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2"><HelpCircle size={18}/> Need Help?</h4>
                  <p className="text-xs text-yellow-800 mb-4">Contact academic support if you face technical issues.</p>
                  <Button variant="outline" size="sm" className="w-full border-yellow-600 text-yellow-900 hover:bg-yellow-100" onClick={() => onNavigate('contact-us')}>Contact Support</Button>
               </Card>

            </div>
         </div>

         {/* 20. Integrity Footer */}
         <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-200">
            <p className="mb-2 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
               <ShieldCheck size={12}/> Academic Integrity Pledge
            </p>
            <p>By proceeding, you agree to the IMI Student Code of Conduct. All work submitted must be your own.</p>
         </div>

      </main>
    </div>
  );
};
