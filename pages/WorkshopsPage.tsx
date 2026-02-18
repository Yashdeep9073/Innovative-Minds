
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ArrowLeft, ArrowRight, Filter, BookOpen, Sparkles, TrendingUp, Zap, 
  ChevronRight, ChevronLeft, MapPin, Award, Layers
} from 'lucide-react';
import { WorkshopCard } from '../components/WorkshopCard';
import { Workshop, User, CourseCategory } from '../types';
import { auth, db } from '../services/firebase';
import { collection, query, where, onSnapshot, getDocs, orderBy } from 'firebase/firestore';
import { generatePlaceholderWorkshops } from '../services/workshopData';
import { Card, Button } from '../components/UI';

const CATEGORY_ORDER: string[] = [
  'Featured',
  'Recommended For You',
  'Technology', 
  'Business', 
  'Agriculture', 
  'Health', 
  'Education', 
  'Innovation', 
  'Cybersecurity', 
  'Data Science', 
  'Engineering', 
  'Social Sciences'
];

export const WorkshopsPage: React.FC<{ onNavigate: (p: string) => void; initialSearchTerm?: string; initialCategory?: string }> = ({ onNavigate, initialSearchTerm = '', initialCategory = 'All' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(initialCategory); // UI Filter
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [aiSort, setAiSort] = useState<'relevance' | 'newest' | 'trending'>('relevance');

  // 1. Initial Auth Check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
       if (u) {
          setCurrentUser({ id: u.uid, name: u.displayName || 'User', role: 'student' } as User);
       } else {
          setCurrentUser(null);
       }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch All Published Data
  useEffect(() => {
    const fetchCourses = async () => {
        setLoading(true);
        try {
            // REMOVED orderBy('date_created', 'desc') to avoid composite index requirement.
            // We fetch all published courses and sort them in JS.
            const q = query(
                collection(db, 'workshops'), 
                where('status', '==', 'published')
            );
            const snapshot = await getDocs(q);
            let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workshop));
            
            // Client-side Sort: Newest First
            data.sort((a, b) => {
                 const da = a.date_created?.toDate ? a.date_created.toDate() : new Date(a.date_created || 0);
                 const db = b.date_created?.toDate ? b.date_created.toDate() : new Date(b.date_created || 0);
                 return db.getTime() - da.getTime();
            });

            // Fallback for demo if empty
            if (data.length === 0) {
               // Generate mocks for all categories
               const mocks = CATEGORY_ORDER.slice(2).flatMap(cat => generatePlaceholderWorkshops(cat));
               data = mocks;
            }
            setWorkshops(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            // Fallback
            import('../workshops/registry').then(mod => setWorkshops(mod.getAllWorkshops()));
        } finally {
            setLoading(false);
        }
    };
    fetchCourses();
  }, []);

  // 3. Enrollment Listener
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'enrollments'), where('userId', '==', currentUser.id));
    const unsubscribe = onSnapshot(q, (snap) => {
        const ids = new Set<string>();
        snap.docs.forEach(d => ids.add(d.data().workshopId));
        setEnrolledIds(ids);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // 4. AI Logic: Grouping & Context Sorting
  const groupedCourses = useMemo(() => {
    const groups: Record<string, Workshop[]> = {};
    
    // Search Filtering
    const filtered = workshops.filter(w => 
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort Logic
    const sorted = [...filtered].sort((a, b) => {
       if (aiSort === 'newest') {
           // Handle both Firestore Timestamp and ISO strings safely
           const da = a.date_created?.toDate ? a.date_created.toDate() : new Date(a.date_created || 0);
           const db = b.date_created?.toDate ? b.date_created.toDate() : new Date(b.date_created || 0);
           return db.getTime() - da.getTime();
       }
       // Trending simulation (randomized sort for demo)
       if (aiSort === 'trending') return 0.5 - Math.random(); 
       return 0; // Relevance default
    });

    // Bucketize
    sorted.forEach(w => {
       if (!groups[w.category]) groups[w.category] = [];
       groups[w.category].push(w);
    });

    // Create "Recommended" (Simulated AI)
    groups['Recommended For You'] = sorted.filter((_, i) => i % 3 === 0).slice(0, 5); // Mock logic
    
    // Create "Featured" (Newest 5)
    groups['Featured'] = [...sorted].sort((a,b) => {
        const da = a.date_created?.toDate ? a.date_created.toDate() : new Date(a.date_created || 0);
        const db = b.date_created?.toDate ? b.date_created.toDate() : new Date(b.date_created || 0);
        return db.getTime() - da.getTime();
    }).slice(0, 5);

    // Create "Trending" (Random 5)
    groups['Trending Now'] = [...sorted].sort(() => 0.5 - Math.random()).slice(0, 5);

    return groups;
  }, [workshops, searchTerm, aiSort]);

  // 5. Determine Section Order based on Context
  const sectionOrder = useMemo(() => {
     let order = [...CATEGORY_ORDER];
     
     // Remove categories that have no results
     order = order.filter(cat => groupedCourses[cat] && groupedCourses[cat].length > 0);

     // If specific filter selected, move it to top (below Featured)
     if (activeCategoryFilter !== 'All') {
        order = order.filter(c => c !== activeCategoryFilter);
        // Insert after Featured & Recommended
        order.splice(2, 0, activeCategoryFilter); 
     }

     return order;
  }, [activeCategoryFilter, groupedCourses]);


  // --- INTERNAL COMPONENTS ---

  const SectionRail: React.FC<{ title: string; items: Workshop[] }> = ({ title, items }) => {
     const scrollRef = useRef<HTMLDivElement>(null);

     const scroll = (offset: number) => {
        if (scrollRef.current) {
           scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
     };

     if (!items || items.length === 0) return null;

     return (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex justify-between items-end px-4 md:px-8 mb-4">
              <div>
                 <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {title === 'Recommended For You' && <Sparkles size={20} className="text-purple-500" />}
                    {title === 'Trending Now' && <TrendingUp size={20} className="text-red-500" />}
                    {title}
                 </h3>
                 {title === activeCategoryFilter && <p className="text-sm text-[#D62828] font-bold">Priority Category</p>}
              </div>
              <div className="flex gap-2">
                 <button onClick={() => scroll(-300)} className="p-2 rounded-full hover:bg-gray-100 hidden md:block"><ChevronLeft size={20}/></button>
                 <button onClick={() => scroll(300)} className="p-2 rounded-full hover:bg-gray-100 hidden md:block"><ChevronRight size={20}/></button>
              </div>
           </div>
           
           <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-8 pt-2 snap-x snap-mandatory scroll-smooth hide-scrollbar"
           >
              {items.map(w => (
                 <div key={w.id} className="snap-start">
                    <WorkshopCard 
                       workshop={w} 
                       user={currentUser} 
                       onNavigate={onNavigate} 
                       variant="compact"
                       enrollmentStatus={enrolledIds.has(w.id) ? 'enrolled' : 'available'}
                    />
                 </div>
              ))}
              <div className="min-w-[50px] flex items-center justify-center">
                 <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#D62828] hover:text-white transition-colors">
                    <ArrowRight size={20} />
                 </button>
              </div>
           </div>
        </div>
     );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-inter">
      {/* 1. HERO SEARCH HEADER */}
      <div className="bg-gray-900 text-white pt-16 pb-24 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
         
         <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-6">Find Your Future</h1>
            
            {/* AI Search Bar */}
            <div className="relative max-w-2xl mx-auto">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={24} />
               </div>
               <input 
                 type="text" 
                 placeholder="Ask AI: 'Show me short courses on agri-business...'" 
                 className="w-full pl-14 pr-16 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D62828] focus:bg-gray-900/80 transition-all text-lg shadow-2xl"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <div className="absolute inset-y-0 right-4 flex items-center">
                  {searchTerm && (
                     <span className="text-xs text-green-400 font-mono animate-pulse mr-2 hidden sm:block">
                        AI Active
                     </span>
                  )}
                  <div className="bg-[#D62828] p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                     <ArrowRight size={20} />
                  </div>
               </div>
            </div>

            {/* Smart Filters (Context Aware) */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
               <button 
                  onClick={() => setActiveCategoryFilter('All')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategoryFilter === 'All' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
               >
                  All Programs
               </button>
               {['Workshop', 'Certificate', 'Degree', 'Masters', 'Seminar'].map(cat => (
                  <button 
                     key={cat}
                     onClick={() => setActiveCategoryFilter(cat)}
                     className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategoryFilter === cat ? 'bg-[#D62828] text-white border-none shadow-lg transform scale-105' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
                  >
                     {cat}s
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* 2. CATALOGUE CONTENT (Negative Margin Overlap) */}
      <div className="max-w-[1600px] mx-auto -mt-16 relative z-20">
         
         {/* Sort & Stats Bar */}
         <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 py-3 flex justify-between items-center mb-8 mx-4 md:mx-8 rounded-t-xl shadow-sm">
            <div className="text-sm font-medium text-gray-500">
               Showing {workshops.length} Programs
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Sort By:</span>
               <select 
                  className="bg-gray-100 border-none text-sm font-bold rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer"
                  value={aiSort}
                  onChange={(e) => setAiSort(e.target.value as any)}
               >
                  <option value="relevance">🤖 AI Relevance</option>
                  <option value="trending">🔥 Trending</option>
                  <option value="newest">✨ Newest</option>
               </select>
            </div>
         </div>

         {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D62828] mb-4"></div>
               <p className="text-gray-500 animate-pulse">Consulting AI Recommendations...</p>
            </div>
         ) : (
            <div className="space-y-4">
               {/* Primary Section (Context Driven) */}
               {sectionOrder.map(cat => (
                  <SectionRail 
                     key={cat} 
                     title={cat} 
                     items={groupedCourses[cat] || []} 
                  />
               ))}

               {/* Empty State */}
               {Object.keys(groupedCourses).length === 0 && (
                  <div className="text-center py-20">
                     <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                     <h3 className="text-xl font-bold text-gray-600">No programs match your search.</h3>
                     <p className="text-gray-400 mb-6">Try adjusting your filters or search term.</p>
                     <Button onClick={() => { setSearchTerm(''); setActiveCategoryFilter('All'); }}>Clear Filters</Button>
                  </div>
               )}
            </div>
         )}
      </div>

      {/* 3. DISCOVERY FOOTER */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
         <h2 className="text-2xl font-bold mb-6">Explore by Path</h2>
         <div className="flex flex-wrap justify-center gap-4">
            {[
               { icon: MapPin, label: "Career Paths" },
               { icon: Award, label: "Certifications" },
               { icon: Layers, label: "Skill Stacks" },
               { icon: Zap, label: "Fast-Track" }
            ].map((p, i) => (
               <button key={i} className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-[#D62828] transition-all group">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-red-50 text-gray-600 group-hover:text-[#D62828]">
                     <p.icon size={24} />
                  </div>
                  <span className="font-bold text-gray-800">{p.label}</span>
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};
