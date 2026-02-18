
// Updated by AI: All marketing, AI features, and graphical enhancements applied.
import React, { useState } from 'react';
import { Button, Card } from '../components/UI';
import { 
  Search, ArrowRight, BookOpen, Headphones, PlayCircle, FileText, 
  Download, Quote, Globe, CheckCircle, Lock, 
  Sparkles, Bot, FileCheck, Building2, Book, Star, Brain, Zap, Cpu
} from 'lucide-react';

export const LibraryPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="font-inter bg-gray-50 text-gray-800">
      
      {/* 1. HERO INTRO: High Impact Visuals */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2228&auto=format&fit=crop" 
            alt="Library Background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        
        <div className="relative z-10 text-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-white/30 rounded-full bg-white/10 backdrop-blur-md">
             <Sparkles size={14} className="text-yellow-400"/> 
             <span className="text-white font-mono text-sm tracking-widest uppercase">AI-Powered Knowledge Base v2.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Knowledge Without <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Boundaries</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
            Access a world of ideas, peer-reviewed journals, and global research. Powered by Gemini AI to summarize, translate, and explain complex topics instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 py-4 text-lg bg-[#D62828] hover:bg-red-700 border-none shadow-lg shadow-red-900/50" onClick={() => document.getElementById('search-hub')?.scrollIntoView({behavior: 'smooth'})}>
              Explore Resources
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-lg text-white border-white hover:bg-white/10" onClick={() => onNavigate('landing')}>
              View Courses
            </Button>
          </div>
        </div>
      </section>

      {/* 2. MISSION STRIP */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
           <div className="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><Zap size={24}/></div>
              <h3 className="font-bold text-lg">Instant Answers</h3>
              <p className="text-gray-500 text-sm">AI-powered search finds concepts, not just keywords.</p>
           </div>
           <div className="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><Globe size={24}/></div>
              <h3 className="font-bold text-lg">Local Languages</h3>
              <p className="text-gray-500 text-sm">Translate PDFs to Bemba & Nyanja instantly.</p>
           </div>
           <div className="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><Cpu size={24}/></div>
              <h3 className="font-bold text-lg">Offline First</h3>
              <p className="text-gray-500 text-sm">Designed for low-bandwidth environments.</p>
           </div>
        </div>
      </section>

      {/* 3. SEARCH HUB */}
      <section id="search-hub" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Search the Global Archive</h2>
            <p className="text-gray-500">Indexing 50,000+ resources from IMI, JSTOR, and OpenAccess.</p>
          </div>
          
          <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 border border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search eBooks, Mock Exams, or Journals..." 
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-0 text-lg outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto p-2 md:p-0">
              <select 
                className="bg-gray-100 rounded-xl px-4 py-2 font-medium text-gray-700 border-none focus:ring-0 cursor-pointer hover:bg-gray-200 transition-colors"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="All">All Resources</option>
                <option value="eBooks">eBooks</option>
                <option value="Audio">Audio Books</option>
                <option value="Research">Research Papers</option>
                <option value="Exams">Mock Exams</option>
              </select>
              <Button className="rounded-xl px-8 bg-gray-900 text-white" icon={Search}>Search</Button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Artificial Intelligence', 'Agriculture', 'Business Law', 'Climate Change', 'Python', 'Nursing'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURE 1: AI RESEARCH ASSISTANT */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1581092919531-6a35f4f9d2d5?q=80&w=2070')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-400 text-xs font-bold mb-6">
              <Bot size={14} /> IMI AI Research Companion
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Personal Research Assistant</h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Stuck on a topic? Our conversational, citation-aware AI delivers trusted research materials in real time. Ask questions, get summaries, and find peer-reviewed sources instantly.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 border-none rounded-full px-8" onClick={() => onNavigate('dashboard')}>
                Start Smart Research <ArrowRight className="ml-2" size={20}/>
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/5 rounded-full px-8">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"><Bot size={20}/></div>
              <div>
                <h3 className="font-bold">Dr. Mwale (AI)</h3>
                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online & Ready</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none text-sm text-gray-300">
                I can help you find journals on <span className="text-blue-400 font-bold">Climate-Smart Agriculture</span> or summarize recent papers on <span className="text-blue-400 font-bold">Cyber Law</span>. What do you need today?
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg rounded-tr-none text-sm text-white ml-auto border border-blue-500/30 max-w-[80%]">
                Summarize the 2024 report on Zambian renewable energy trends.
              </div>
              <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none text-sm text-gray-300">
                 Scanning 1,204 documents... Found 3 key reports. Generating summary...
                 <div className="mt-2 h-1 w-24 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                 </div>
              </div>
            </div>
            <div className="relative">
              <input type="text" disabled placeholder="Ask a follow-up question..." className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none text-gray-500 cursor-not-allowed" />
              <button className="absolute right-2 top-2 p-1 bg-gray-800 rounded-md text-gray-500 cursor-not-allowed"><ArrowRight size={16}/></button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE 2: LINGUA-LINK TRANSLATION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1 relative">
              <div className="absolute top-10 -left-10 w-full h-full bg-yellow-100 rounded-3xl -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000" 
                alt="Student Reading" 
                className="rounded-3xl shadow-xl w-full object-cover h-[500px]"
              />
              <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right-10 duration-700">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">A</div>
                 <ArrowRight size={16} className="text-gray-400"/>
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">文</div>
                 <div className="text-sm">
                    <p className="font-bold">Translated to</p>
                    <p className="text-gray-500">Nyanja & Bemba</p>
                 </div>
              </div>
           </div>
           <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold mb-6">
                 <Globe size={14} /> Breaking Language Barriers
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Learn in Your Local Language</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                 Complex concepts shouldn't be hidden behind a language barrier. Our <span className="font-bold text-gray-900">Lingua-Link AI</span> instantly translates technical PDFs, textbooks, and transcripts into 7 major African languages, including Bemba, Nyanja, and Swahili.
              </p>
              <ul className="space-y-4 mb-8">
                 {['Instant PDF Translation', 'Voice-to-Text in Local Dialects', 'Cultural Context Adaptation'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                       <CheckCircle className="text-green-500" size={20} /> {feat}
                    </li>
                 ))}
              </ul>
              <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => onNavigate('dashboard')}>Try Translator Tool</Button>
           </div>
        </div>
      </section>

      {/* 6. FEATURE 3: PREDICTIVE EXAM PREP */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-bold mb-6">
                 <Brain size={14} /> Smart Exam Prep
              </div>
              <h2 className="text-4xl font-bold mb-6">Predictive Mock Exams</h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                 Stop guessing what to study. Our AI analyzes past papers and your reading history to generate <span className="text-white font-bold">custom mock exams</span>. It identifies your weak points and recommends specific chapters to review.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <h4 className="font-bold text-2xl mb-1 text-purple-400">85%</h4>
                    <p className="text-sm text-gray-400">Pass Rate Increase</p>
                 </div>
                 <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <h4 className="font-bold text-2xl mb-1 text-purple-400">24/7</h4>
                    <p className="text-sm text-gray-400">Tutor Availability</p>
                 </div>
              </div>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-500 border-none rounded-full px-8" onClick={() => onNavigate('dashboard')}>
                 Generate Mock Exam
              </Button>
           </div>
           <div className="relative">
              <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl relative z-10">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">Generated Study Plan</h3>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">High Priority</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-purple-50 transition-colors">
                       <FileCheck className="text-purple-600 mt-1" />
                       <div>
                          <p className="font-bold text-sm">Review: Cyber Law Section 4</p>
                          <p className="text-xs text-gray-500">Based on your last quiz mistake.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-purple-50 transition-colors">
                       <FileCheck className="text-purple-600 mt-1" />
                       <div>
                          <p className="font-bold text-sm">Practice: Data Encryption</p>
                          <p className="text-xs text-gray-500">Suggested due to upcoming module.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-purple-50 transition-colors">
                       <Bot className="text-purple-600 mt-1" />
                       <div>
                          <p className="font-bold text-sm">AI Tutor Session</p>
                          <p className="text-xs text-gray-500">Schedule a quick review on Phishing.</p>
                       </div>
                    </div>
                 </div>
                 <Button className="w-full mt-6 bg-gray-900 text-white hover:bg-black">Start Session</Button>
              </div>
              {/* Decoration Elements */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-purple-500/30 rounded-2xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-purple-900/20 rounded-2xl -z-20"></div>
           </div>
        </div>
      </section>

      {/* 7. RESOURCE CATEGORIES (Preserving Original Content Logic) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold mb-10 text-center">Browse Collections</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                 { title: "Academic Journals", icon: FileText, count: "12,000+", color: "bg-blue-100 text-blue-600" },
                 { title: "Audio Lectures", icon: Headphones, count: "4,500+", color: "bg-purple-100 text-purple-600" },
                 { title: "Video Masterclasses", icon: PlayCircle, count: "800+", color: "bg-red-100 text-red-600" },
                 { title: "Government Papers", icon: Building2, count: "1,200+", color: "bg-orange-100 text-orange-600" }
              ].map((cat, i) => (
                 <Card key={i} className="p-6 hover:shadow-lg transition-all cursor-pointer group border border-gray-100">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                       <cat.icon size={28} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
                    <p className="text-sm text-gray-500">{cat.count} Resources</p>
                 </Card>
              ))}
           </div>

           {/* Popular Downloads */}
           <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-gray-800">Trending Downloads This Week</h3>
                 <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-4 hover:border-blue-400 transition-colors cursor-pointer group">
                       <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Book size={24} />
                       </div>
                       <div>
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-2">Introduction to Python for Data Science: 2026 Edition</h4>
                          <p className="text-xs text-gray-500 mt-1">Author: Dr. J. Mwale</p>
                          <div className="flex gap-2 mt-2">
                             <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">PDF</span>
                             <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">2.4 MB</span>
                          </div>
                       </div>
                       <Button size="sm" variant="ghost" className="ml-auto text-gray-400 hover:text-blue-600">
                          <Download size={20} />
                       </Button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 8. SUCCESS STORIES */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Empowering Learners Everywhere</h2>
              <p className="text-gray-600">See how IMI's library tools are changing lives.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl relative">
                 <Quote className="absolute top-6 right-6 text-gray-200" size={48} />
                 <div className="flex items-center gap-4 mb-6">
                    <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000" alt="Student" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                       <p className="font-bold text-gray-900">Sarah K.</p>
                       <p className="text-xs text-gray-500">Medical Student, Lusaka</p>
                    </div>
                 </div>
                 <p className="text-gray-700 italic">"The AI Translator helped me understand complex medical journals in Nyanja. It made concepts click that I was struggling with for months."</p>
                 <div className="mt-4 flex gap-1 text-yellow-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl relative">
                 <Quote className="absolute top-6 right-6 text-gray-200" size={48} />
                 <div className="flex items-center gap-4 mb-6">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000" alt="Student" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                       <p className="font-bold text-gray-900">David M.</p>
                       <p className="text-xs text-gray-500">AgriTech Entrepreneur</p>
                    </div>
                 </div>
                 <p className="text-gray-700 italic">"I used the Research Assistant to find soil analysis reports for my startup. It saved me weeks of manual searching. Truly a game changer."</p>
                 <div className="mt-4 flex gap-1 text-yellow-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl relative">
                 <Quote className="absolute top-6 right-6 text-gray-200" size={48} />
                 <div className="flex items-center gap-4 mb-6">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000" alt="Student" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                       <p className="font-bold text-gray-900">Grace L.</p>
                       <p className="text-xs text-gray-500">Government Policy Analyst</p>
                    </div>
                 </div>
                 <p className="text-gray-700 italic">"The predictive exam tools helped me prepare for my certification while working full-time. The summaries are accurate and concise."</p>
                 <div className="mt-4 flex gap-1 text-yellow-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              </div>
           </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-24 bg-[#D62828] text-white text-center">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Start Your Knowledge Journey Today</h2>
            <p className="text-xl text-red-100 mb-10">
               Join over 15,000 learners accessing the future of education. Create your free account to unlock the full potential of our AI Library.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Button size="lg" className="bg-white text-[#D62828] hover:bg-gray-100 font-bold border-none px-10 rounded-full" onClick={() => onNavigate('login')}>
                  Create Free Account
               </Button>
               <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 rounded-full" onClick={() => onNavigate('landing')}>
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
