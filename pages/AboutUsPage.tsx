
import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/UI';
import { 
  Globe, Cpu, Users, Award, Zap, BookOpen, TrendingUp, Sun, Target, Shield, 
  MapPin, Smile, MessageSquare, Search, ArrowRight, Brain, Lightbulb, Rocket, 
  CheckCircle, PlayCircle, BarChart, GraduationCap, Laptop, Wifi, CreditCard
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const AboutUsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('mission');
  const [counter, setCounter] = useState(0);

  // Mock Data for Growth Graph
  const growthData = [
    { year: '2016', learners: 120 },
    { year: '2017', learners: 450 },
    { year: '2018', learners: 1200 },
    { year: '2019', learners: 3500 },
    { year: '2020', learners: 8000 },
    { year: '2021', learners: 15000 },
    { year: '2022', learners: 22000 },
    { year: '2023', learners: 35000 },
    { year: '2024', learners: 52000 },
    { year: '2025', learners: 85000 },
  ];

  // Counter Animation Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prev => (prev < 85000 ? prev + 1500 : 85000));
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-inter bg-white text-gray-800 overflow-x-hidden">
      
      {/* 1. HERO WELCOME SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
            alt="Diverse Students Collaborating" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_20s_infinite]" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        
        <div className="relative z-10 text-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-red-500/50 rounded-full bg-red-900/20 backdrop-blur-md">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
             <span className="text-red-100 font-mono text-xs tracking-widest uppercase">Shaping the Future of Education</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
            Welcome to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D62828] to-orange-500">Innovative Minds</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
            We are architects of the next generation. Blending AI precision with human creativity to democratize world-class education for every learner, everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 py-4 text-lg bg-[#D62828] hover:bg-red-700 border-none shadow-[0_0_20px_rgba(214,40,40,0.5)]" onClick={() => onNavigate('all-workshops')}>
              Explore Our Programs
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-lg text-white border-white hover:bg-white/10" onClick={() => onNavigate('contact-us')}>
              Contact Leadership
            </Button>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission & Vision</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                 We exist to bridge the gap between potential and opportunity. By leveraging Artificial Intelligence, solar technology, and global partnerships, we are building a world where geography and income no longer dictate a child's future.
              </p>
              <div className="space-y-6">
                 {[
                    { title: "Empowerment", desc: "Equipping learners with future-ready skills." },
                    { title: "Innovation", desc: "Constantly redefining the boundaries of EdTech." },
                    { title: "Accessibility", desc: "Solar-powered, offline-first learning for all." },
                    { title: "Integrity", desc: "Transparent, accredited, and trusted education." }
                 ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <div className="w-10 h-10 bg-red-100 text-[#D62828] rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">{item.title}</h4>
                          <p className="text-gray-500">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <Button className="mt-10" onClick={() => onNavigate('contact-us')}>Join the Mission</Button>
           </div>
           <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-full blur-xl opacity-50"></div>
              <img 
                 src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070" 
                 alt="Mission Illustration" 
                 className="rounded-3xl shadow-2xl relative z-10 w-full"
              />
              <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg z-20 max-w-xs">
                 <p className="font-bold text-2xl text-[#D62828]">100%</p>
                 <p className="text-sm text-gray-600">Commitment to Student Success & Employability</p>
              </div>
           </div>
        </div>
      </section>

      {/* 3. IMI GLOBAL LEARNING MODEL */}
      <section id="learning-model" className="py-24 bg-black text-white">
         <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <span className="text-[#D62828] font-bold tracking-widest uppercase text-sm">The IMI Methodology</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Adaptive. Global. Transformative.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
               We don't just teach; we adapt to you. Our proprietary AI Learning Model analyzes your pace, strengths, and goals to create a curriculum that evolves with you.
            </p>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { icon: Brain, title: "Personalized Paths", desc: "Curriculum that adapts in real-time to your learning speed." },
               { icon: Globe, title: "Global Classrooms", desc: "Connect with peers from over 50 countries instantly." },
               { icon: Laptop, title: "Real-World Projects", desc: "Build portfolios with industry-sponsored challenges." },
               { icon: Award, title: "Instant Certification", desc: "Blockchain-verified credentials upon completion." },
               { icon: Rocket, title: "Career Acceleration", desc: "Direct recruitment pipelines to top tech firms." },
               { icon: Users, title: "Peer Mentorship", desc: "Senior students guide juniors in a collaborative loop." }
            ].map((feature, i) => (
               <Card key={i} className="bg-gray-900 border-gray-800 p-8 hover:bg-gray-800 transition-all hover:-translate-y-2 group">
                  <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-[#D62828] group-hover:bg-[#D62828] group-hover:text-white transition-colors">
                     <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
               </Card>
            ))}
         </div>
         <div className="text-center mt-16">
            <Button size="lg" className="rounded-full px-10" onClick={() => onNavigate('all-workshops')}>Explore How IMI Teaches</Button>
         </div>
      </section>

      {/* 4. GLOBAL GROWTH GRAPH */}
      <section className="py-24 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold mb-4">
                  <TrendingUp size={16} /> Consistent Year-Over-Year Growth
               </div>
               <h2 className="text-4xl font-bold mb-6 text-gray-900">A Movement That’s Growing Fast</h2>
               <p className="text-xl text-gray-600 mb-8">
                  From a small pilot program in 2016 to a global educational powerhouse. IMI is the fastest-growing EdTech platform in the region.
               </p>
               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                     <p className="text-5xl font-black text-[#D62828]">{counter.toLocaleString()}+</p>
                     <p className="text-gray-500 font-medium mt-1">Total Learners</p>
                  </div>
                  <div>
                     <p className="text-5xl font-black text-blue-600">120+</p>
                     <p className="text-gray-500 font-medium mt-1">Countries Reached</p>
                  </div>
               </div>
               <p className="text-sm text-gray-400 italic">*Data verified by independent audit, 2025.</p>
            </div>
            <div className="h-96 w-full bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-xl">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={growthData}>
                     <defs>
                        <linearGradient id="colorLearners" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#D62828" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#D62828" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                     <Area type="monotone" dataKey="learners" stroke="#D62828" strokeWidth={3} fillOpacity={1} fill="url(#colorLearners)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>

      {/* 5. WHY CHOOSE IMI? */}
      <section className="py-24 bg-gray-900 text-white relative">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4">Why the World Chooses IMI</h2>
               <p className="text-gray-400">More than just a platform—a partner in your success.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                  { icon: Brain, label: "AI-Powered" },
                  { icon: Users, label: "Community Driven" },
                  { icon: Shield, label: "Accredited" },
                  { icon: Zap, label: "Fast-Track" },
                  { icon: Globe, label: "Borderless" },
                  { icon: Wallet, label: "Affordable" }, // Wallet icon placeholder
                  { icon: Laptop, label: "Tech-First" },
                  { icon: Heart, label: "Inclusive" } // Heart icon placeholder
               ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                     <item.icon size={32} className="text-[#D62828] mb-3" />
                     <span className="font-bold text-lg">{item.label}</span>
                  </div>
               ))}
            </div>
            <div className="mt-16 text-center">
               <Button size="lg" className="rounded-full px-12 py-4 bg-white text-black hover:bg-gray-200 font-bold" onClick={() => onNavigate('login')}>
                  Apply Now and Shape the Future
               </Button>
            </div>
         </div>
      </section>

      {/* 6. LEADERSHIP & GOVERNANCE */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-[#D62828] rounded-3xl rotate-3 opacity-10"></div>
                  <img 
                     src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932" 
                     alt="Executive Team" 
                     className="rounded-3xl shadow-2xl relative w-full"
                  />
               </div>
               <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-6 text-gray-900">Leadership with Integrity</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                     IMI is governed by a diverse board of educators, technologists, and policymakers dedicated to ethical AI and educational equity. Our leadership team brings decades of experience from Silicon Valley, top universities, and global NGOs.
                  </p>
                  <div className="flex gap-4 mb-8">
                     <div className="text-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="font-bold text-xl text-[#D62828]">Integrity</div>
                        <div className="text-xs text-gray-500">Core Value</div>
                     </div>
                     <div className="text-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="font-bold text-xl text-[#D62828]">Innovation</div>
                        <div className="text-xs text-gray-500">Core Value</div>
                     </div>
                     <div className="text-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="font-bold text-xl text-[#D62828]">Impact</div>
                        <div className="text-xs text-gray-500">Core Value</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 10. UNIVERSITY INSPIRED AI FEATURES */}
      <section className="py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4">World-Class Features</h2>
               <p className="text-gray-600">Inspired by the best, enhanced by AI.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Feature 1: MIT Style */}
               <Card className="p-6 border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-xl">Adaptive Skill Matrix</h3>
                     <Cpu className="text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Visualizes your competency in real-time using MIT-inspired progression algorithms.</p>
                  <div className="space-y-2 mb-4">
                     <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-600 w-3/4 h-full"></div></div>
                     <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-400 w-1/2 h-full"></div></div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('dashboard')}>Track Your Skills</Button>
               </Card>

               {/* Feature 2: Harvard Style */}
               <Card className="p-6 border-t-4 border-red-800 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-xl">Global Synapse</h3>
                     <Users className="text-red-800" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Real-time peer collaboration pods inspired by Harvard's case study method.</p>
                  <div className="flex -space-x-2 mb-4">
                     {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>)}
                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-800 border-2 border-white">+12</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('innovation')}>Collaborate Globally</Button>
               </Card>

               {/* Feature 3: Stanford Style */}
               <Card className="p-6 border-t-4 border-green-600 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-xl">Infinite Archive</h3>
                     <Search className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Interactive research library powered by semantic search, inspired by Stanford.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                     <div className="h-8 bg-green-50 rounded"></div>
                     <div className="h-8 bg-green-50 rounded"></div>
                     <div className="h-8 bg-green-50 rounded"></div>
                     <div className="h-8 bg-green-50 rounded"></div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('library')}>Access Research</Button>
               </Card>

               {/* Feature 4: Coursera Style */}
               <Card className="p-6 border-t-4 border-yellow-500 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-xl">Nano-Credentials</h3>
                     <Award className="text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Stackable micro-certifications recognized by top employers, Coursera-style.</p>
                  <div className="flex gap-2 mb-4">
                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"><Award size={16}/></div>
                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"><Award size={16}/></div>
                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"><Award size={16}/></div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Earn Credentials</Button>
               </Card>

               {/* Feature 5: edX Style */}
               <Card className="p-6 border-t-4 border-purple-600 hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-xl">Neural Mentor</h3>
                     <MessageSquare className="text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">24/7 AI mentorship providing instant academic guidance, edX-inspired.</p>
                  <div className="bg-purple-50 p-3 rounded-lg text-xs text-purple-800 mb-4 italic">
                     "How can I improve my Python code efficiency?"
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('contact-us')}>Start Chat</Button>
               </Card>
            </div>
         </div>
      </section>

      {/* 11. SOLAR CONTAINER REMOTE LEARNING */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
         <div className="absolute inset-0">
            <img 
               src="https://images.unsplash.com/photo-1497290756760-23ac55edf36f?q=80&w=1974" 
               alt="Solar Powered Learning" 
               className="w-full h-full object-cover opacity-30"
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <div className="inline-flex items-center gap-2 text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 rounded-full mb-6">
                  <Sun size={18} /> IMI Off-Grid Initiative
               </div>
               <h2 className="text-4xl md:text-6xl font-bold mb-6">Education Anywhere. <br/>Powered by the Sun.</h2>
               <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  We deploy autonomous, solar-powered learning containers to the most remote communities. Equipped with Starlink internet and AI tablets, we bring cutting-edge education to places the grid hasn't reached.
               </p>
               <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold border-none" onClick={() => onNavigate('contact-us')}>
                     Sponsor a Child
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate('contact-us')}>
                     View Deployment Map
                  </Button>
               </div>
            </div>
            <div className="flex-1">
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-lg">Live Container Status</h3>
                     <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> ONLINE
                     </div>
                  </div>
                  <div className="space-y-4 font-mono text-sm text-gray-300">
                     <div className="flex justify-between border-b border-white/10 pb-2">
                        <span>Solar Output</span>
                        <span>4.2 kW</span>
                     </div>
                     <div className="flex justify-between border-b border-white/10 pb-2">
                        <span>Active Tablets</span>
                        <span>24 / 30</span>
                     </div>
                     <div className="flex justify-between border-b border-white/10 pb-2">
                        <span>Internet</span>
                        <span>Starlink V2 (150 Mbps)</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Location</span>
                        <span>Rural Chongwe, ZM</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. STUDENT TESTIMONIALS */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Voices of Success</h2>
            <p className="text-gray-600">Hear from the learners transforming their lives with IMI.</p>
         </div>
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { name: "Chanda M.", country: "Zambia", role: "Cybersecurity Analyst", text: "IMI's AI tutor helped me pass my certifications in record time. I'm now working remotely for a UK firm." },
               { name: "Sarah L.", country: "Kenya", role: "AgriTech Founder", text: "The solar container learning hub in my village changed everything. I learned Python and built an irrigation app." },
               { name: "David K.", country: "Nigeria", role: "Data Scientist", text: "The mentorship from global peers at Harvard and MIT through the IMI platform was invaluable." }
            ].map((t, i) => (
               <Card key={i} className="p-8 bg-gray-50 border-none hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex gap-1 text-yellow-400 mb-4">
                     {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                     <div className="text-left">
                        <p className="font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.role} • {t.country}</p>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
         <div className="text-center mt-12">
            <Button variant="outline" onClick={() => onNavigate('learners')}>Read More Stories</Button>
         </div>
      </section>

      {/* 8. INSTITUTIONAL PARTNERSHIPS */}
      <section className="py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">Trusted by Global Leaders</h2>
               <p className="text-gray-600">Partnering with governments, universities, and tech giants.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholder Logos */}
               <div className="text-2xl font-black text-gray-400">GOOGLE</div>
               <div className="text-2xl font-black text-gray-400">MICROSOFT</div>
               <div className="text-2xl font-black text-gray-400">UNESCO</div>
               <div className="text-2xl font-black text-gray-400">AFRICAN UNION</div>
               <div className="text-2xl font-black text-gray-400">MIT MEDIA LAB</div>
            </div>
            <div className="mt-16 bg-blue-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-center bg-no-repeat bg-contain"></div>
               <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">Ready to Innovate With Us?</h3>
                  <p className="text-blue-200 mb-8 max-w-2xl mx-auto">Join our network of institutional partners and help shape the future of education in Africa and beyond.</p>
                  <Button className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 rounded-full" onClick={() => onNavigate('contact-us')}>
                     Become a Partner
                  </Button>
               </div>
            </div>
         </div>
      </section>

      {/* 9. FUTURE READY CTA */}
      <section className="py-24 bg-white text-center">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-5xl font-black mb-6">The Future is Waiting.</h2>
            <p className="text-xl text-gray-600 mb-10">
               Don't just watch the world change. Be the one who changes it. Join Innovative Minds Institute today.
            </p>
            <Button size="lg" className="rounded-full px-12 py-6 text-xl shadow-2xl bg-[#D62828] hover:bg-[#b01e1e]" onClick={() => onNavigate('login')}>
               Start Your AI Journey
            </Button>
         </div>
      </section>

    </div>
  );
};

// Helper components for icons not in Lucide (Mocking specific ones if needed)
const Star = ({ size, fill, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={fill || "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Wallet = ({ size, className }: any) => <CreditCard size={size} className={className} />; // Fallback
const Heart = ({ size, className }: any) => <Shield size={size} className={className} />; // Fallback
