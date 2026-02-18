
import React, { useEffect, useState } from 'react';
import { User, Workshop } from '../types';
import { getWorkshopById, auth, db, doc, setDoc, serverTimestamp } from '../services/firebase';
import { Button, Card } from '../components/UI';
import { JoinClassroomButton } from '../components/JoinClassroomButton';
import { reconstructWorkshopFromId } from '../services/workshopData';
import { 
  CheckCircle, Globe, Users, Trophy, PlayCircle, Lock, 
  ArrowRight, Star, Clock, BookOpen, Briefcase, Zap, ShieldCheck,
  ArrowLeft, ChevronDown, ChevronUp, FileText, Target, Quote, Sparkles, AlertTriangle, RefreshCw
} from 'lucide-react';

interface Props {
  courseId?: string;
  onNavigate: (p: string) => void;
  user?: User | null;
}

export const CourseLandingPage: React.FC<Props> = ({ courseId, onNavigate, user }) => {
  const [course, setCourse] = useState<Workshop | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);
  const [repairing, setRepairing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCourse = async () => {
        if (!courseId) return;
        
        try {
            const c = await getWorkshopById(courseId);
            if (c && isMounted) {
                setCourse(c);
                setLoading(false);
                return;
            }
        } catch (e) {
            console.warn("Initial fetch failed, attempting recovery...");
        }

        // Fallback: If ID looks like AI, try local reconstruction immediately
        if (courseId.startsWith('ai-gen')) {
            const rebuilt = reconstructWorkshopFromId(courseId);
            if (rebuilt && isMounted) {
                setCourse(rebuilt);
                setLoading(false);
                // Persist asynchronously
                setDoc(doc(db, 'workshops', courseId), {
                    ...rebuilt,
                    status: 'published',
                    visible: true,
                    updated_at: serverTimestamp()
                }).catch(e => console.error("Async persist failed", e));
                return;
            }
        }

        // If we reach here, no course found yet. 
        // We let the timeout handle the UI state transition.
    };

    fetchCourse();

    // 3-Second Guard: Prevent infinite spinner
    const timer = setTimeout(() => {
        if (isMounted && loading) {
            setLoading(false);
            setErrorState(true);
        }
    }, 3000);

    return () => { isMounted = false; clearTimeout(timer); };
  }, [courseId, loading]); // Added loading to deps to prevent stale closures

  const handleEnroll = async () => {
    if (!course) return;
    if (!auth.currentUser) {
        onNavigate('login');
    } else {
        onNavigate(`enroll/${course.id}`);
    }
  };

  const handleRepair = async () => {
      if (!courseId) return;
      setRepairing(true);
      setErrorState(false);
      
      // Force reconstruction
      const rebuilt = reconstructWorkshopFromId(courseId);
      if (rebuilt) {
          await setDoc(doc(db, 'workshops', courseId), {
              ...rebuilt,
              status: 'published',
              visible: true,
              created_by: 'landing_page_repair',
              updated_at: serverTimestamp()
          });
          setCourse(rebuilt);
          setLoading(false);
          setRepairing(false);
      } else {
          alert("Course could not be recovered. Returning to catalog.");
          onNavigate('all-workshops');
      }
  };

  const toggleTopic = (idx: number) => {
    setExpandedTopic(expandedTopic === idx ? null : idx);
  };

  // --- LOADING STATE ---
  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
          <div className="animate-spin w-12 h-12 border-4 border-[#D62828] border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-400 animate-pulse">Consulting AI Knowledge Base...</p>
      </div>
  );

  // --- ERROR / NOT FOUND STATE ---
  if (errorState || !course) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 max-w-md mb-8">
              We couldn't load the course data immediately. This often happens with newly generated AI courses.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={handleRepair} isLoading={repairing} icon={RefreshCw}>
                  Repair & Load Course
              </Button>
              <Button variant="outline" onClick={() => onNavigate('all-workshops')}>
                  Return to Catalogue
              </Button>
          </div>
      </div>
  );

  return (
    <div className="font-inter bg-white relative">
      
      {/* 1. FIXED BACK BUTTON LAYER */}
      <div className="fixed top-20 left-4 md:left-8 z-40 animate-in fade-in slide-in-from-left-4 duration-700">
        <button 
            onClick={() => onNavigate('all-workshops')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-full text-sm font-bold text-gray-700 hover:text-[#D62828] hover:border-[#D62828] transition-all"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline">Back to Catalogue</span>
        </button>
      </div>

      {/* 2. FUTURISTIC HERO SECTION */}
      <section className="relative bg-gray-950 text-white overflow-hidden pb-12 pt-24 md:pt-32">
        <div className="absolute inset-0">
          <img 
            src={course.image_url} 
            alt={course.title} 
            className="w-full h-full object-cover opacity-20 scale-105 animate-[pulse_60s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/95 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 animate-in slide-in-from-left-5 duration-700 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Zap size={12} className="fill-current" /> {course.category}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-xl">
              {course.marketing?.hero_headline || course.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light">
              {course.marketing?.hero_subheadline || course.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full max-w-md mx-auto md:max-w-none md:mx-0">
              <JoinClassroomButton 
                 courseId={course.id} 
                 onNavigate={onNavigate} 
                 className="rounded-full px-10 py-4 text-lg bg-[#D62828] hover:bg-red-700 border-none shadow-[0_0_20px_rgba(214,40,40,0.4)] transition-all transform hover:scale-105"
              />
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-10 text-white border-white/30 hover:bg-white/10 backdrop-blur-sm" 
                onClick={() => document.getElementById('curriculum')?.scrollIntoView({behavior: 'smooth'})}
              >
                Syllabus
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs md:text-sm text-gray-400 pt-4 font-medium">
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><Users size={14} className="text-blue-400"/> 1,200+ Learners</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><Star size={14} className="text-yellow-400 fill-current"/> 4.9 Rating</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><Globe size={14} className="text-green-400"/> Global Cert</span>
            </div>
          </div>
          
          {/* Enhanced Hero Card */}
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-3xl shadow-2xl overflow-hidden hidden md:block transform hover:-translate-y-2 transition-transform duration-500 relative">
             <div className="absolute top-0 right-0 p-4 z-20">
                <div className="bg-[#D62828] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">POPULAR</div>
             </div>
             <div className="h-56 bg-gray-900 relative group cursor-pointer" onClick={handleEnroll}>
                <img src={course.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Preview"/>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <PlayCircle size={32} className="text-white fill-white/20" />
                   </div>
                </div>
             </div>
             <div className="p-6 space-y-4 bg-white text-gray-900">
                <div className="flex justify-between items-baseline">
                   <span className="font-black text-3xl text-[#D62828]">{course.price ? `$${course.price}` : 'Free'}</span>
                   <span className="text-sm line-through text-gray-400">$199.00</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Duration</span>
                        <span className="font-bold">{(course.durationMinutes || 120) / 60} Hours</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Level</span>
                        <span className="font-bold">{course.level}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span>Access</span>
                        <span className="font-bold">Lifetime</span>
                    </div>
                </div>
                
                <JoinClassroomButton 
                   courseId={course.id} 
                   onNavigate={onNavigate} 
                   className="w-full font-bold shadow-lg"
                />
                
                <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={10} /> 30-Day Money-Back Guarantee
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. WHO IS THIS FOR */}
      <section className="py-16 md:py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-blue-100">
                  <Sparkles size={16} className="text-blue-500" /> AI Match: Strong Fit
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Is This Course For You?</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">This curriculum has been designed to align with specific career goals and learner profiles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="p-6 border-t-4 border-t-blue-500 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                     <Briefcase size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">The Career Starter</h3>
                  <p className="text-sm text-gray-600">You are looking to enter the {course.category} field with a verified certification that employers respect.</p>
               </Card>

               <Card className="p-6 border-t-4 border-t-purple-500 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                     <Zap size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">The Skill Upgrader</h3>
                  <p className="text-sm text-gray-600">You already have some experience but need to modernize your toolkit with current best practices.</p>
               </Card>

               <Card className="p-6 border-t-4 border-t-green-500 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                     <Clock size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">The Flexible Learner</h3>
                  <p className="text-sm text-gray-600">You need a self-paced structure that fits around your job or studies, accessible offline.</p>
               </Card>
            </div>
         </div>
      </section>

      {/* 4. WHAT YOU WILL GAIN */}
      <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">What You Will Gain</h2>
                  <div className="space-y-4">
                     {course.marketing?.what_you_will_gain?.slice(0, 5).map((gain, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-red-200 transition-colors">
                           <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-[#D62828] flex-shrink-0 mt-0.5">
                              <CheckCircle size={16}/>
                           </div>
                           <p className="font-medium text-gray-800 text-sm md:text-base">{gain}</p>
                        </div>
                     ))}
                  </div>
                  <Button className="mt-8" variant="outline" onClick={() => document.getElementById('curriculum')?.scrollIntoView({behavior: 'smooth'})}>
                     See Full Curriculum
                  </Button>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl transform rotate-3"></div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl relative border border-gray-100">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Certificate of Achievement
                     </h3>
                     <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                           <ShieldCheck className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Official IMI Digital Certificate</p>
                        <p className="text-gray-400 text-xs mt-2">Verified & Shareable on LinkedIn</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. DYNAMIC CURRICULUM ACCORDION */}
      <section id="curriculum" className="py-20 bg-white">
         <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
               <span className="text-[#D62828] font-bold tracking-widest uppercase text-xs">Syllabus</span>
               <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Inside The Curriculum</h2>
               <p className="text-gray-500 mt-4">A structured path from beginner to advanced mastery.</p>
            </div>
            
            <div className="space-y-4">
               {course.workshop_structure?.topics.map((topic, i) => (
                  <div key={i} className={`border rounded-2xl transition-all duration-300 ${expandedTopic === i ? 'border-gray-300 shadow-md bg-white' : 'border-gray-100 bg-gray-50 hover:bg-white'}`}>
                     <button 
                        onClick={() => toggleTopic(i)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${expandedTopic === i ? 'bg-[#D62828] text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {i + 1}
                           </div>
                           <div>
                              <h4 className={`font-bold text-lg ${expandedTopic === i ? 'text-gray-900' : 'text-gray-600'}`}>{topic.title}</h4>
                              <p className="text-xs text-gray-400 mt-1 hidden sm:block">3 Lessons • 1 Quiz • 45 Mins</p>
                           </div>
                        </div>
                        {expandedTopic === i ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                     </button>
                     
                     {/* Accordion Content */}
                     {expandedTopic === i && (
                        <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                           <div className="h-px w-full bg-gray-100 mb-4"></div>
                           <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors cursor-default">
                                 <div className="flex items-center gap-3">
                                    <PlayCircle size={16} className="text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Video Lecture</span>
                                 </div>
                                 <span className="text-xs text-gray-400">15:00</span>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors cursor-default">
                                 <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">Study Notes</span>
                                 </div>
                                 <span className="text-xs text-gray-400">Read</span>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors cursor-default">
                                 <div className="flex items-center gap-3">
                                    <Target size={16} className="text-green-500" />
                                    <span className="text-sm font-medium text-gray-700">Assessment Quiz</span>
                                 </div>
                                 <span className="text-xs text-gray-400">15 Qs</span>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. FINAL CTA & URGENCY */}
      <section className="py-20 bg-white border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full font-bold text-sm mb-6 animate-pulse">
               <Clock size={16} /> {course.marketing?.urgency_msg || "Enrollment closing soon."}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900">Start Your Learning Journey Now</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               {/* SMART BUTTON */}
               <JoinClassroomButton 
                  courseId={course.id} 
                  onNavigate={onNavigate} 
                  className="rounded-full px-12 py-5 text-xl shadow-2xl bg-[#D62828] hover:bg-red-700 w-full sm:w-auto"
               />
            </div>
            <p className="mt-6 text-gray-500 text-sm">
               <Lock size={12} className="inline mr-1" /> Secure SSL Encrypted Enrollment
            </p>
         </div>
      </section>
    </div>
  );
};
