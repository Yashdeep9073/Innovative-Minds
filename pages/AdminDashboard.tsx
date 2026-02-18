
import React, { useEffect, useState, useMemo } from 'react';
import { Card, Button, Input, Modal } from '../components/UI';
import { User, Workshop, Enrollment, CourseStatus } from '../types';
import { 
  subscribeToCollection, updateUserRole, migrateStaticWorkshops, 
  verifyLMSIntegrity, db, bulkImportCourses, verifyEnrollmentIntegrity, 
  auth, bootstrapAdmin, getWorkshops, populateCourseContent 
} from '../services/firebase';
import { collection, query, orderBy, getDocs, where, updateDoc, doc, serverTimestamp, writeBatch, addDoc } from 'firebase/firestore';
import { 
  Users, BookOpen, Shield, Database, CheckCircle, PlusCircle, Activity, 
  FileJson, UploadCloud, AlertTriangle, LayoutDashboard, GraduationCap, 
  CreditCard, TrendingUp, MessageSquare, Settings, Menu, X, Search, 
  Award, AlertCircle, RefreshCw, Lock, Unlock, Eye, BarChart3, Globe,
  ShieldCheck, MapPin, Calendar, DollarSign, ListTodo, Megaphone, 
  Building, Handshake, PieChart as PieChartIcon, TrendingDown, BellRing, Send, Phone, Mail, Brain,
  FileCheck, Leaf, Link as LinkIcon, Radio, Share2, Printer, Zap, Download
} from 'lucide-react';
import { 
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, 
  AreaChart, Area, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar, StackedBarSeries
} from 'recharts';

// --- TYPES & INTERFACES ---
type AdminSection = 'executive' | 'academic' | 'students' | 'finance' | 'marketing' | 'partners' | 'certifications' | 'impact' | 'support' | 'system';

interface SystemStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  revenue: number;
  certificatesIssued: number;
  systemHealth: number;
  pendingScholarships: number;
  openTickets: number;
}

interface AdminTask {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#D62828'];

// --- ZAMBIA CONTEXT MOCK DATA ---
const ZAMBIAN_CITIES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone', 'Chipata', 'Solwezi', 'Kabwe'];
const MOCK_ZAMBIAN_USERS = [
  { name: "Daniel Mwale", email: "daniel.mwale@unza.zm", role: "student", location: "Lusaka" },
  { name: "Chipo Phiri", email: "c.phiri@cbu.ac.zm", role: "student", location: "Ndola" },
  { name: "Thabo Maseko", email: "thabo.m@gmail.com", role: "student", location: "Livingstone" },
  { name: "Ruth Banda", email: "ruth.banda@gov.zm", role: "government", location: "Lusaka" },
  { name: "Kennedy Zulu", email: "k.zulu@tech.zm", role: "admin", location: "Kitwe" },
  { name: "Grace Tembo", email: "grace.t@hospital.zm", role: "student", location: "Chipata" },
  { name: "Mulenga Kapwepwe", email: "m.kapwepwe@culture.zm", role: "university", location: "Lusaka" }
];

export const AdminDashboard: React.FC<{ onNavigate?: (p: string) => void }> = ({ onNavigate }) => {
  // --- STATE MANAGEMENT ---
  const [activeSection, setActiveSection] = useState<AdminSection>('executive');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  // Data Collections
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Workshop[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([
    { id: '1', title: 'Review pending scholarships (Lusaka)', priority: 'High', completed: false, dueDate: 'Today' },
    { id: '2', title: 'Approve new AgriTech course content', priority: 'Medium', completed: false, dueDate: 'Tomorrow' },
    { id: '3', title: 'Verify payments from ZANACO', priority: 'High', completed: true, dueDate: 'Yesterday' },
    { id: '4', title: 'Prepare monthly report for Ministry', priority: 'Low', completed: false, dueDate: 'Fri' }
  ]);

  // Operational State
  const [syncing, setSyncing] = useState(false);
  const [populatingId, setPopulatingId] = useState<string | null>(null);
  const [importData, setImportData] = useState('');
  const [auditResults, setAuditResults] = useState<{ active: number, completed: number, issues: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initAdmin = async () => {
       const user = auth.currentUser;
       if (user) {
          if (user.email === 'admin@imlearn.org' || user.email?.endsWith('@imlearn.org')) {
             await bootstrapAdmin(user.uid, user.email);
          }
          setPermissionGranted(true);
       }
    };
    initAdmin();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;
    const unsubUsers = subscribeToCollection<User>('users', [orderBy('createdAt', 'desc')], setUsers);
    const unsubEnrollments = subscribeToCollection<Enrollment>('enrollments', [orderBy('enrolledAt', 'desc')], setEnrollments);
    const unsubScholarships = subscribeToCollection<any>('scholarship_applications', [orderBy('submittedAt', 'desc')], setScholarships);
    const unsubTickets = subscribeToCollection<any>('complaints', [orderBy('timestamp', 'desc')], setTickets);
    const unsubLogs = subscribeToCollection<any>('admin_actions', [orderBy('timestamp', 'desc')], setSystemLogs);

    const fetchCourses = async () => {
       try {
         const snap = await getDocs(query(collection(db, 'workshops'), orderBy('date_created', 'desc')));
         setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Workshop)));
       } catch(e) { console.error("Course fetch error", e); }
    };
    fetchCourses();

    return () => {
      unsubUsers();
      unsubEnrollments();
      unsubScholarships();
      unsubTickets();
      unsubLogs();
    };
  }, [permissionGranted]);

  const stats: SystemStats = useMemo(() => {
    const isDemo = users.length < 10; 
    const realRevenue = enrollments.reduce((acc, curr) => acc + (curr.payment_status === 'paid' ? 150 : 0), 0);
    const realCerts = enrollments.filter(e => e.certificate_issued).length;
    return {
      totalUsers: isDemo ? 15392 : users.length,
      totalCourses: isDemo ? 161 : courses.length,
      totalEnrollments: isDemo ? 9847 : enrollments.length,
      revenue: isDemo ? 1284500 : realRevenue,
      certificatesIssued: isDemo ? 6214 : realCerts,
      systemHealth: 96,
      pendingScholarships: isDemo ? 42 : scholarships.filter(s => s.status === 'pending').length,
      openTickets: isDemo ? 15 : tickets.filter(t => t.status === 'open').length
    };
  }, [users, courses, enrollments, scholarships, tickets]);

  const handleAddTask = () => {
    if(!newTaskTitle) return;
    setAdminTasks(prev => [{
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: 'Medium',
      completed: false,
      dueDate: 'Today'
    }, ...prev]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setAdminTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSeedData = async () => {
    if (!window.confirm("Initialize Dashboard with Zambian Demo Data? This adds mock records to Firestore.")) return;
    setSyncing(true);
    try {
      const batch = writeBatch(db);
      MOCK_ZAMBIAN_USERS.forEach((u, i) => {
        const ref = doc(collection(db, 'users'));
        batch.set(ref, {
          ...u,
          id: ref.id,
          createdAt: serverTimestamp(),
          studentNumber: `IMI-2026-${1000+i}`
        });
      });
      const ticketRef = doc(collection(db, 'complaints'));
      batch.set(ticketRef, {
        userId: 'demo_user_1',
        name: 'Chipo Phiri',
        email: 'c.phiri@cbu.ac.zm',
        subject: 'Certificate Verification Issue',
        message: 'I cannot download my Cybersecurity certificate. It says verification pending.',
        status: 'open',
        priority: 'high',
        timestamp: serverTimestamp()
      });
      await batch.commit();
      alert("System populated with Zambia-context data.");
    } catch (e) {
      console.error(e);
      alert("Seeding failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleMigration = async () => {
    if(window.confirm("Sync all static workshops to Firestore? This will overwrite existing V2 data.")) {
      setSyncing(true);
      try {
        await migrateStaticWorkshops();
        alert("Migration Complete");
      } catch(e) {
        alert("Migration Failed");
      } finally {
        setSyncing(false);
      }
    }
  };

  // --- AUTO-POPULATE TRIGGER ---
  const handleAutoPopulate = async (courseId: string, title: string) => {
      if(!window.confirm(`WARNING: Auto-Populate "${title}"?\n\nThis will DELETE all current topic content and replace it with AI-generated academic material.\n\nThis action cannot be undone.`)) return;
      
      setPopulatingId(courseId);
      try {
          await populateCourseContent(courseId);
          alert(`Success! "${title}" has been updated with academic content.`);
          // Refresh list
          const snap = await getDocs(query(collection(db, 'workshops'), orderBy('date_created', 'desc')));
          setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Workshop)));
      } catch (e: any) {
          console.error(e);
          alert(`Failed: ${e.message}`);
      } finally {
          setPopulatingId(null);
      }
  };

  const handleBulkImport = async () => {
     try {
        const data = JSON.parse(importData);
        if (!Array.isArray(data)) throw new Error("Input must be a JSON array");
        await bulkImportCourses(data);
        alert(`Successfully imported ${data.length} courses.`);
        setImportData('');
     } catch (e) {
        alert("Import failed. Check JSON format.");
     }
  };

  const approveScholarship = async (id: string, enrollmentId: string) => {
     if(!window.confirm("Approve this scholarship?")) return;
     try {
        await updateDoc(doc(db, 'scholarship_applications', id), { status: 'approved' });
        await updateDoc(doc(db, 'enrollments', enrollmentId), { 
            payment_status: 'paid', // Scholarship covers fee
            status: 'in_progress' 
        });
        alert("Scholarship Approved & Student Enrolled");
     } catch(e) { console.error(e); }
  };

  const toggleCourseStatus = async (courseId: string, currentStatus: string) => {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await updateDoc(doc(db, 'workshops', courseId), { status: newStatus, visible: newStatus === 'published' });
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: newStatus } : c));
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: AdminSection, label: string, icon: any }) => (
    <button 
      onClick={() => {
        setActiveSection(id);
        if (window.innerWidth < 768) setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        activeSection === id ? 'bg-red-50 text-[#D62828]' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      {(sidebarOpen || window.innerWidth < 768) && <span>{label}</span>}
      {id === 'support' && stats.openTickets > 0 && (sidebarOpen || window.innerWidth < 768) && (
         <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{stats.openTickets}</span>
      )}
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <Card className="p-5 flex items-center justify-between border-l-4 h-full" style={{ borderLeftColor: color }}>
       <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp size={10}/> {trend}</p>}
       </div>
       <div className={`p-3 rounded-full opacity-10`} style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color: color }} />
       </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex relative overflow-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        bg-white border-r border-gray-200 transition-all duration-300 flex flex-col 
        fixed md:relative h-full z-30
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
      `}>
         <div className="p-6 flex items-center justify-between">
            {sidebarOpen ? (
               <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="text-[#D62828]" /> Admin Portal
               </div>
            ) : (
               <ShieldCheck className="text-[#D62828] mx-auto" />
            )}
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 md:hidden">
               <X size={20}/>
            </button>
         </div>

         <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <SidebarItem id="executive" label="Executive Overview" icon={LayoutDashboard} />
            <SidebarItem id="academic" label="Academic & LMS" icon={BookOpen} />
            <SidebarItem id="students" label="Student Management" icon={GraduationCap} />
            <SidebarItem id="finance" label="Finance & Revenue" icon={CreditCard} />
            <SidebarItem id="marketing" label="Marketing & Growth" icon={Megaphone} />
            <SidebarItem id="partners" label="Partnerships" icon={Handshake} />
            <SidebarItem id="certifications" label="Certifications" icon={FileCheck} />
            <SidebarItem id="impact" label="Impact & ESG" icon={Leaf} />
            <SidebarItem id="support" label="Support & Tickets" icon={MessageSquare} />
            <SidebarItem id="system" label="IT & System Health" icon={Settings} />
         </nav>

         <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
               <div className="w-8 h-8 rounded-full bg-[#D62828] flex items-center justify-center font-bold text-white text-xs shrink-0">SA</div>
               {sidebarOpen && (
                  <div className="overflow-hidden">
                     <p className="text-sm font-bold truncate">System Admin</p>
                     <p className="text-xs text-gray-500">Lusaka HQ</p>
                  </div>
               )}
            </div>
         </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 w-full">
         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <div className="flex items-center gap-3">
                  <button className="md:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeSection} Dashboard</h1>
               </div>
               <p className="text-gray-500 text-sm flex items-center gap-2 mt-1 ml-1 md:ml-0">
                  <MapPin size={12}/> Lusaka Data Center • <span className="text-green-600 font-bold flex items-center gap-1"><Activity size={10}/> Online</span>
               </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
               <Button size="sm" variant="outline" icon={Database} onClick={handleSeedData} isLoading={syncing} className="flex-1 md:flex-none justify-center">Seed Data</Button>
               <Button size="sm" variant="outline" icon={RefreshCw} onClick={() => window.location.reload()} className="flex-1 md:flex-none justify-center">Refresh</Button>
               {activeSection === 'academic' && (
                  <Button size="sm" onClick={() => onNavigate && onNavigate('course-builder')} icon={PlusCircle} className="w-full md:w-auto justify-center mt-2 md:mt-0">Course Builder</Button>
               )}
            </div>
         </header>

         {activeSection === 'executive' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Learners" value={stats.totalUsers.toLocaleString()} icon={Users} color="#0088FE" trend="+12% this month" />
                  <StatCard title="Active Courses" value={stats.totalCourses} icon={BookOpen} color="#00C49F" trend="98% Content Ready" />
                  <StatCard title="Monthly Revenue" value={`ZMW ${(stats.revenue).toLocaleString()}`} icon={CreditCard} color="#FFBB28" trend="+8% vs last month" />
                  <StatCard title="System Health" value={`${stats.systemHealth}%`} icon={Activity} color={stats.systemHealth > 90 ? "#10B981" : "#EF4444"} />
               </div>
               <Card className="p-6 h-full">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><ListTodo size={20} className="text-blue-600"/> Today's Admin Tasks</h3>
                  <div className="space-y-2 mt-4">
                        {adminTasks.map(task => (
                           <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border ${task.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200'}`}>
                              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer shrink-0" />
                              <div className="flex-1 min-w-0">
                                 <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</p>
                                 <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{task.priority}</span>
                           </div>
                        ))}
                  </div>
               </Card>
            </div>
         )}

         {activeSection === 'academic' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                     <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                     <input type="text" placeholder="Search courses..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D62828]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                     <Button variant="outline" size="sm" onClick={handleMigration} isLoading={syncing} className="flex-1 md:flex-none justify-center">Sync Static Data</Button>
                  </div>
               </div>

               <Card className="overflow-hidden">
                  <div className="overflow-x-auto w-full">
                     <table className="w-full text-sm text-left min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                           <tr>
                              <th className="p-4">Course Title</th>
                              <th className="p-4">Category</th>
                              <th className="p-4">Level</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Content</th>
                              <th className="p-4 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                              <tr key={c.id} className="hover:bg-gray-50">
                                 <td className="p-4 font-medium"><div className="truncate max-w-[200px]" title={c.title}>{c.title}</div></td>
                                 <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs whitespace-nowrap">{c.category}</span></td>
                                 <td className="p-4">{c.level}</td>
                                 <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit ${c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                       {c.status === 'published' ? <Globe size={10}/> : <Lock size={10}/>} {c.status}
                                    </span>
                                 </td>
                                 <td className="p-4">
                                    {populatingId === c.id ? (
                                        <div className="flex items-center gap-2 text-purple-600 text-xs font-bold animate-pulse">
                                            <RefreshCw size={12} className="animate-spin" /> Generating...
                                        </div>
                                    ) : (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-xs py-1 h-auto border-purple-200 text-purple-700 hover:bg-purple-50"
                                            onClick={() => handleAutoPopulate(c.id, c.title)}
                                            icon={Brain}
                                        >
                                            Auto-Populate
                                        </Button>
                                    )}
                                 </td>
                                 <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => toggleCourseStatus(c.id, c.status || 'draft')} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Toggle Status">
                                       {c.status === 'published' ? <Lock size={16}/> : <Unlock size={16}/>}
                                    </button>
                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Edit" onClick={() => onNavigate && onNavigate('course-builder')}>
                                       <Settings size={16}/>
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </Card>
            </div>
         )}

         {/* Placeholder Views for Other Sections */}
         {(activeSection !== 'executive' && activeSection !== 'academic') && (
             <div className="p-8 text-center text-gray-500">Section {activeSection} content loaded.</div>
         )}

      </main>
    </div>
  );
};

// Helper Icon
function BrainIcon({size, className}:any) {
   return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 18 18"/></svg>
}
