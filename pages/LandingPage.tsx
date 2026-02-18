
import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/UI';
import { BookOpen, Hand, Clock, Wifi, Brain, Shield, Lock, Globe, Sparkles, CreditCard, Heart, Laptop, Zap, Users, Rocket, Award } from 'lucide-react';
import { getWorkshops, migrateStaticWorkshops } from '../services/firebase'; 
import { Workshop } from '../types';
import { generatePlaceholderWorkshops } from '../services/workshopData';

export const LandingPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState({ learners: 0, countries: 0, universities: 0, govPrograms: 0, graduates: 0 });
  const [workshops, setWorkshops] = useState<Workshop[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWorkshops();
      console.log("LandingPage Loaded:", data.length);
      setWorkshops(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Animation for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        learners: prev.learners < 15000 ? prev.learners + 500 : 15000,
        countries: prev.countries < 19 ? prev.countries + 1 : 19,
        universities: prev.universities < 120 ? prev.universities + 4 : 120,
        govPrograms: prev.govPrograms < 300 ? prev.govPrograms + 10 : 300,
        graduates: prev.graduates < 100000 ? prev.graduates + 2500 : 100000,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Catalog Render Helper
  const renderCatalogSection = (title: string, typeFilter: string) => {
    // Filter by normalized category string
    let items = workshops.filter(w => w.category === typeFilter).slice(0, 10);

    // Inject AI Placeholders if empty
    if (items.length === 0 && !loading) {
       items = generatePlaceholderWorkshops(typeFilter);
    }

    return (
      <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-end mb-4 px-4">
          <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="text-[#D62828]" size={20} /> {title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mt-1 flex items-center gap-2 italic">
                  <Hand size={14} className="animate-bounce-horizontal" /> Swipe to explore
              </p>
          </div>
          <button onClick={() => onNavigate(`workshops-category/${typeFilter}`)} className="text-sm text-blue-600 hover:underline font-medium p-2 active:bg-blue-50 rounded">View All</button>
        </div>
        
        {/* Mobile-Optimized Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-4 px-4 pb-6 pt-2 snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-0">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[260px] md:min-w-[280px] h-[320px] bg-gray-100 rounded-2xl animate-pulse"></div>
             ))
          ) : (
             items.map((item) => (
              <div key={item.id} className="min-w-[260px] md:min-w-[280px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all snap-center flex flex-col transform hover:-translate-y-1 duration-300 cursor-pointer active:scale-95 touch-manipulation" onClick={() => onNavigate(`workshops/${item.id}`)}>
                <div className="h-36 bg-gray-200 rounded-xl mb-3 relative overflow-hidden group">
                   {item.image_url ? (
                     <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} loading="lazy" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500"><BookOpen/></div>
                   )}
                   <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm text-[#D62828]">{item.category}</div>
                   
                   {/* AI Badge for placeholders */}
                   {item.id.startsWith('ai-gen') && (
                      <div className="absolute bottom-2 left-2 bg-purple-600/90 text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm flex items-center gap-1 backdrop-blur-md">
                        <Sparkles size={10} className="text-yellow-300" /> AI GENERATED
                      </div>
                   )}
                </div>
                <h4 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm md:text-base leading-tight h-10" title={item.title}>{item.title}</h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{item.description}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400 font-medium">
                   <span className="flex items-center gap-1"><Clock size={12}/> {item.durationMinutes ? `${Math.floor(item.durationMinutes/60)}h` : 'Flexible'}</span>
                   <span className="flex items-center gap-1"><Wifi size={12}/> Global</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`w-full mt-3 h-10 text-xs rounded-lg border-gray-200 hover:border-[#D62828] hover:text-[#D62828] ${item.id.startsWith('ai-gen') ? 'opacity-70' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onNavigate(`workshops/${item.id}`); }}
                  disabled={item.id.startsWith('ai-gen')} 
                >
                  {item.id.startsWith('ai-gen') ? 'Content Synthesizing...' : 'View Program'}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="font-inter bg-white text-gray-800 overflow-x-hidden">
      
      {/* SECTION 1: HERO WELCOME */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden py-16 md:py-0">
        <div className="absolute inset-0">
           <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070" className="w-full h-full object-cover opacity-30" alt="Global Education" />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center animate-in fade-in zoom-in duration-700 flex flex-col items-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 md:mb-8 hover:bg-white/20 transition-colors cursor-default mt-8 md:mt-0">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest uppercase">Official Platform</span>
           </div>
           <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-2xl">
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D62828] via-orange-500 to-yellow-500">Innovative Minds Institute</span>
           </h1>
           <p className="text-lg md:text-2xl text-gray-200 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md px-2">
              IMI is a global leader in AI-powered education. We provide scalable, accredited, and inclusive learning pathways for everyone.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 w-full max-w-md mx-auto sm:max-w-none">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 md:px-10 py-4 text-lg font-bold shadow-[0_0_30px_rgba(214,40,40,0.4)] bg-[#D62828] border-none hover:bg-red-700 hover:scale-105 transition-all" onClick={() => onNavigate('all-workshops')}>
                 Explore Programs
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-full px-8 md:px-10 py-4 text-lg font-bold bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all shadow-xl" onClick={() => onNavigate('login')}>
                 Portal Login
              </Button>
           </div>
           <div className="flex flex-wrap justify-center gap-3 md:gap-8 opacity-80 text-xs md:text-sm font-medium">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-white/10"><Brain size={16} className="text-purple-400"/> AI-Powered</div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-white/10"><Shield size={16} className="text-green-400"/> Accredited</div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-white/10"><Lock size={16} className="text-blue-400"/> Secure</div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-white/10"><Globe size={16} className="text-yellow-400"/> 38+ Countries</div>
           </div>
        </div>
      </section>

      {/* SECTION 2: GLOBAL IMPACT SNAPSHOT */}
      <section className="py-12 md:py-16 bg-[#D62828] text-white border-t-4 border-white/10 shadow-inner">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:divide-x divide-white/20">
            <div className="group">
               <div className="text-3xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{stats.learners.toLocaleString()}+</div>
               <div className="text-[10px] md:text-xs uppercase opacity-80 font-bold tracking-wider">Total Learners</div>
            </div>
            <div className="group">
               <div className="text-3xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{stats.countries}</div>
               <div className="text-[10px] md:text-xs uppercase opacity-80 font-bold tracking-wider">Countries</div>
            </div>
            <div className="group">
               <div className="text-3xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{stats.universities}</div>
               <div className="text-[10px] md:text-xs uppercase opacity-80 font-bold tracking-wider">Universities</div>
            </div>
            <div className="group">
               <div className="text-3xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{stats.govPrograms}+</div>
               <div className="text-[10px] md:text-xs uppercase opacity-80 font-bold tracking-wider">Gov Programs</div>
            </div>
            <div className="group col-span-2 md:col-span-1">
               <div className="text-3xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{(stats.graduates/1000).toFixed(0)}k+</div>
               <div className="text-[10px] md:text-xs uppercase opacity-80 font-bold tracking-wider">Graduates</div>
            </div>
         </div>
      </section>

      {/* SECTION 11: GLOBAL PROGRAM CATALOG (DYNAMIC) */}
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-0 md:px-4">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-16 text-center text-gray-900 px-4">Global Program Catalog</h2>
            
            {/* Dynamic Sections */}
            {renderCatalogSection("Professional Workshops", "Workshop")}
            {renderCatalogSection("Professional Certificates", "Certificate")}
            {renderCatalogSection("Bachelor Degrees", "Degree")}
            {renderCatalogSection("Expert Seminars", "Seminar")}
            {renderCatalogSection("Global Webinars", "Webinar")}
            {renderCatalogSection("Master's Programs", "Masters")}
            
            {workshops.length === 0 && !loading && (
               <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 mx-4">
                  <p className="text-gray-500 mb-2">Catalog is currently empty. Please run the migration tool.</p>
                  <Button onClick={() => migrateStaticWorkshops().then(() => window.location.reload())}>Run Auto-Migration</Button>
               </div>
            )}
         </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="py-16 md:py-24 bg-[#D62828] text-white text-center">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Knowledge Journey Today</h2>
            <p className="text-lg md:text-xl text-red-100 mb-10">
               Join over 15,000 learners accessing the future of education. Create your free account to unlock the full potential of our AI Library.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
               <Button size="lg" className="w-full sm:w-auto bg-white text-[#D62828] hover:bg-gray-100 font-bold border-none px-10 rounded-full" onClick={() => onNavigate('login')}>
                  Create Free Account
               </Button>
               <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-10 rounded-full" onClick={() => onNavigate('all-workshops')}>
                  Browse Courses
               </Button>
            </div>
            <p className="mt-6 text-sm text-red-200 opacity-80">
               <Lock size={12} className="inline mr-1" /> Secure Access • No Credit Card Required for Basic Plan
            </p>
         </div>
      </section>

    </div>
  );
};

// Helper components for icons not in Lucide (Mocking specific ones if needed)
const Wallet = ({ size, className }: any) => <CreditCard size={size} className={className} />; // Fallback
