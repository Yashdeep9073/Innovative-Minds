
import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Check, Circle, Clock, MessageSquare, X, Send, Sparkles, Linkedin, Award, Share2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { logChatLog, auth } from '../services/firebase';

// --- 1. APPLICATION STATUS TRACKER ---
interface TrackerProps {
  status: 'draft' | 'pending_review' | 'accepted' | 'enrolled' | 'rejected' | 'in_progress' | 'completed' | 'dropped';
  currentStep: number; // 1-4
  courseTitle: string;
}

export const ApplicationStatusTracker: React.FC<TrackerProps> = ({ status, currentStep, courseTitle }) => {
  const steps = [
    { id: 1, label: 'Submitted', icon: Clock },
    { id: 2, label: 'Under Review', icon: SearchIcon },
    { id: 3, label: 'Decision', icon: Award },
    { id: 4, label: 'Enrolled', icon: Check }
  ];

  // Helper for icon component
  function SearchIcon({size, className}: any) {
      return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  }

  return (
    <Card className="p-6 mb-6 border-l-4 border-l-[#D62828] animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Application Status: <span className="text-[#D62828]">{courseTitle}</span></h3>
          <p className="text-sm text-gray-500">Tracking ID: IMI-{Math.floor(Math.random()*10000)}</p>
        </div>
        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider">
          {status.replace('_', ' ')}
        </div>
      </div>

      <div className="relative flex justify-between items-center px-4">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#D62828] transition-all duration-1000 -z-10" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = step.id <= currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-[#D62828] border-[#D62828] text-white scale-110 shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <step.icon size={18} />
              </div>
              <span className={`text-xs font-bold mt-2 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// --- 2. ENROLLMENT AI ASSISTANT ---
export const EnrollmentChatAssistant: React.FC<{ context: string }> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `Hello! I'm Dr. Mwale. I see you're applying for ${context}. Need help with requirements or scholarship essays?` }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const handleSend = async () => {
    if(!input.trim()) return;
    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setTyping(true);

    // Simulated specific enrollment context prompt
    const prompt = `User is currently in the enrollment wizard for course: "${context}". User asks: "${userMsg}". Provide a short, encouraging answer helpful for a student filling out a form.`;
    const response = await getChatResponse(prompt, "Enrollment Wizard Assistant");
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setTyping(false);

    // Backend: Log Interaction for Audit
    const uid = auth.currentUser?.uid || 'guest';
    logChatLog(uid, context, [...newMessages, { role: 'ai', text: response, timestamp: new Date() }]);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#D62828] text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 animate-bounce-subtle"
      >
        <Sparkles size={18} className="text-yellow-300" />
        <span className="font-bold text-sm">Application Help</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-10 flex flex-col max-h-[500px]">
      <div className="bg-[#D62828] p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🎓</div>
          <div>
            <h4 className="font-bold text-sm">Admissions AI</h4>
            <p className="text-[10px] text-red-100">Online • Replies Instantly</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)}><X size={18}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 h-64">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && <div className="text-xs text-gray-400 italic pl-2">Dr. Mwale is typing...</div>}
      </div>

      <div className="p-3 bg-white border-t flex gap-2">
        <input 
          className="flex-1 text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#D62828] outline-none"
          placeholder="Ask about fees, deadlines..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-[#D62828] text-white p-2 rounded-lg"><Send size={16}/></button>
      </div>
    </div>
  );
};

// --- 3. RECOMMENDATION CAROUSEL ---
export const RecommendationCarousel: React.FC<{ category: string, onNavigate: (p:string)=>void }> = ({ category, onNavigate }) => {
  // Mock recommendations based on category
  const recs = [
    { title: "Advanced Data Ethics", cat: "Technology", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300" },
    { title: "Leadership 101", cat: "Business", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300" },
    { title: "Project Management", cat: "Business", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300" }
  ];

  return (
    <div className="mt-8">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles size={16} className="text-purple-600"/> Recommended Next Steps
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recs.map((r, i) => (
          <div key={i} className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all" onClick={() => onNavigate('all-workshops')}>
            <img src={r.image} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" alt={r.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
              <span className="text-[10px] text-purple-300 font-bold uppercase">{r.cat}</span>
              <h4 className="text-white font-bold text-sm leading-tight">{r.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. SOCIAL SYNC BUTTONS ---
export const ProfileSyncButtons: React.FC<{ courseTitle: string }> = ({ courseTitle }) => {
  const handleShare = (platform: string) => {
    alert(`Opening ${platform} to share: "I just enrolled in ${courseTitle} at IMI!"`);
  };

  return (
    <div className="flex gap-3 justify-center my-6">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-[#0077b5] border-[#0077b5] hover:bg-[#0077b5] hover:text-white"
        onClick={() => handleShare('LinkedIn')}
      >
        <Linkedin size={16} className="mr-2"/> Add to Profile
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-gray-700 border-gray-300 hover:bg-gray-100"
        onClick={() => handleShare('Share')}
      >
        <Share2 size={16} className="mr-2"/> Share Badge
      </Button>
    </div>
  );
};
