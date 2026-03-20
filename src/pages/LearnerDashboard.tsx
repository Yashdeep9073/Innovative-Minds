
import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/UI';
import { User, Enrollment, TutorRequest } from '../types';
import { getUserEnrollments } from '../services/firebase';
import { 
  LayoutDashboard, BookOpen, Award, CreditCard, Bell, Settings, HelpCircle, 
  Plus, Home, User as UserIcon, LogOut, ChevronRight, Crown, GraduationCap
} from 'lucide-react';
import { 
  WelcomeHeader, ResumeHero, TaskCompass, 
  ActiveCourseCard, SkillMapWidget, BadgeWidget, TimelineWidget,
  StudyPlannerWidget, SuccessPredictorWidget,
  AICopilotWidget, GoogleDriveVault,
  StudentIdCard, DegreeMapWidget, AcademicCalendar, AdvisorPanel,
  MasteryRings, SmartReviewWidget, VelocityTracker, ReflectionPrompt
} from '../components/DashboardWidgets';
import { ApplicationStatusTracker } from '../components/SmartEnrollmentWidgets';
import { SettingsView, PaymentsView, CertificatesView, NoticesView, SupportView } from '../components/DashboardExtensions';

// Mobile Bottom Navigation Dock
interface MobileDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (p: string) => void;
}

const MobileDock: React.FC<MobileDockProps> = ({ activeTab, setActiveTab, onNavigate }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
     <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-[#D62828]' : 'text-gray-400'}`}>
        <Home size={20} />
        <span className="text-[10px] font-medium">Home</span>
     </button>
     <button onClick={() => setActiveTab('courses')} className={`flex flex-col items-center gap-1 ${activeTab === 'courses' ? 'text-[#D62828]' : 'text-gray-400'}`}>
        <BookOpen size={20} />
        <span className="text-[10px] font-medium">Courses</span>
     </button>
     <div className="relative -top-6">
        <button 
           onClick={() => onNavigate('all-workshops')} 
           className="w-14 h-14 bg-[#D62828] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-gray-50 transform active:scale-95 transition-transform"
        >
           <Plus size={24} />
        </button>
     </div>
     <button onClick={() => setActiveTab('certificates')} className={`flex flex-col items-center gap-1 ${activeTab === 'certificates' ? 'text-[#D62828]' : 'text-gray-400'}`}>
        <Award size={20} />
        <span className="text-[10px] font-medium">Awards</span>
     </button>
     <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-[#D62828]' : 'text-gray-400'}`}>
        <UserIcon size={20} />
        <span className="text-[10px] font-medium">Profile</span>
     </button>
  </div>
);

// Sidebar Component
interface DesktopSidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ user, activeTab, setActiveTab }) => (
  <aside className="w-64 bg-white border-r hidden md:block fixed h-full z-10 top-16">
     <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg border border-gray-200">
              {user.name.charAt(0)}
           </div>
           <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
           </div>
        </div>
        
        <nav className="space-y-1 flex-1">
           {[
              { id: 'overview', icon: LayoutDashboard, label: 'Command Center' },
              { id: 'courses', icon: BookOpen, label: 'My Courses' },
              { id: 'certificates', icon: Award, label: 'Certificates' },
              { id: 'payments', icon: CreditCard, label: 'Financials' },
              { id: 'notices', icon: Bell, label: 'Notices' },
              { id: 'support', icon: HelpCircle, label: 'Support Hub' },
              { id: 'settings', icon: Settings, label: 'Settings' },
           ].map(item => (
              <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === item.id 
                    ? 'bg-red-50 text-[#D62828] shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                 }`}
              >
                 <div className="flex items-center gap-3">
                    <item.icon size={18} /> {item.label}
                 </div>
                 {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-[#D62828]"></div>}
              </button>
           ))}
        </nav>

        <div className="pt-4 border-t mt-4">
           <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-red-600 transition-colors w-full">
              <LogOut size={16} /> Sign Out
           </button>
        </div>
     </div>
  </aside>
);

// New Widget: Matched Tutor
const TutorWidget: React.FC<{ match: TutorRequest | null }> = ({ match }) => {
    if (!match) return null;

    return (
        <Card className="p-6 h-full border-l-4 border-l-blue-600 bg-blue-50/50">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-600"/> Academic Tutor
                </h3>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">ACTIVE</span>
            </div>
            <div className="items-center gap-4 mb-4 flex">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 border border-blue-100">VT</div>
                <div>
                    <p className="font-bold text-sm">{match.matchedTutorName}</p>
                    <p className="text-xs text-gray-500">{match.universityName}</p>
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-600 border-b border-blue-100 pb-1">
                    <span>Subject</span>
                    <span className="font-medium">{match.selectedModules[0]}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 pb-1">
                    <span>Sessions Left</span>
                    <span className="font-medium">1 (Free)</span>
                </div>
            </div>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">Chat with Tutor</Button>
        </Card>
    );
};

// New Widget: Premium Upsell
const PremiumUpsell = () => (
    <Card className="p-6 h-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-20"><Crown size={64}/></div>
        <h3 className="font-black text-xl mb-2 relative z-10 flex items-center gap-2"><Crown size={20}/> Premium Access</h3>
        <p className="text-sm font-medium mb-4 relative z-10 opacity-90">Unlock unlimited mock exams, past papers, and 24/7 priority tutor chat.</p>
        <ul className="text-xs space-y-1 mb-6 relative z-10">
            <li>• Unlimited Revision</li>
            <li>• 5 Tutor Sessions/Week</li>
            <li>• Verified Certificates</li>
        </ul>
        <Button size="sm" className="w-full bg-white text-orange-600 hover:bg-gray-100 border-none font-bold relative z-10">Upgrade Now</Button>
    </Card>
);

export const LearnerDashboard: React.FC<{ user: User; onNavigate: (p: string) => void }> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tutorRequest] = useState<TutorRequest | null>(() => {
    const stored = localStorage.getItem('lastTutorRequest');
    if (stored) return JSON.parse(stored);
    return user?.universityProfile || null;
  });

  // Data Fetching
  useEffect(() => {
    if (user?.id) {
       getUserEnrollments(user.id).then(data => {
          setEnrollments(data);
          setLoading(false);
       });
    }
  }, [user]);

  // Derived State
  const activeEnrollments = enrollments.filter(e => e.status === 'in_progress');
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending_review' || e.status === 'draft');
  const resumeCourse = activeEnrollments.sort((a, b) => {
    const da = a.lastAccessed?.toDate ? a.lastAccessed.toDate() : new Date(a.lastAccessed || 0);
    const db = b.lastAccessed?.toDate ? b.lastAccessed.toDate() : new Date(b.lastAccessed || 0);
    return db.getTime() - da.getTime();
  })[0] || null;

  return (
     <div className="min-h-screen bg-gray-50/50 flex font-inter pb-20 md:pb-0">
        <DesktopSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8 max-w-7xl mx-auto w-full">
           
           {/* Top Bar (Mobile Only - Simplified) */}
           <div className="md:hidden flex justify-between items-center mb-6">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Dashboard</h1>
              <div className="w-8 h-8 rounded-full bg-[#D62828] text-white flex items-center justify-center font-bold text-sm">
                 {user.name.charAt(0)}
              </div>
           </div>

           {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-2 border-[#D62828]"></div></div>
           ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                 
                 {/* VIEW: OVERVIEW (COMMAND CENTER) */}
                 {activeTab === 'overview' && (
                    <div className="space-y-6 md:space-y-8">
                       <WelcomeHeader user={user} activeCount={activeEnrollments.length} />
                       
                       {/* MAIN DASHBOARD GRID */}
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          
                          {/* ROW 1: University Identity & Core Actions */}
                          <div className="col-span-1 md:col-span-1 h-64">
                             <StudentIdCard user={user} />
                          </div>
                          
                          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-2 h-full">
                             {resumeCourse ? (
                                <div className="h-full min-h-[300px] flex flex-col gap-4">
                                   <ResumeHero enrollment={resumeCourse} onContinue={(id) => onNavigate(`player/${id}`)} />
                                   <div className="grid grid-cols-2 gap-4 h-full">
                                      <ReflectionPrompt />
                                      <VelocityTracker />
                                   </div>
                                </div>
                             ) : (
                                <div className="bg-gray-900 rounded-2xl p-8 text-center text-white h-full flex flex-col justify-center items-center">
                                   <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                                   <h3 className="text-xl font-bold mb-2">Ready to start learning?</h3>
                                   <p className="text-gray-400 mb-6">Explore our catalog and enroll in your first course today.</p>
                                   <Button onClick={() => onNavigate('all-workshops')}>Browse Catalog</Button>
                                </div>
                             )}
                          </div>

                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-64">
                             <SmartReviewWidget />
                          </div>

                          {/* ROW 2: Academic Core */}
                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-80">
                             <AdvisorPanel />
                          </div>
                          
                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-80">
                             <AcademicCalendar enrollments={enrollments} />
                          </div>

                          {/* ROW 3: Degree Map (Full Width) */}
                          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                             <DegreeMapWidget enrollments={enrollments} />
                          </div>

                          {/* ROW 4: Tools & Intelligence */}
                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-80">
                             {tutorRequest ? <TutorWidget match={tutorRequest} /> : <TaskCompass enrollments={activeEnrollments} />}
                          </div>
                          
                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-80">
                             <AICopilotWidget />
                          </div>

                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-80">
                             <PremiumUpsell />
                          </div>

                          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 h-80">
                             <GoogleDriveVault />
                          </div>

                          {/* ROW 5: Analytics & Extras */}
                          <div className="col-span-1 md:col-span-1 h-64">
                             <MasteryRings enrollments={activeEnrollments} />
                          </div>
                          <div className="col-span-1 md:col-span-1 h-64">
                             <SkillMapWidget enrollments={enrollments} />
                          </div>
                          <div className="col-span-1 md:col-span-1 h-64">
                             <BadgeWidget enrollments={enrollments} userPoints={user.points || 0} />
                          </div>
                          <div className="col-span-1 md:col-span-1 h-64">
                             <TimelineWidget enrollments={enrollments} />
                          </div>

                       </div>

                       {/* Pending Applications Section */}
                       {pendingEnrollments.length > 0 && (
                          <div className="mt-8">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Applications
                             </h3>
                             {pendingEnrollments.map(pe => (
                                <ApplicationStatusTracker 
                                   key={pe.id} 
                                   status={pe.status} 
                                   currentStep={pe.status === 'draft' ? 1 : pe.status === 'pending_review' ? 2 : 3} 
                                   courseTitle={pe.course_title || "Pending Course"} 
                                />
                             ))}
                          </div>
                       )}

                       {/* Active Courses Grid */}
                       {activeEnrollments.length > 0 && (
                          <div className="mt-8">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900">In Progress</h3>
                                <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                   View All <ChevronRight size={12}/>
                                </button>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {activeEnrollments.slice(0, 4).map(e => (
                                   <ActiveCourseCard key={e.id} enrollment={e} onContinue={() => onNavigate(`player/${e.workshopId}`)} />
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 )}

                 {/* VIEW: COURSES */}
                 {activeTab === 'courses' && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {enrollments.map(e => (
                             <ActiveCourseCard key={e.id} enrollment={e} onContinue={() => onNavigate(`player/${e.workshopId}`)} />
                          ))}
                          <button 
                             onClick={() => onNavigate('all-workshops')}
                             className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-[#D62828] hover:text-[#D62828] hover:bg-red-50 transition-all min-h-[200px]"
                          >
                             <Plus size={32} className="mb-2" />
                             <span className="font-bold">Find New Course</span>
                          </button>
                       </div>
                    </div>
                 )}

                 {/* VIEW: EXTENSIONS */}
                 {activeTab === 'certificates' && <CertificatesView user={user} />}
                 {activeTab === 'payments' && <PaymentsView user={user} />}
                 {activeTab === 'notices' && <NoticesView />}
                 {activeTab === 'settings' && <SettingsView user={user} />}
                 {activeTab === 'support' && <SupportView />}
              </div>
           )}
        </div>

        {/* Mobile Navigation Dock */}
        <MobileDock activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
     </div>
  );
};
