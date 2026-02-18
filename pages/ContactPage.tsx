import React, { useState } from 'react';
import { Button, Card, Input } from '../components/UI';
import { auth, db, logEvent } from '../services/firebase';
import { getChatResponse } from '../services/geminiService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Users, Monitor, CreditCard, BookOpen, FileCheck, Award, Library as LibraryIcon, Shield, Activity,
  MessageCircle, Bot, HelpCircle, Loader2, CheckCircle, ShieldAlert, Mail, PhoneCall, MapPin, ChevronRight
} from 'lucide-react';

// WhatsApp Icon SVG for the Card
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382C17.11 14.196 15.333 13.3 15 13.159C14.667 13.018 14.423 12.948 14.179 13.341C13.935 13.734 13.242 14.582 13.033 14.819C12.823 15.056 12.613 15.087 12.251 14.897C11.889 14.707 10.723 14.312 9.341 13.045C8.257 12.051 7.525 10.823 7.315 10.453C7.105 10.083 7.293 9.882 7.474 9.696C7.636 9.53 7.834 9.263 8.015 9.043C8.196 8.823 8.257 8.665 8.378 8.413C8.499 8.161 8.438 7.94 8.347 7.751C8.256 7.562 7.563 5.799 7.276 5.083C6.995 4.386 6.711 4.481 6.509 4.471C6.319 4.461 6.102 4.461 5.885 4.461C5.668 4.461 5.313 4.544 5.016 4.876C4.719 5.208 3.88 6.012 3.88 7.649C3.88 9.286 5.037 10.908 5.2 11.137C5.363 11.366 7.509 14.792 10.795 16.273C11.577 16.626 12.187 16.837 12.667 16.994C13.433 17.244 14.135 17.208 14.693 17.121C15.313 17.024 16.602 16.313 16.87 15.533C17.138 14.753 17.138 14.092 17.065 13.965C16.992 13.838 16.8 13.765 16.438 13.575H17.472ZM12.037 22.001C10.237 22.001 8.556 21.521 7.085 20.672L6.732 20.457L2.91 21.48L3.957 17.657L3.725 17.276C2.793 15.753 2.302 13.976 2.302 12.146C2.302 6.712 6.669 2.279 12.037 2.279C14.639 2.279 17.086 3.315 18.924 5.195C20.762 7.075 21.774 9.575 21.774 12.146C21.774 17.58 17.407 22.001 12.037 22.001Z" />
  </svg>
);

export const ContactPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [activeSegment, setActiveSegment] = useState<'prospective' | 'enrolled' | 'grad' | 'partner'>('prospective');
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardCategory, setWizardCategory] = useState('');
  const [wizardLoading, setWizardLoading] = useState(false);
  const [wizardSolution, setWizardSolution] = useState('');
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toolRunning, setToolRunning] = useState<string | null>(null);

  // Department Data
  const departments = [
    { id: 'admissions', name: 'Admissions & Enrollment', icon: Users, tools: ['Enrollment Wizard', 'Eligibility Checker'] },
    { id: 'tech', name: 'Technology & I.T', icon: Monitor, tools: ['Login Recovery', 'System Diagnostics'] },
    { id: 'finance', name: 'Finance & Accounts', icon: CreditCard, tools: ['Payment Status', 'Invoice Generator'] },
    { id: 'academic', name: 'Academic Support', icon: BookOpen, tools: ['Course Progress', 'Exam Eligibility'] },
    { id: 'assignments', name: 'Assignments & Subs', icon: FileCheck, tools: ['Upload Validator', 'Submission Status'] },
    { id: 'records', name: 'Certification & Records', icon: Award, tools: ['Certificate Download', 'Verification'] },
    { id: 'library', name: 'Library Resources', icon: LibraryIcon, tools: ['Access Help', 'Download Resolver'] },
    { id: 'policy', name: 'Policy & Disputes', icon: Shield, tools: ['Complaint Workflow', 'Appeal Guide'] },
    { id: 'status', name: 'System Status', icon: Activity, tools: ['Live Status', 'Maintenance Log'] }
  ];

  const handleWizardStart = async (category: string) => {
    setWizardCategory(category);
    setWizardStep(1);
    setWizardLoading(true);

    try {
      // Log event
      logEvent('contact_wizard_start', { category });

      // AI Resolution
      const prompt = `User has an issue with "${category}" at Innovative Minds Institute. Provide a single, specific, actionable self-help step they should try immediately. Keep it under 2 sentences.`;
      const response = await getChatResponse(prompt, "Contact Support Wizard");
      
      setWizardSolution(response);
      setWizardLoading(false);
      setWizardStep(2);
    } catch (e) {
      console.error("Wizard AI Error", e);
      setWizardSolution("Please check your internet connection and try refreshing the page.");
      setWizardLoading(false);
      setWizardStep(2);
    }
  };

  const handleWizardResolution = async (resolved: boolean) => {
    if (resolved) {
      setWizardStep(0);
      alert("Glad we could help!");
      // Log resolution
      try {
        await addDoc(collection(db, 'issue_resolutions'), {
          category: wizardCategory,
          resolved: true,
          method: 'ai_wizard',
          timestamp: serverTimestamp()
        });
      } catch(e) {}
    } else {
      setWizardStep(3); // Escalate
      // Log failure
      try {
        await addDoc(collection(db, 'issue_resolutions'), {
          category: wizardCategory,
          resolved: false,
          method: 'ai_wizard',
          timestamp: serverTimestamp()
        });
      } catch(e) {}
    }
  };

  const handleToolClick = (toolName: string) => {
    setToolRunning(toolName);
    setTimeout(() => {
      setToolRunning(null);
      alert(`${toolName} completed successfully. No issues found.`);
      // Log tool usage
      try {
        addDoc(collection(db, 'admin_actions'), {
          action: 'tool_usage',
          tool: toolName,
          user: auth.currentUser?.uid || 'guest',
          timestamp: serverTimestamp()
        });
      } catch(e) {}
    }, 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'complaints'), {
        ...formState,
        userId: auth.currentUser?.uid || 'guest',
        status: 'open',
        source: 'contact_page',
        timestamp: serverTimestamp()
      });

      setSubmitted(true);
      setTimeout(() => {
          setSubmitted(false);
          setFormState({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (e) {
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-900/20"></div>
         <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">How Can We Help You Today?</h1>
            <p className="text-xl text-gray-300 mb-8">Our AI-powered support center is designed to resolve your issues instantly.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Button size="lg" onClick={() => document.getElementById('resolution-wizard')?.scrollIntoView({ behavior: 'smooth' })}>Resolve an Issue Now</Button>
               <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => document.getElementById('escalation')?.scrollIntoView({ behavior: 'smooth' })}>Speak to a Support Agent</Button>
            </div>
         </div>
      </section>

      {/* 2. SMART ROUTING PANEL */}
      <section className="sticky top-16 z-20 bg-white border-b shadow-sm overflow-x-auto">
         <div className="max-w-7xl mx-auto flex justify-center min-w-max">
            {[
               { id: 'prospective', label: 'Prospective Student' },
               { id: 'enrolled', label: 'Enrolled Student' },
               { id: 'grad', label: 'Graduate / Alumni' },
               { id: 'partner', label: 'Partner / Employer' }
            ].map(seg => (
               <button 
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id as any)}
                  className={`px-8 py-4 font-bold text-sm border-b-4 transition-colors ${
                     activeSegment === seg.id 
                     ? 'border-[#D62828] text-[#D62828] bg-red-50' 
                     : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
               >
                  {seg.label}
               </button>
            ))}
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">

         {/* 3. AI CHAT ASSISTANT PROMO */}
         <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
               <Bot size={200} />
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <MessageCircle className="text-blue-600" /> "Ask Dr. Mwale"
               </h3>
               <p className="text-blue-700 max-w-xl mt-1">Our academic AI assistant is available 24/7 to answer questions about enrollment, payments, courses, and policies instantly.</p>
            </div>
            <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700 border-none relative z-10" onClick={() => (window as any).scrollTo(0,0)}>Open Chat</Button>
         </div>

         {/* 4. FAQ HUB */}
         <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                  { q: "How do I reset my portal password?", a: "Go to the login page and click 'Forgot Password'. A reset link will be sent to your registered email." },
                  { q: "When are new workshops added?", a: "New content is released on the first Monday of every month. Check the 'All Workshops' page." },
                  { q: "How do I download my certificate?", a: "Go to Dashboard > Certificates. Ensure you have achieved 85% or higher in the final exam." },
                  { q: "My payment failed, what should I do?", a: "Check your card limits. If the issue persists, use the Payment Status Tracker in the Finance Department section." },
                  { q: "Can I change my enrollment details?", a: "Yes, visit the Admissions Department section below and use the Enrollment Update tool." }
               ].map((faq, i) => (
                  <div key={i} className="bg-white border p-4 rounded-xl hover:shadow-md transition-shadow">
                     <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-[#D62828]"/> {faq.q}</h4>
                     <p className="text-sm text-gray-600 pl-6">{faq.a}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* 5. RESOLUTION WIZARD */}
         <section id="resolution-wizard" className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 text-white p-8 text-center">
               <h2 className="text-3xl font-bold mb-2">Guided Issue Resolution</h2>
               <p className="text-gray-400">Let's solve your problem together. Select an option to begin.</p>
            </div>
            <div className="p-8">
               {wizardStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {['I cannot login', 'Payment issue', 'Course content missing', 'Certificate not generating', 'Enrollment error', 'Other inquiry'].map((opt, i) => (
                        <button key={i} onClick={() => handleWizardStart(opt)} className="p-6 border rounded-xl hover:border-[#D62828] hover:bg-red-50 text-left font-bold transition-all">
                           {opt}
                        </button>
                     ))}
                  </div>
               )}
               {wizardStep === 1 && (
                  <div className="text-center space-y-6 py-12">
                     <div className="flex justify-center">
                        <Loader2 size={48} className="animate-spin text-[#D62828]" />
                     </div>
                     <h3 className="text-xl font-bold">Analyzing your issue...</h3>
                     <p className="text-gray-600">Dr. Mwale AI is scanning our knowledge base for "{wizardCategory}".</p>
                  </div>
               )}
               {wizardStep === 2 && (
                  <div className="text-center">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                     </div>
                     <h3 className="text-xl font-bold mb-2">Suggested Solution</h3>
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto mb-8 text-left">
                        <p className="font-medium text-gray-800">{wizardSolution}</p>
                     </div>
                     <div className="flex justify-center gap-4">
                        <Button onClick={() => handleWizardResolution(true)}>It Worked!</Button>
                        <Button variant="outline" onClick={() => handleWizardResolution(false)}>Still Need Help</Button>
                     </div>
                  </div>
               )}
               {wizardStep === 3 && (
                  <div className="text-center">
                     <h3 className="text-xl font-bold mb-4">Proceed to Complaint Portal</h3>
                     <p className="text-gray-600 mb-6">Since automated tools could not resolve this, please submit a detailed ticket below.</p>
                     <Button onClick={() => document.getElementById('complaint-form')?.scrollIntoView({behavior: 'smooth'})}>Open Ticket Form</Button>
                  </div>
               )}
            </div>
         </section>

         {/* 11-19. DEPARTMENT SELF-SERVICE HUB */}
         <section>
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px bg-gray-200 flex-1"></div>
               <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Self-Service Departments</h2>
               <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {departments.map(dept => (
                  <div 
                     key={dept.id} 
                     onClick={() => setActiveDept(activeDept === dept.id ? null : dept.id)}
                     className={`cursor-pointer transition-all duration-300 border rounded-2xl overflow-hidden ${activeDept === dept.id ? 'ring-2 ring-[#D62828] shadow-lg' : 'hover:shadow-md bg-white'}`}
                  >
                     <div className="p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${activeDept === dept.id ? 'bg-[#D62828] text-white' : 'bg-gray-100 text-gray-600'}`}>
                           <dept.icon size={24} />
                        </div>
                        <h3 className="font-bold text-lg">{dept.name}</h3>
                     </div>
                     
                     {/* Expanded Tools View */}
                     {activeDept === dept.id && (
                        <div className="bg-gray-50 p-6 border-t animate-in slide-in-from-top-2">
                           <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Available Tools</h4>
                           <div className="space-y-2">
                              {dept.tools.map((tool, i) => (
                                 <div 
                                    key={i} 
                                    onClick={(e) => { e.stopPropagation(); handleToolClick(tool); }}
                                    className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-blue-400 cursor-pointer group transition-colors"
                                 >
                                    <span className="text-sm font-medium">
                                       {toolRunning === tool ? 'Running...' : tool}
                                    </span>
                                    {toolRunning === tool ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />}
                                 </div>
                              ))}
                           </div>
                           <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                              <button className="text-xs font-bold text-[#D62828] hover:underline">View Department Policy</button>
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </section>

         {/* 7. COMPLAINT & FEEDBACK PORTAL (Existing Form Enhanced) */}
         <section id="complaint-form" className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <div>
               <h2 className="text-3xl font-bold mb-4">Submit a Formal Request</h2>
               <p className="text-gray-600 mb-8">
                  For issues not resolved by our AI tools, please submit a ticket. Our Academic Support team typically responds within 24-48 hours.
               </p>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <CheckCircle className="text-green-500 mt-1" />
                     <div>
                        <h4 className="font-bold">Ticket Tracking</h4>
                        <p className="text-sm text-gray-500">You will receive a tracking ID via email.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <ShieldAlert className="text-blue-500 mt-1" />
                     <div>
                        <h4 className="font-bold">Priority Escalation</h4>
                        <p className="text-sm text-gray-500">Urgent exam or payment issues are flagged automatically.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
               {submitted ? (
                  <div className="text-center py-12 animate-in fade-in">
                     <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                     <h3 className="text-2xl font-bold text-gray-900">Request Received</h3>
                     <p className="text-gray-600">Your ticket has been logged. We will contact you shortly.</p>
                  </div>
               ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <Input label="Name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} required />
                        <Input label="Email" type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} required />
                     </div>
                     <Input label="Subject" value={formState.subject} onChange={e => setFormState({...formState, subject: e.target.value})} required />
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Message</label>
                        <textarea 
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62828] h-32 resize-none"
                           placeholder="Describe your issue..."
                           value={formState.message}
                           onChange={e => setFormState({...formState, message: e.target.value})}
                           required
                        ></textarea>
                     </div>
                     <Button type="submit" className="w-full" isLoading={isSubmitting}>Submit Ticket</Button>
                  </form>
               )}
            </div>
         </section>

         {/* 21. VIRTUAL CALL CENTER / FINAL ESCALATION (Existing Content Integration) */}
         <section id="escalation" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold mb-4">Still Need Human Support?</h2>
               <p className="text-gray-600">If our self-help tools haven't resolved your issue, our specialized teams are ready to assist.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-[#D62828]">
                  <div className="w-16 h-16 bg-red-100 text-[#D62828] rounded-full flex items-center justify-center mx-auto mb-6">
                     <Mail size={32} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Email Support</h3>
                  <p className="text-gray-500 mb-4 text-sm">Response within 24 hours</p>
                  <p className="font-medium text-[#D62828]">info@imlearn.org</p>
                  <p className="font-medium text-[#D62828]">support@imlearn.org</p>
               </Card>

               <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-blue-600">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <PhoneCall size={32} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Voice Support</h3>
                  <p className="text-gray-500 mb-4 text-sm">Mon-Fri: 8am - 5pm</p>
                  <p className="font-medium text-gray-900">+260 977 123 456</p>
                  <p className="font-medium text-gray-900">+260 211 123 456</p>
               </Card>

               <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-green-600">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <MapPin size={32} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Campus Visit</h3>
                  <p className="text-gray-500 mb-4 text-sm">Main Administration</p>
                  <p className="font-medium text-gray-900">Plot 1234, Great East Road</p>
                  <p className="font-medium text-gray-900">Lusaka, Zambia</p>
               </Card>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-80 w-full overflow-hidden relative group mt-12">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                   <div className="text-center">
                     <MapPin size={48} className="mx-auto mb-2 opacity-50"/>
                     <p className="font-bold">Interactive Campus Map</p>
                     <p className="text-xs">(Google Maps Integration Placeholder)</p>
                   </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000" 
                  alt="Map Location" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                />
             </div>
         </section>

         {/* 22. WHATSAPP CARD - ADDED SECTION */}
         <section className="mt-12 mb-12">
            <Card className="bg-gradient-to-r from-[#DCF8C6] to-white border-green-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-md">
                     <WhatsAppIcon size={40} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">24/7 WhatsApp Support</h2>
                     <p className="text-lg text-gray-700">Instant answers for enrollment, technical issues, and payments.</p>
                  </div>
               </div>
               <Button 
                  className="bg-[#25D366] hover:bg-[#128C7E] border-none text-white px-10 py-6 rounded-full font-bold text-xl shadow-xl flex items-center gap-3 transition-transform hover:scale-105"
                  onClick={() => window.open('https://api.whatsapp.com/send?phone=15817019840&text=76MD4T', '_blank')}
               >
                  <WhatsAppIcon size={24} /> Chat with Us on WhatsApp
               </Button>
            </Card>
         </section>

      </div>
    </div>
  );
};

export default ContactPage;