
import React, { useMemo, useState } from 'react';
import { Enrollment, Workshop } from '../types';
import { ProgressBar } from './ProgressBar';
import { Button, Card, Input } from './UI';
import { JoinClassroomButton } from './JoinClassroomButton'; // NEW IMPORT
import { 
  PlayCircle, CheckCircle, Clock, Zap, Award, BookOpen, AlertTriangle, 
  Calendar, ArrowRight, Target, Activity, Flame, ChevronRight, Star,
  TrendingUp, BarChart3, Shield, Brain, MoreHorizontal, Folder, FileText,
  MessageSquare, Sparkles, Layout, Video, Download, Bot, User, Bell, 
  Lightbulb, AlertCircle, Smile, Frown, Meh, Send, MapPin
} from 'lucide-react';
import { formatDuration } from '../utils/helpers';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, AreaChart, Area, CartesianGrid, RadialBarChart, RadialBar, Legend } from 'recharts';

// --- 1. ACADEMIC STANDING INDICATOR ---
export const AcademicStandingBadge: React.FC<{ standing?: 'Good Standing' | 'At Risk' | 'Honors Track' }> = ({ standing = 'Good Standing' }) => {
  const styles = {
    'Good Standing': 'bg-green-100 text-green-800 border-green-200',
    'At Risk': 'bg-red-100 text-red-800 border-red-200',
    'Honors Track': 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${styles[standing]}`}>
      <Shield size={12} fill="currentColor" className="opacity-50" />
      {standing}
    </div>
  );
};

// --- 2. INSTITUTIONAL IDENTITY (STUDENT ID) ---
export const StudentIdCard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D62828] rounded flex items-center justify-center font-bold text-xs">IMI</div>
          <span className="font-bold tracking-widest text-sm opacity-80">STUDENT ID</span>
        </div>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IMI-STUDENT" alt="QR" className="w-12 h-12 rounded bg-white p-1" />
      </div>
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gray-700 rounded-full mb-4 border-2 border-white/20 overflow-hidden">
           <div className="w-full h-full flex items-center justify-center bg-gray-600 text-2xl">{user.name.charAt(0)}</div>
        </div>
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-sm text-gray-400 font-mono mb-1">{user.studentNumber || 'IMI-2026-001'}</p>
        <p className="text-xs text-[#D62828] font-bold uppercase">{user.programName || 'General Studies'}</p>
      </div>
    </Card>
  );
};

// --- 3. ACADEMIC PROGRESS DEGREE MAP ---
export const DegreeMapWidget: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  return (
    <Card className="p-6 h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" /> Academic Pathway
        </h3>
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">Year 1</span>
      </div>
      <div className="relative flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
        
        {/* Nodes */}
        {enrollments.slice(0, 5).map((e, i) => (
          <div key={e.id} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer" style={{minWidth: '100px'}}>
            <div className={`w-4 h-4 rounded-full border-2 ${e.status === 'completed' ? 'bg-green-500 border-green-500' : e.status === 'in_progress' ? 'bg-white border-blue-500 animate-pulse' : 'bg-white border-gray-300'}`}></div>
            <div className={`p-3 rounded-xl border w-32 text-center transition-all ${e.status === 'in_progress' ? 'bg-blue-50 border-blue-200 shadow-md scale-105' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
              <p className="text-xs font-bold line-clamp-2 mb-1">{e.course_title}</p>
              <span className={`text-[10px] uppercase font-bold ${e.status === 'completed' ? 'text-green-600' : e.status === 'in_progress' ? 'text-blue-600' : 'text-gray-400'}`}>
                {e.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
        {/* Future Nodes */}
        {[1, 2].map((i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 opacity-50" style={{minWidth: '100px'}}>
            <div className="w-4 h-4 rounded-full border-2 bg-white border-gray-200"></div>
            <div className="p-3 rounded-xl border border-dashed border-gray-300 w-32 text-center bg-gray-50">
              <p className="text-xs font-bold text-gray-400">Elective {i}</p>
              <span className="text-[10px] text-gray-400">Required</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// --- 4. UNIFIED ACADEMIC CALENDAR ---
export const AcademicCalendar: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const events = [
    { day: '12', month: 'OCT', title: 'Mid-Term Exam', course: 'Cybersecurity', type: 'exam' },
    { day: '15', month: 'OCT', title: 'Project Due', course: 'Python Data', type: 'assignment' },
    { day: '20', month: 'OCT', title: 'Guest Lecture', course: 'Ethics', type: 'event' },
  ];

  return (
    <Card className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Calendar size={18} className="text-[#D62828]" /> Schedule
        </h3>
        <button className="text-xs text-gray-500 hover:text-[#D62828]">View All</button>
      </div>
      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-4 items-center group cursor-pointer">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border ${ev.type === 'exam' ? 'bg-red-50 border-red-100 text-red-600' : ev.type === 'assignment' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <span className="text-[10px] font-bold uppercase">{ev.month}</span>
              <span className="text-lg font-black leading-none">{ev.day}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800 group-hover:text-[#D62828] transition-colors">{ev.title}</h4>
              <p className="text-xs text-gray-500">{ev.course}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// --- 5. DIGITAL ACADEMIC ADVISOR ---
export const AdvisorPanel: React.FC = () => {
  return (
    <Card className="p-0 h-full flex flex-col overflow-hidden border-l-4 border-l-indigo-500">
      <div className="p-6 bg-indigo-50/50 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Academic Advisor</h3>
            <p className="text-xs text-indigo-600 font-medium">Dr. Sarah M.</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none text-xs text-gray-600 border border-gray-100">
          Welcome to the semester! Please review your Degree Map and confirm your electives by Friday.
        </div>
        <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none text-xs text-gray-600 border border-gray-100">
          I noticed you're excelling in Python. Have you considered the Advanced Data Science track?
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50">
        <button className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2">
          <MessageSquare size={14} /> Send Message
        </button>
      </div>
    </Card>
  );
};

// --- 6. MASTERY-BASED PROGRESS INDICATORS ---
export const MasteryRings: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  // Mock Mastery Data derived from course categories
  const data = [
    { name: 'Tech', x: 85, fill: '#3B82F6' },
    { name: 'Biz', x: 60, fill: '#10B981' },
    { name: 'Core', x: 92, fill: '#F59E0B' },
  ];

  return (
    <Card className="p-6 h-full flex flex-col items-center justify-center relative">
      <div className="absolute top-6 left-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Target size={18} className="text-purple-600" /> Skill Mastery
        </h3>
      </div>
      <div className="w-full h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadialBarChart innerRadius="30%" outerRadius="100%" data={data} startAngle={180} endAngle={0} cy="70%">
            <RadialBar background dataKey="x" cornerRadius={10} />
            <Legend iconSize={8} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-gray-400 -mt-8">Based on quiz performance</p>
    </Card>
  );
};

// --- 7. ACTIVE RECALL ENGINE (SMART REVIEW) ---
export const SmartReviewWidget: React.FC = () => {
  return (
    <Card className="p-6 bg-gradient-to-r from-[#D62828] to-red-700 text-white shadow-xl h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Brain size={20} className="text-yellow-300" /> Smart Review
        </h3>
        <span className="bg-white/20 text-xs px-2 py-1 rounded font-bold">3 Items</span>
      </div>
      <p className="text-sm text-red-100 mb-6">Spaced repetition is due for:</p>
      <ul className="space-y-3 mb-6">
        <li className="flex items-center gap-3 text-sm font-medium bg-black/20 p-2 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div> Cloud Security Basics
        </li>
        <li className="flex items-center gap-3 text-sm font-medium bg-black/20 p-2 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div> Python Loops
        </li>
      </ul>
      <Button className="w-full bg-white text-[#D62828] hover:bg-gray-100 border-none font-bold">Start 5-Min Review</Button>
    </Card>
  );
};

// --- 8. PERSONAL LEARNING VELOCITY TRACKER ---
export const VelocityTracker: React.FC = () => {
  const data = [
    { day: 'M', speed: 40 }, { day: 'T', speed: 60 }, { day: 'W', speed: 30 },
    { day: 'T', speed: 80 }, { day: 'F', speed: 50 }, { day: 'S', speed: 90 }, { day: 'S', speed: 40 }
  ];

  return (
    <Card className="p-6 h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Activity size={18} className="text-green-600" /> Learning Velocity
        </h3>
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} cursor={{ stroke: '#E5E7EB' }} />
            <Area type="monotone" dataKey="speed" stroke="#10B981" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">Modules completed per day</p>
    </Card>
  );
};

// --- 9. CONCEPT CONFIDENCE RATING ---
export const ConfidenceRating: React.FC = () => {
  const [rated, setRated] = useState(false);
  
  if (rated) return (
    <div className="p-4 bg-green-50 rounded-xl text-center text-green-700 text-sm font-bold border border-green-100 animate-in zoom-in">
      <CheckCircle size={16} className="mx-auto mb-1"/> Thanks for feedback!
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
      <p className="text-xs text-gray-500 font-bold uppercase mb-2">Confidence Check</p>
      <p className="text-sm font-bold text-gray-800 mb-3">How confident are you with "React Hooks"?</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setRated(true)} className="hover:scale-125 transition-transform text-2xl" title="Confused">😕</button>
        <button onClick={() => setRated(true)} className="hover:scale-125 transition-transform text-2xl" title="Okay">😐</button>
        <button onClick={() => setRated(true)} className="hover:scale-125 transition-transform text-2xl" title="Confident">😎</button>
      </div>
    </div>
  );
};

// --- 10. APPLICATION-FIRST LEARNING PROMPT ---
export const ReflectionPrompt: React.FC = () => {
  const [value, setValue] = useState('');
  
  return (
    <Card className="p-6 h-full bg-yellow-50 border-yellow-100">
      <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
        <Lightbulb size={18} className="text-yellow-600" /> Reflection
      </h3>
      <p className="text-sm text-yellow-800 mb-3">How will you apply <strong>Cybersecurity Basics</strong> in your current role?</p>
      <div className="relative">
        <textarea 
          className="w-full p-3 rounded-lg border border-yellow-200 bg-white text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
          rows={3}
          placeholder="I will use this to..."
          value={value}
          onChange={e => setValue(e.target.value)}
        ></textarea>
        <button className="absolute bottom-2 right-2 p-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md transition-colors">
          <Send size={14} />
        </button>
      </div>
    </Card>
  );
};

// --- SMART WELCOME HEADER (Enhanced) ---
export const WelcomeHeader: React.FC<{ user: { name: string, points?: number }; activeCount: number }> = ({ user, activeCount }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name.split(' ')[0];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
        <Activity size={150} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-2 py-1 rounded-md bg-red-50 text-[#D62828] text-[10px] font-bold uppercase tracking-wider border border-red-100">
              Student Command Center
           </span>
           <AcademicStandingBadge standing="Good Standing" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {greeting}, {firstName}.
        </h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">
          You have <span className="text-gray-900 font-bold">{activeCount} active courses</span>. Your academic path is on track.
        </p>
      </div>
      <div className="hidden md:block text-right relative z-10">
         <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Learning Score</div>
         <div className="text-4xl font-black text-[#D62828] flex items-center justify-end gap-2">
            <Flame size={32} className="text-orange-500" fill="currentColor" />
            {user.points || 0}
         </div>
      </div>
    </div>
  );
};

// Updated: ResumeHero now uses JoinClassroomButton internally for routing
export const ResumeHero: React.FC<{ enrollment: Enrollment | null; onContinue: (id: string) => void }> = ({ enrollment, onContinue }) => {
  if (!enrollment || !enrollment.workshop) return null;
  const { workshop, progress, currentTopicIndex } = enrollment;
  const currentModule = workshop.workshop_structure?.topics[currentTopicIndex]?.title || "Next Module";

  return (
    <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer h-full flex flex-col justify-center" onClick={() => onContinue(workshop.id)}>
      <div className="absolute inset-0 opacity-40">
        <img src={workshop.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Course BG" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">
           <Activity size={14} className="animate-pulse"/> Continue Watching
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight line-clamp-2">{workshop.title}</h2>
        <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-1">Up Next: <span className="text-white font-bold">{currentModule}</span></p>
        <div className="flex items-center gap-4">
           {/* REPLACED BUTTON WITH SMART COMPONENT */}
           <JoinClassroomButton 
              courseId={workshop.id} 
              onNavigate={onContinue} 
              className="rounded-full pl-6 pr-8 bg-[#D62828] hover:bg-red-700 border-none shadow-[0_0_20px_rgba(214,40,40,0.4)] transition-all transform group-hover:scale-105"
           />
           <div className="flex-1 max-w-[150px] hidden md:block">
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{Math.round(progress)}%</span></div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }}></div></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const TaskCompass: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const tasks = enrollments.filter(e => e.status === 'in_progress').slice(0, 3).map(e => ({
       id: e.id, title: `Complete ${e.workshop?.workshop_structure?.topics[e.currentTopicIndex]?.title || 'Next Topic'}`, course: e.course_title, deadline: 'Today', priority: e.progress > 80 ? 'High' : 'Normal'
    }));
  if (tasks.length === 0) return <Card className="p-6 h-full flex flex-col items-center justify-center text-center bg-gray-50 border-dashed"><CheckCircle size={32} className="text-gray-300 mb-2" /><p className="text-gray-500 text-sm">No pending tasks.</p></Card>;
  return (
    <Card className="p-0 overflow-hidden h-full flex flex-col">
       <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white"><h3 className="font-bold text-gray-900 flex items-center gap-2"><Target size={18} className="text-[#D62828]" /> Priority Tasks</h3><span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{tasks.length}</span></div>
       <div className="divide-y divide-gray-50 flex-1">{tasks.map((t, i) => (
             <div key={i} className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer flex items-center gap-3"><div className={`w-1.5 h-8 rounded-full ${t.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div><div className="flex-1 min-w-0"><h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-[#D62828] transition-colors">{t.title}</h4><p className="text-xs text-gray-500 truncate">{t.course}</p></div><ChevronRight size={16} className="text-gray-300 group-hover:text-[#D62828]" /></div>))}</div>
    </Card>
  );
};

export const AnalyticsPulse: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const data = [{ day: 'M', hours: 1.2 }, { day: 'T', hours: 2.5 }, { day: 'W', hours: 0.8 }, { day: 'T', hours: 3.1 }, { day: 'F', hours: 1.5 }, { day: 'S', hours: 4.2 }, { day: 'S', hours: 2.0 }];
  return (
    <Card className="p-6 h-full flex flex-col">
       <div className="flex justify-between items-start mb-4"><h3 className="font-bold text-gray-900 flex items-center gap-2"><BarChart3 size={18} className="text-blue-600" /> Velocity</h3><span className="text-xs font-mono text-gray-400">7 Days</span></div>
       <div className="h-32 w-full mt-auto"><ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={data}><defs><linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} cursor={{ stroke: '#E5E7EB' }} /><Area type="monotone" dataKey="hours" stroke="#3B82F6" fillOpacity={1} fill="url(#colorHours)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
    </Card>
  );
};

// Updated: ActiveCourseCard now uses JoinClassroomButton for robust linking
export const ActiveCourseCard: React.FC<{ enrollment: Enrollment; onContinue: (path: string) => void }> = ({ enrollment, onContinue }) => {
  const { workshop, progress, status } = enrollment;
  if (!workshop) return null;
  const isComplete = status === 'completed' || progress >= 100;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all flex flex-col h-full group">
      <div className="flex gap-4 items-start mb-4">
        <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative">
          {workshop.image_url ? <img src={workshop.image_url} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500"><BookOpen size={20} /></div>}
          {isComplete && <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center text-white"><CheckCircle size={24}/></div>}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 truncate text-sm leading-tight mb-1" title={workshop.title}>{workshop.title}</h4>
          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block uppercase tracking-wide font-medium">{workshop.category}</span>
        </div>
      </div>
      <div className="mt-auto space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase"><span>{isComplete ? 'Completed' : 'Progress'}</span><span>{Math.round(progress)}%</span></div>
          <ProgressBar progress={progress} height="h-1.5" colorClass={isComplete ? 'bg-green-500' : 'bg-[#D62828]'} />
        </div>
        <div className="space-y-2">
           {isComplete ? (
              <Button onClick={() => onContinue(`player/${workshop.id}`)} size="sm" variant="outline" className="w-full flex items-center justify-center gap-2 h-8 text-xs">Review Course</Button>
           ) : (
              <JoinClassroomButton 
                 courseId={workshop.id} 
                 onNavigate={onContinue} 
                 size="sm" 
                 className="w-full flex items-center justify-center gap-2 h-8 text-xs"
              />
           )}
           <ConfidenceRating />
        </div>
      </div>
    </div>
  );
};

export const SkillMapWidget: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const stats: Record<string, { total: number, completed: number }> = {};
  enrollments.forEach(e => {
    if (!e.workshop) return;
    const cat = e.workshop.category || 'General';
    if (!stats[cat]) stats[cat] = { total: 0, completed: 0 };
    stats[cat].total += 1;
    if (e.status === 'completed' || e.progress >= 100) stats[cat].completed += 1;
  });
  const categories = Object.keys(stats);
  return (
    <Card className="p-6 h-full">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Skill Map</h3>
      {categories.length === 0 ? <div className="text-center text-gray-400 text-sm py-4">No data</div> : (
         <div className="space-y-4">
            {categories.map(cat => {
               const { total, completed } = stats[cat];
               const percentage = (completed / total) * 100;
               return (
               <div key={cat}>
                  <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-700">{cat}</span><span className="text-gray-500">{completed}/{total}</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.max(5, percentage)}%` }}></div></div>
               </div>
               );
            })}
         </div>
      )}
    </Card>
  );
};

export const BadgeWidget: React.FC<{ enrollments: Enrollment[], userPoints: number }> = ({ enrollments, userPoints }) => {
  const badges = [
    { id: 'first_step', name: 'Starter', desc: 'Enrolled', icon: '🚀', achieved: enrollments.length > 0 },
    { id: 'scholar', name: 'Scholar', desc: 'Completed', icon: '🎓', achieved: enrollments.some(e => e.status === 'completed') },
    { id: 'master', name: 'Master', desc: '1000+ XP', icon: '👑', achieved: userPoints >= 1000 },
    { id: 'dedicated', name: 'Pro', desc: '3 Active', icon: '🔥', achieved: enrollments.length >= 3 },
  ];
  return (
    <Card className="p-6 h-full">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award size={18} className="text-[#D62828]" /> Awards</h3>
      <div className="grid grid-cols-2 gap-3">
        {badges.map(badge => (
          <div key={badge.id} className={`p-3 rounded-lg border flex flex-col items-center text-center transition-colors ${badge.achieved ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'}`}>
            <div className="text-2xl mb-1">{badge.icon}</div>
            <div className="text-xs font-bold text-gray-800">{badge.name}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const TimelineWidget: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const sorted = [...enrollments].sort((a, b) => {
     const da = a.lastAccessed?.toDate ? a.lastAccessed.toDate() : new Date(a.lastAccessed || 0);
     const db = b.lastAccessed?.toDate ? b.lastAccessed.toDate() : new Date(b.lastAccessed || 0);
     return db.getTime() - da.getTime();
  }).slice(0, 3);
  return (
    <Card className="p-6 h-full">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-blue-500" /> Recent</h3>
      {sorted.length === 0 ? <div className="text-center text-gray-400 text-sm py-4">No recent activity</div> : (
         <div className="space-y-4">
            {sorted.map((e, i) => (
               <div key={i} className="flex gap-3 relative">
               {i !== sorted.length - 1 && <div className="absolute left-[9px] top-6 bottom-[-16px] w-[2px] bg-gray-100"></div>}
               <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center z-10 flex-shrink-0"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div>
               <div>
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{e.status === 'completed' ? 'Completed' : 'Studied'} {e.workshop?.title}</p>
                  <p className="text-[10px] text-gray-400">{e.lastAccessed ? new Date(e.lastAccessed.toDate ? e.lastAccessed.toDate() : e.lastAccessed).toLocaleDateString() : 'Recently'}</p>
               </div>
               </div>
            ))}
         </div>
      )}
    </Card>
  );
};

export const StudyPlannerWidget: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay() - 1; 
  return (
    <Card className="p-6 h-full flex flex-col bg-white border border-gray-100">
      <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar size={18} className="text-blue-600" /> Study Planner</h3><span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">On Track</span></div>
      <div className="flex justify-between items-end gap-2 h-32 mb-4">{days.map((day, i) => { const isToday = i === (today < 0 ? 6 : today); const load = Math.random() * 80 + 10; return ( <div key={day} className="flex-1 flex flex-col justify-end items-center gap-2 group cursor-pointer"><div className={`w-full rounded-t-lg transition-all duration-500 relative ${isToday ? 'bg-[#D62828]' : 'bg-gray-100 group-hover:bg-gray-200'}`} style={{ height: `${load}%` }}>{isToday && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}</div><span className={`text-xs font-bold ${isToday ? 'text-[#D62828]' : 'text-gray-400'}`}>{day}</span></div> ) })}</div>
      <div className="mt-auto pt-4 border-t border-gray-50 space-y-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">10:00</div><div><p className="text-xs font-bold text-gray-800">Advanced Python</p><p className="text-[10px] text-gray-500">Module 3 • 45 mins</p></div><button className="ml-auto text-gray-300 hover:text-[#D62828]"><CheckCircle size={18}/></button></div></div>
    </Card>
  );
};

export const CognitiveLoadWidget: React.FC<{ activeCount: number }> = ({ activeCount }) => {
  const loadScore = Math.min(100, activeCount * 20); 
  const status = loadScore > 80 ? 'High' : loadScore > 40 ? 'Optimal' : 'Low';
  const color = loadScore > 80 ? 'text-red-500' : loadScore > 40 ? 'text-green-500' : 'text-blue-500';
  const barColor = loadScore > 80 ? 'bg-red-500' : loadScore > 40 ? 'bg-green-500' : 'bg-blue-500';
  return (
    <Card className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
       <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 pointer-events-none"></div>
       <div><h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1"><Brain size={18} className="text-gray-600" /> Cognitive Load</h3><p className="text-xs text-gray-500">Real-time mental effort analysis</p></div>
       <div className="flex items-end gap-2 my-4"><span className={`text-4xl font-black ${color}`}>{loadScore}%</span><span className="text-sm font-bold text-gray-400 mb-1.5">{status}</span></div>
       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className={`h-full ${barColor} transition-all duration-1000`} style={{ width: `${loadScore}%` }}></div></div>
       <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 flex items-start gap-2"><Sparkles size={12} className="text-yellow-500 mt-0.5 flex-shrink-0" />{loadScore > 80 ? "Consider taking a 15-min break. Efficiency dropping." : "You are in the flow state. Great time for complex topics."}</div>
    </Card>
  );
};

export const SuccessPredictorWidget: React.FC<{ progress: number }> = ({ progress }) => {
  const probability = Math.min(99, Math.round(progress + 40 + (Math.random() * 10)));
  return (
    <Card className="p-6 h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-xl">
       <div className="flex justify-between items-start mb-4"><h3 className="font-bold text-gray-100 flex items-center gap-2"><TrendingUp size={18} className="text-green-400" /> Success Rate</h3><div className="bg-white/10 p-1 rounded hover:bg-white/20 cursor-pointer"><MoreHorizontal size={16}/></div></div>
       <div className="flex items-center justify-center py-2"><div className="relative w-24 h-24 flex items-center justify-center"><svg className="w-full h-full transform -rotate-90"><circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" /><circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * probability) / 100} className="text-green-400 transition-all duration-1000" /></svg><span className="absolute text-2xl font-bold">{probability}%</span></div></div>
       <p className="text-center text-xs text-gray-400 mt-2">Based on your current velocity, you are highly likely to complete your goals.</p>
    </Card>
  );
};

export const AICopilotWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  return (
    <Card className="p-0 h-full flex flex-col border border-indigo-100 shadow-md overflow-hidden relative">
       <div className="p-4 bg-indigo-600 text-white flex justify-between items-center"><div className="flex items-center gap-2"><Bot size={20} className="text-indigo-200" /><span className="font-bold">Learning Copilot</span></div><span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded text-indigo-100">Beta</span></div>
       <div className="flex-1 p-4 bg-indigo-50/30 space-y-3 overflow-y-auto min-h-[200px]"><div className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0"><Bot size={16}/></div><div className="bg-white p-3 rounded-2xl rounded-tl-none border border-indigo-100 text-sm text-gray-700 shadow-sm">I noticed you paused on <strong>Module 3: Data Structures</strong>. Would you like a quick summary before you resume?</div></div><div className="flex gap-2 justify-end"><button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors">Yes, summarize</button><button className="text-xs bg-white border border-indigo-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">Show quiz</button></div></div>
       <div className="p-3 bg-white border-t border-gray-100"><div className="relative"><input type="text" placeholder="Ask about your courses..." className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={query} onChange={(e) => setQuery(e.target.value)} /><button className="absolute right-2 top-2 p-1 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"><ArrowRight size={14} /></button></div></div>
    </Card>
  );
};

export const GoogleClassroomPanel: React.FC = () => {
  return (
    <Card className="p-0 h-full flex flex-col border border-gray-200 overflow-hidden">
       <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white"><h3 className="font-bold text-gray-800 flex items-center gap-2"><div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center text-white"><Layout size={12}/></div>Classroom</h3><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Synced"></div></div>
       <div className="flex-1 p-0 overflow-y-auto">{[{ title: "Project Alpha Submission", due: "Tomorrow", course: "CS101", status: "Missing" }, { title: "Weekly Reflection", due: "Fri, 5 PM", course: "ETHICS", status: "Pending" }].map((task, i) => (<div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"><div className="flex justify-between items-start mb-1"><h4 className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">{task.title}</h4><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${task.status === 'Missing' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>{task.status}</span></div><div className="flex justify-between items-center text-xs text-gray-500"><span>{task.course}</span><span className="flex items-center gap-1"><Clock size={10}/> {task.due}</span></div></div>))}</div>
       <div className="p-3 bg-gray-50 text-center border-t border-gray-100"><button className="text-xs font-bold text-green-700 hover:underline">Sync Now</button></div>
    </Card>
  );
};

export const GoogleDriveVault: React.FC = () => {
  return (
    <Card className="p-6 h-full border border-gray-200 hover:shadow-md transition-shadow">
       <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-gray-900 flex items-center gap-2"><img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" width="18" alt="Drive" />Academic Vault</h3><button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 transition-colors">Open Drive</button></div>
       <div className="grid grid-cols-2 gap-4">{[{ name: "Certificates", items: 4, color: "bg-blue-50 text-blue-600" }, { name: "Assignments", items: 12, color: "bg-yellow-50 text-yellow-600" }, { name: "Lectures", items: 8, color: "bg-red-50 text-red-600" }, { name: "Resources", items: 25, color: "bg-green-50 text-green-600" }].map((folder, i) => (<div key={i} className={`p-3 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer ${folder.color} bg-opacity-50`}><Folder size={20} className="mb-2 opacity-80" /><p className="font-bold text-sm text-gray-800">{folder.name}</p><p className="text-xs opacity-70">{folder.items} files</p></div>))}</div>
    </Card>
  );
};
