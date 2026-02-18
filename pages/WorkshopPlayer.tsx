
import React, { useEffect, useState, useRef } from 'react';
import { 
  getWorkshopById, enrollUserInWorkshop, auth, getUserEnrollments, 
  recordTopicProgress, payExamFee, submitFinalExam, populateCourseContent,
  db, doc, setDoc, serverTimestamp
} from '../services/firebase'; 
import { Workshop, Enrollment } from '../types';
import { TopicViewer } from '../components/TopicViewer';
import { QuizView } from '../components/QuizView'; 
import { Button, Card } from '../components/UI';
import { reconstructWorkshopFromId } from '../services/workshopData';
import { 
  Menu, X, AlertCircle, CheckCircle, Lock, CreditCard, Award, 
  LogOut, RefreshCw, Loader2, Sparkles
} from 'lucide-react';

interface WorkshopPlayerProps {
  workshopId?: string;
  onNavigate: (p: string) => void;
}

export const WorkshopPlayer: React.FC<WorkshopPlayerProps> = ({ workshopId, onNavigate }) => {
  // --- STATE ---
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Loading & Auth States
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [authResolved, setAuthResolved] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Classroom...');
  const [isAutoHealing, setIsAutoHealing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // View Modes
  const [viewMode, setViewMode] = useState<'learn' | 'exam' | 'certificate'>('learn');
  const [takingExam, setTakingExam] = useState(false);
  const [payingExam, setPayingExam] = useState(false);

  // --- 1. AUTH SYNCHRONIZATION ---
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setCurrentUser(u);
      setAuthResolved(true);
    });
    return () => unsub();
  }, []);

  // --- 2. MASTER DATA FETCH & AUTO-HEAL LOGIC ---
  useEffect(() => {
    if (!authResolved) return; // Wait for Auth
    if (!workshopId) return;

    const loadClassroom = async () => {
      try {
        // A. FETCH WORKSHOP (or Reconstruct)
        setLoadingMessage('Loading Course Environment...');
        let w = await getWorkshopById(workshopId);

        if (!w && workshopId.startsWith('ai-gen')) {
           setLoadingMessage('Reconstructing AI Module...');
           w = reconstructWorkshopFromId(workshopId) || undefined;
           if (w) {
             // Persist immediately if missing
             // WRAPPED IN TRY/CATCH: Don't block loading if persistence fails
             try {
                 await setDoc(doc(db, 'workshops', workshopId), {
                   ...w,
                   status: 'published',
                   visible: true,
                   updated_at: serverTimestamp()
                 });
             } catch (persistErr) {
                 console.warn("Background persistence failed (ignoring for session):", persistErr);
             }
           }
        }

        if (!w) throw new Error("Course could not be loaded.");

        // LMS SHELL GUARANTEE: If topics are empty, auto-populate
        if (!w.workshop_structure?.topics || w.workshop_structure.topics.length === 0) {
            setLoadingMessage('Building Learning Shell...');
            // In a real app, we'd await this. For UI responsiveness, we might show a "Building" state.
            // For now, we'll try to use the raw reconstruction if Firestore is empty/broken
            const raw = reconstructWorkshopFromId(workshopId);
            if (raw && raw.workshop_structure?.topics.length > 0) {
                w = raw; // Use local version temporarily
            }
        }

        setWorkshop(w);

        // B. FETCH ENROLLMENT (or Auto-Heal)
        if (currentUser) {
           setLoadingMessage('Verifying Enrollment...');
           const enrollments = await getUserEnrollments(currentUser.uid);
           const enr = enrollments.find(e => e.workshopId === workshopId || e.workshopId === w?.course_id);

           if (enr) {
             setEnrollment(enr);
             setActiveTopicIndex(enr.currentTopicIndex || 0);
             if (enr.certificate_issued) setViewMode('certificate');
           } else {
             // AUTO-HEAL: If AI course, auto-enroll immediately
             if (workshopId.startsWith('ai-gen')) {
                setLoadingMessage('Creating Student Record...');
                setIsAutoHealing(true);
                const newId = await enrollUserInWorkshop(currentUser.uid, workshopId);
                
                // Construct optimistic enrollment
                const optimisticEnr: Enrollment = {
                    id: newId,
                    userId: currentUser.uid,
                    workshopId: workshopId,
                    course_title: w.title,
                    status: 'in_progress',
                    payment_status: 'paid',
                    exam_payment_status: 'unpaid',
                    progress: 0,
                    currentTopicIndex: 0,
                    enrolledAt: new Date(),
                    progressData: {}
                };
                setEnrollment(optimisticEnr);
             } else {
                // Retry Logic for standard courses (wait for Firestore sync)
                if (retryCount < 2) {
                   setTimeout(() => setRetryCount(prev => prev + 1), 800);
                   return; 
                }
             }
           }
        }

      } catch (e) {
        console.error("Classroom Load Error", e);
      } finally {
        setIsAutoHealing(false);
      }
    };

    loadClassroom();
  }, [workshopId, currentUser, authResolved, retryCount]);


  // --- HANDLERS ---

  const handleTopicComplete = () => {
      if (!workshop?.workshop_structure?.topics) return;
      
      const totalTopics = workshop.workshop_structure.topics.length;
      const currentEnrIndex = enrollment?.currentTopicIndex || 0;

      // Logic: Can we move forward?
      if (activeTopicIndex < currentEnrIndex) {
          // Just moving through already completed topics
          setActiveTopicIndex(prev => prev + 1);
          window.scrollTo(0,0);
      } else {
          // Trying to complete the current tip of progress
          // Check if sections are passed (This check is also done inside TopicViewer, but double check here)
          const pData = enrollment?.progressData?.[`topic_${activeTopicIndex}`];
          const isPassed = pData && pData.section1Score >= 75 && pData.section2Score >= 75 && pData.section3Score >= 75;

          if (isPassed || workshopId?.startsWith('ai-gen')) { // Lenient for AI courses during demo
              if (activeTopicIndex + 1 >= totalTopics) {
                  alert("All modules completed! You can now take the Final Exam.");
                  setViewMode('exam');
              } else {
                  setActiveTopicIndex(prev => prev + 1);
                  window.scrollTo(0,0);
              }
          } else {
              alert("Please complete all topic sections with a passing score first.");
          }
      }
  };

  const handleSectionUpdate = async (key: string, score: number) => {
      if (!enrollment || !currentUser) return;
      await recordTopicProgress(enrollment.id, activeTopicIndex, key, score);
      // Determine if we need to refresh local enrollment state
      // (Simplified: We assume recordTopicProgress updates DB, we could re-fetch or update local state)
      // Updating local state optimally:
      const newProgressData = { ...enrollment.progressData };
      if (!newProgressData[`topic_${activeTopicIndex}`]) {
          newProgressData[`topic_${activeTopicIndex}`] = { 
              completed: false, section1Score: 0, section2Score: 0, section3Score: 0, introViewed: true, revisionViewed: false 
          };
      }
      (newProgressData[`topic_${activeTopicIndex}`] as any)[key] = score;
      
      setEnrollment({ ...enrollment, progressData: newProgressData });
  };

  const handleExamPayment = async () => {
      if (!enrollment) return;
      setPayingExam(true);
      try {
          await payExamFee(enrollment.id);
          setEnrollment({ ...enrollment, exam_payment_status: 'paid', exam_status: 'unlocked' });
          alert("Exam unlocked!");
      } catch (e) {
          alert("Payment simulation failed.");
      } finally {
          setPayingExam(false);
      }
  };

  const handleExamSubmit = async (score: number, passed: boolean) => {
      if (!enrollment) return;
      if (passed) {
          const res = await submitFinalExam(enrollment.id, score, {});
          setEnrollment({ 
              ...enrollment, 
              status: 'completed', 
              certificate_issued: true, 
              certificateId: res.certId,
              exam_status: 'passed'
          });
          setViewMode('certificate');
      } else {
          alert(`You scored ${score.toFixed(1)}%. Pass mark is 76%. Please try again.`);
          setTakingExam(false);
      }
  };

  // --- RENDER HELPERS ---

  if (!authResolved || isAutoHealing) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
              <Loader2 className="animate-spin text-[#D62828] mb-4" size={48} />
              <p className="text-gray-600 font-medium animate-pulse">{loadingMessage}</p>
          </div>
      );
  }

  if (!workshop) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
              <AlertCircle size={64} className="text-red-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Unavailable</h2>
              <p className="text-gray-500 mb-6">We couldn't load the learning environment.</p>
              <Button onClick={() => onNavigate('all-workshops')}>Return to Catalog</Button>
          </div>
      );
  }

  if (!enrollment && !isAutoHealing) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
              <Lock size={64} className="text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-500 mb-6">You need to be enrolled to access this classroom.</p>
              <div className="flex gap-4">
                  <Button onClick={() => onNavigate(`enroll/${workshopId}`)}>Enroll Now</Button>
                  <Button variant="outline" onClick={() => setRetryCount(c => c+1)}>Retry Check</Button>
              </div>
          </div>
      );
  }

  // --- MAIN LAYOUT ---
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-inter">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div>
                <h2 className="font-bold text-gray-900 line-clamp-1">{workshop.title}</h2>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (activeTopicIndex / (workshop.workshop_structure?.topics.length || 1)) * 100)}%` }}></div>
                </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X size={24}/></button>
         </div>
         
         <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {workshop.workshop_structure?.topics.map((topic, idx) => {
                const isLocked = idx > (enrollment?.currentTopicIndex || 0);
                const isActive = idx === activeTopicIndex;
                const isCompleted = idx < (enrollment?.currentTopicIndex || 0);

                return (
                    <button
                        key={topic.id}
                        disabled={isLocked}
                        onClick={() => { setActiveTopicIndex(idx); setViewMode('learn'); setSidebarOpen(false); }}
                        className={`w-full text-left p-4 border-b transition-colors flex items-center justify-between group ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
                    >
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Module {idx + 1}</p>
                            <p className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{topic.title}</p>
                        </div>
                        {isCompleted ? <CheckCircle size={16} className="text-green-500" /> : isLocked ? <Lock size={16} className="text-gray-300" /> : <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </button>
                );
            })}
            
            {/* Exam Button */}
            <button
                disabled={(enrollment?.currentTopicIndex || 0) < (workshop.workshop_structure?.topics.length || 0)}
                onClick={() => { setViewMode('exam'); setSidebarOpen(false); }}
                className={`w-full text-left p-4 border-b flex items-center justify-between ${viewMode === 'exam' ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''}`}
            >
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Final Step</p>
                    <p className="text-sm font-medium text-gray-900">Certification Exam</p>
                </div>
                <Award size={16} className={enrollment?.exam_status === 'passed' ? 'text-green-500' : 'text-yellow-500'} />
            </button>
         </div>

         <div className="p-4 border-t absolute bottom-0 w-full bg-white">
             <Button variant="outline" className="w-full justify-center" onClick={() => onNavigate('dashboard')} icon={LogOut}>
                 Exit Classroom
             </Button>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
         <div className="md:hidden absolute top-4 left-4 z-20">
             <button onClick={() => setSidebarOpen(true)} className="bg-white p-2 rounded-full shadow-md border"><Menu size={20}/></button>
         </div>

         {viewMode === 'learn' && workshop.workshop_structure?.topics[activeTopicIndex] && (
             <TopicViewer 
                topic={workshop.workshop_structure.topics[activeTopicIndex]}
                onTopicComplete={handleTopicComplete}
                progressData={enrollment?.progressData?.[`topic_${activeTopicIndex}`]}
                onSectionComplete={handleSectionUpdate}
             />
         )}

         {viewMode === 'exam' && (
             <div className="min-h-full flex flex-col items-center justify-center p-8">
                 {enrollment?.exam_status === 'passed' ? (
                     <div className="text-center">
                         <Award size={80} className="text-green-500 mx-auto mb-4" />
                         <h2 className="text-3xl font-bold mb-2">Certified!</h2>
                         <p className="text-gray-600 mb-6">You have passed the exam.</p>
                         <Button onClick={() => setViewMode('certificate')}>View Certificate</Button>
                     </div>
                 ) : enrollment?.exam_payment_status !== 'paid' ? (
                     <Card className="max-w-md w-full p-8 text-center">
                         <CreditCard size={48} className="text-blue-500 mx-auto mb-4" />
                         <h2 className="text-2xl font-bold mb-4">Exam Fee Required</h2>
                         <p className="text-gray-600 mb-6">Unlock the final proctored exam to receive your accredited certificate.</p>
                         <div className="bg-gray-100 p-4 rounded-xl mb-6">
                             <div className="flex justify-between font-bold text-gray-800">
                                 <span>Exam Fee</span>
                                 <span>ZMW {workshop.pricing.examination_fee}</span>
                             </div>
                         </div>
                         <Button className="w-full" onClick={handleExamPayment} isLoading={payingExam}>Pay & Unlock</Button>
                     </Card>
                 ) : !takingExam ? (
                     <Card className="max-w-xl w-full p-8 text-center">
                         <Sparkles size={48} className="text-purple-500 mx-auto mb-4" />
                         <h2 className="text-2xl font-bold mb-4">Final Assessment</h2>
                         <p className="text-gray-600 mb-6">You are about to start the final exam. You need 76% to pass.</p>
                         <Button className="w-full" size="lg" onClick={() => setTakingExam(true)}>Start Exam Now</Button>
                     </Card>
                 ) : (
                     <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
                         <QuizView 
                             quiz={workshop.workshop_structure!.final_exam}
                             title={`Final Exam: ${workshop.title}`}
                             onComplete={(score, passed) => handleExamSubmit(score, passed)}
                         />
                     </div>
                 )}
             </div>
         )}

         {viewMode === 'certificate' && enrollment && (
             <div className="min-h-full flex flex-col items-center justify-center p-8 bg-gray-50">
                 <div className="bg-white p-12 rounded-xl shadow-2xl border-8 border-double border-gray-200 text-center max-w-3xl w-full relative">
                     <div className="absolute top-6 left-6 text-[#D62828]"><Award size={40}/></div>
                     <div className="absolute bottom-6 right-6 text-[#D62828]"><Award size={40}/></div>
                     
                     <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Certificate of Completion</h1>
                     <p className="text-gray-500 uppercase tracking-widest mb-8">Innovative Minds Institute</p>
                     
                     <p className="text-lg text-gray-600 mb-2">This certifies that</p>
                     <h2 className="text-3xl font-bold text-blue-900 mb-2 underline decoration-blue-200 decoration-4 underline-offset-4">{currentUser?.displayName || currentUser?.email || 'Student'}</h2>
                     <p className="text-lg text-gray-600 mb-8">has successfully completed</p>
                     
                     <h3 className="text-2xl font-bold text-gray-800 mb-8">{workshop.title}</h3>
                     
                     <div className="flex justify-between items-end border-t pt-8 mt-8">
                         <div className="text-left">
                             <p className="text-xs text-gray-400 uppercase">Date Issued</p>
                             <p className="font-mono font-bold">{new Date().toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                             <p className="text-xs text-gray-400 uppercase">Verification ID</p>
                             <p className="font-mono font-bold text-[#D62828]">{enrollment.certificateId || 'PENDING'}</p>
                         </div>
                     </div>
                 </div>
                 <div className="mt-8 flex gap-4 no-print">
                     <Button variant="outline" onClick={() => window.print()}>Print Certificate</Button>
                     <Button onClick={() => onNavigate('dashboard')}>Return to Dashboard</Button>
                 </div>
             </div>
         )}

      </main>
    </div>
  );
};
