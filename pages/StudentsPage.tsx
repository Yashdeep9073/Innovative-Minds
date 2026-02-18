
import React from 'react';
import { Button, Card } from '../components/UI';
import { 
  User, Compass, BookOpen, LayoutDashboard, Briefcase, GraduationCap, Globe, 
  Library, ShieldCheck, PenTool, MessageCircle, Zap, BarChart, Phone, Layers, 
  Users as UsersIcon, Clock, Star, Folder, BadgeCheck, HelpCircle, Search, 
  Rocket, FileText, PlayCircle, CheckCircle, Sparkles, Brain, ArrowRight, Award,
  Heart, Handshake, Flame, Target, UserPlus, Gauge
} from 'lucide-react';
import { recordWellbeingCheckin, requestMentorship, updateLearningStreak, inviteGuardian, updateLearningPace } from '../services/firebase';
import { auth } from '../services/firebase';

export const StudentsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
   
   // Helper for simple actions
   const handleSimpleAction = async (action: string, payload?: any) => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
         onNavigate('login');
         return;
      }
      
      try {
         if (action === 'wellbeing') {
            await recordWellbeingCheckin(uid, payload || 'Good');
            alert("Mood recorded! Keep up the great work.");
         }
         if (action === 'mentor') {
            await requestMentorship(uid, payload || 'General');
            alert("Mentorship request sent! We will match you shortly.");
         }
         if (action === 'streak') {
            await updateLearningStreak(uid);
            alert("Streak updated! You are on fire 🔥");
         }
         if (action === 'pace') {
            await updateLearningPace(uid, payload || 'Accelerated');
            alert(`Learning pace set to: ${payload}`);
         }
         if (action === 'guardian') {
            const email = prompt("Enter parent/guardian email:");
            if (email) {
               await inviteGuardian(uid, email);
               alert("Invitation sent!");
            }
         }
      } catch (e) {
         console.error(e);
         alert("Action failed. Please try again.");
      }
   };

   return (
   <div className="font-inter bg-gray-50 text-gray-800">
      
      {/* 0. EXISTING HERO (RETAINED) */}
      <div className="bg-white">
         <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
               <div className="flex-1 animate-in slide-in-from-left-10 duration-700 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-4 md:mb-6">
                     <UsersIcon size={14} /> IMI Student Community
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 md:mb-6 leading-tight">Student Life at <span className="text-[#D62828]">IMI</span></h1>
                  <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                     More than just online courses, IMI offers a vibrant community of innovators. From virtual hackathons to local meetups, discover how our students are shaping the future.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                     <Button onClick={() => onNavigate('all-workshops')} size="lg" className="w-full sm:w-auto">Join the Community</Button>
                     <Button variant="outline" onClick={() => onNavigate('all-workshops')} size="lg" className="w-full sm:w-auto">Start Here</Button>
                  </div>
               </div>
               <div className="flex-1 relative w-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20 -z-10"></div>
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000" className="rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full" alt="Students" />
               </div>
            </div>
         </div>
      </div>

      {/* 1. STUDENT ONBOARDING HUB */}
      <section id="onboarding" className="py-12 md:py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
               <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
               <p className="text-gray-600">Select your path to get a personalized experience.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[
                  { title: "New Students", icon: User, desc: "Create account & orientation.", action: () => onNavigate('all-workshops') },
                  { title: "Returning", icon: Rocket, desc: "Resume your courses.", action: () => onNavigate('login') },
                  { title: "Professionals", icon: Briefcase, desc: "Upskill for your career.", action: () => onNavigate('workshops-category/Certificate') },
                  { title: "International", icon: Globe, desc: "Global study options.", action: () => onNavigate('all-workshops') }
               ].map((item, i) => (
                  <Card key={i} className="p-6 text-center hover:-translate-y-2 transition-transform cursor-pointer" onClick={item.action}>
                     <div className="w-14 h-14 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-[#D62828] mb-4 border border-gray-100">
                        <item.icon size={24} />
                     </div>
                     <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                     <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                     <span className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1">Begin <ArrowRight size={12}/></span>
                  </Card>
               ))}
            </div>
            <div className="mt-8 text-center">
               <Button onClick={() => onNavigate('all-workshops')} size="lg" className="rounded-full px-8 w-full sm:w-auto">Begin Your Learning Journey</Button>
            </div>
         </div>
      </section>

      {/* 2 & 17 & 3. ACADEMIC CORE (Course Finder, Recs, Workshops) */}
      <section className="py-12 md:py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
               {/* AI Course Finder */}
               <div className="lg:col-span-2 bg-gray-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
                  <div className="absolute right-0 top-0 opacity-10 p-8"><Compass size={200} /></div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-2 text-yellow-400 mb-4 font-bold text-sm uppercase tracking-wide">
                        <Sparkles size={16} /> AI-Powered
                     </div>
                     <h2 className="text-3xl md:text-4xl font-bold mb-6">Smart Course Finder</h2>
                     <p className="text-gray-300 mb-8 max-w-lg">
                        Not sure what to learn? Tell our AI your career goals, interests, and current level. We'll build a custom curriculum just for you.
                     </p>
                     <div className="flex flex-wrap gap-3 mb-8">
                        {['Python', 'AgriTech', 'Business', 'Nursing'].map(tag => (
                           <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">{tag}</span>
                        ))}
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-white text-gray-900 hover:bg-gray-100 border-none w-full sm:w-auto" onClick={() => onNavigate('all-workshops')}>Find & Enroll Now</Button>
                        <Button variant="outline" className="text-white border-white hover:bg-white/10 w-full sm:w-auto" onClick={() => onNavigate('workshops-category/Technology')}>Recommended for You</Button>
                     </div>
                  </div>
               </div>

               {/* Workshops Quick Access */}
               <div className="space-y-6">
                  <Card className="p-6 bg-red-50 border-red-100">
                     <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><PlayCircle className="text-[#D62828]"/> Workshops</h3>
                     <p className="text-sm text-gray-600 mb-4">Access 100+ beginner-friendly workshops with instant certification.</p>
                     <Button className="w-full" onClick={() => onNavigate('workshops-category/Workshop')}>Explore Workshops</Button>
                  </Card>
                  
                  {/* Dashboard Preview */}
                  <Card className="p-6">
                     <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><LayoutDashboard className="text-blue-600"/> Dashboard</h3>
                     <p className="text-sm text-gray-600 mb-4">Track progress, view earned badges, and manage your schedule.</p>
                     <div className="w-full bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
                        <div className="bg-blue-600 h-full w-2/3"></div>
                     </div>
                     <Button variant="outline" className="w-full" onClick={() => onNavigate('login')}>Go to My Dashboard</Button>
                  </Card>
               </div>
            </div>
         </div>
      </section>

      {/* 4. ASSIGNMENT BUDDY (MANDATORY & HIGHLIGHTED) */}
      <section className="py-12 md:py-20 bg-[#D62828] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
         <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <div className="inline-block bg-white text-[#D62828] font-black px-4 py-1 rounded shadow-lg transform -rotate-2 mb-6">
               PREMIUM STUDENT SERVICE
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">Assignment Buddy</h2>
            <p className="text-lg md:text-xl text-red-100 mb-10 max-w-2xl mx-auto">
               Struggling with formatting or structure? Upload your draft, and our academic team will format it to IMI standards and send it back via WhatsApp or Email.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-10">
               <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20">
                  <FileText className="mb-4 text-yellow-400" size={32} />
                  <h4 className="font-bold text-lg mb-2">1. Upload Draft</h4>
                  <p className="text-sm text-red-100">Submit your raw text or document.</p>
               </div>
               <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20">
                  <PenTool className="mb-4 text-yellow-400" size={32} />
                  <h4 className="font-bold text-lg mb-2">2. Expert Review</h4>
                  <p className="text-sm text-red-100">We format, check citations, and structure it.</p>
               </div>
               <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20">
                  <CheckCircle className="mb-4 text-yellow-400" size={32} />
                  <h4 className="font-bold text-lg mb-2">3. Receive & Submit</h4>
                  <p className="text-sm text-red-100">Get the perfect file ready for submission.</p>
               </div>
            </div>

            <Button size="lg" className="bg-white text-[#D62828] hover:bg-gray-100 border-none font-bold text-lg px-8 md:px-12 rounded-full shadow-2xl w-full sm:w-auto" onClick={() => onNavigate('dashboard')}>
               Submit Assignment Request
            </Button>
            <p className="mt-4 text-sm opacity-70 text-red-200">
               *Available for enrolled students only. Standard fee applies.
            </p>
         </div>
      </section>

      {/* 5. GROWTH & CAREER HUB */}
      <section className="py-12 md:py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Your Growth Ecosystem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* 6. Career Hub */}
               <Card className="p-8 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                     <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Career & Employability</h3>
                  <p className="text-gray-600 mb-6">Job readiness training, CV enhancement, and exclusive interview preparation workshops.</p>
                  <Button variant="outline" className="w-full" onClick={() => onNavigate('contact-us')}>Prepare for Employment</Button>
               </Card>

               {/* 7. Scholarships */}
               <Card className="p-8 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                     <Award size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Scholarships & Aid</h3>
                  <p className="text-gray-600 mb-6">Merit-based partial scholarships and flexible learning pathways for qualifying students.</p>
                  <Button variant="outline" className="w-full" onClick={() => onNavigate('contact-us')}>Apply for Support</Button>
               </Card>

               {/* 8. Full Time Study */}
               <Card className="p-8 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                     <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Study Full-Time</h3>
                  <p className="text-gray-600 mb-6">Explore accredited degree programs with our global partner campuses and universities.</p>
                  <Button variant="outline" className="w-full" onClick={() => onNavigate('contact-us')}>Apply for Full-Time Study</Button>
               </Card>
            </div>
         </div>
      </section>

      {/* 6. PREMIUM SERVICES MARKETPLACE */}
      <section className="py-12 md:py-20 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
               <div>
                  <h2 className="text-3xl font-bold mb-2">Premium Student Services</h2>
                  <p className="text-gray-500">Upgrade your experience with these advanced tools.</p>
               </div>
               <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="text-[#D62828] w-full md:w-auto">View All Services</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {/* 9. Digital Library */}
               <Card className="p-5 border border-gray-100 hover:border-blue-300 transition-colors">
                  <Library className="text-blue-600 mb-3" />
                  <h4 className="font-bold mb-1">Digital Library</h4>
                  <p className="text-xs text-gray-500 mb-4">Access eBooks, audio books, and past papers.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('library')}>Access Library</Button>
               </Card>

               {/* 10. Verification */}
               <Card className="p-5 border border-gray-100 hover:border-green-300 transition-colors">
                  <ShieldCheck className="text-green-600 mb-3" />
                  <h4 className="font-bold mb-1">Cert Verification</h4>
                  <p className="text-xs text-gray-500 mb-4">Fast-track digital verification & reissues.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('contact-us')}>Verify My Certificate</Button>
               </Card>

               {/* 11. Exam Prep */}
               <Card className="p-5 border border-gray-100 hover:border-purple-300 transition-colors">
                  <PenTool className="text-purple-600 mb-3" />
                  <h4 className="font-bold mb-1">Exam Prep</h4>
                  <p className="text-xs text-gray-500 mb-4">Mock exams for university entrance.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('library')}>Prepare for Exams</Button>
               </Card>

               {/* 12. Academic Advisory */}
               <Card className="p-5 border border-gray-100 hover:border-yellow-300 transition-colors">
                  <UsersIcon className="text-yellow-600 mb-3" />
                  <h4 className="font-bold mb-1">Academic Advisory</h4>
                  <p className="text-xs text-gray-500 mb-4">1-on-1 consultation for study planning.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('contact-us')}>Get Academic Advice</Button>
               </Card>

               {/* 13. International */}
               <Card className="p-5 border border-gray-100 hover:border-indigo-300 transition-colors">
                  <Globe className="text-indigo-600 mb-3" />
                  <h4 className="font-bold mb-1">Study Abroad</h4>
                  <p className="text-xs text-gray-500 mb-4">Pathways to international universities.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('universities')}>Explore Options</Button>
               </Card>

               {/* 21. Fast Track */}
               <Card className="p-5 border border-gray-100 hover:border-red-300 transition-colors">
                  <Zap className="text-red-600 mb-3" />
                  <h4 className="font-bold mb-1">Fast-Track</h4>
                  <p className="text-xs text-gray-500 mb-4">Accelerated graduation pathways.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('contact-us')}>Graduate Faster</Button>
               </Card>

               {/* 22. Priority Support */}
               <Card className="p-5 border border-gray-100 hover:border-orange-300 transition-colors">
                  <Star className="text-orange-600 mb-3" />
                  <h4 className="font-bold mb-1">Priority Support</h4>
                  <p className="text-xs text-gray-500 mb-4">Dedicated assistance line.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('contact-us')}>Upgrade Support</Button>
               </Card>

               {/* 23. Premium Review */}
               <Card className="p-5 border border-gray-100 hover:border-teal-300 transition-colors">
                  <FileText className="text-teal-600 mb-3" />
                  <h4 className="font-bold mb-1">Expert Review</h4>
                  <p className="text-xs text-gray-500 mb-4">Detailed feedback on assignments.</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('contact-us')}>Get Expert Review</Button>
               </Card>
            </div>
         </div>
      </section>

      {/* 7. FUTURE-TECH & COMMUNITY */}
      <section className="py-12 md:py-20 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-50"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-center">Future-Ready Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
               {/* 15. AI Coach */}
               <div className="flex gap-4 items-start">
                  <div className="bg-blue-600/20 p-3 rounded-lg text-blue-400"><Brain size={24} /></div>
                  <div>
                     <h4 className="font-bold text-lg mb-1">AI Study Coach</h4>
                     <p className="text-sm text-gray-400 mb-3">Personalized learning plans & smart reminders.</p>
                     <button className="text-blue-400 text-sm font-bold hover:underline" onClick={() => onNavigate('dashboard')}>Activate Coach</button>
                  </div>
               </div>

               {/* 16. Analytics */}
               <div className="flex gap-4 items-start">
                  <div className="bg-purple-600/20 p-3 rounded-lg text-purple-400"><BarChart size={24} /></div>
                  <div>
                     <h4 className="font-bold text-lg mb-1">Learning Analytics</h4>
                     <p className="text-sm text-gray-400 mb-3">Deep insights into your performance & habits.</p>
                     <button className="text-purple-400 text-sm font-bold hover:underline" onClick={() => onNavigate('dashboard')}>View My Analytics</button>
                  </div>
               </div>

               {/* 18. Voice Agent */}
               <div className="flex gap-4 items-start">
                  <div className="bg-green-600/20 p-3 rounded-lg text-green-400"><Phone size={24} /></div>
                  <div>
                     <h4 className="font-bold text-lg mb-1">Voice Support Agent</h4>
                     <p className="text-sm text-gray-400 mb-3">Talk to our AI support in real-time.</p>
                     <button className="text-green-400 text-sm font-bold hover:underline" onClick={() => onNavigate('contact-us')}>Speak to Professional</button>
                  </div>
               </div>

               {/* 19. Micro-Credentials */}
               <div className="flex gap-4 items-start">
                  <div className="bg-yellow-600/20 p-3 rounded-lg text-yellow-400"><Layers size={24} /></div>
                  <div>
                     <h4 className="font-bold text-lg mb-1">Credential Builder</h4>
                     <p className="text-sm text-gray-400 mb-3">Stack workshops into degrees.</p>
                     <button className="text-yellow-400 text-sm font-bold hover:underline" onClick={() => onNavigate('library')}>Build Credentials</button>
                  </div>
               </div>

               {/* 24. Portfolio */}
               <div className="flex gap-4 items-start">
                  <div className="bg-pink-600/20 p-3 rounded-lg text-pink-400"><Folder size={24} /></div>
                  <div>
                     <h4 className="font-bold text-lg mb-1">Project Portfolio</h4>
                     <p className="text-sm text-gray-400 mb-3">Showcase your work to employers.</p>
                     <button className="text-pink-400 text-sm font-bold hover:underline" onClick={() => onNavigate('dashboard')}>Create Portfolio</button>
                  </div>
               </div>

               {/* 25. Badges */}
               <div className="flex gap-4 items-start">
                  <div className="bg-orange-600/20 p-3 rounded-lg text-orange-400"><BadgeCheck size={24} /></div>
                  <div>
                     <h4 className="font-bold text-lg mb-1">Digital Badges</h4>
                     <p className="text-sm text-gray-400 mb-3">Verifiable blockchain credentials.</p>
                     <button className="text-orange-400 text-sm font-bold hover:underline" onClick={() => onNavigate('dashboard')}>Earn Badges</button>
                  </div>
               </div>
            </div>

            {/* 20. Community */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-600">
               <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-3"><UsersIcon className="text-blue-400"/> Global Student Community</h3>
                  <p className="text-gray-300">Join forums, peer learning groups, and country-based chapters.</p>
               </div>
               <Button className="bg-white text-gray-900 hover:bg-gray-200 border-none px-8 w-full md:w-auto" onClick={() => onNavigate('contact-us')}>Join the Community</Button>
            </div>
         </div>
      </section>

      {/* --- NEW SECTIONS 26-31: ENHANCED STUDENT EXPERIENCE --- */}
      <section className="py-12 md:py-24 bg-gray-50 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Holistic Student Success Hub</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               {/* 26. Wellbeing Hub */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                     <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Success & Wellbeing</h3>
                  <p className="text-sm text-gray-500 mb-6">AI-powered coaching for academic balance and stress management.</p>
                  <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1 text-teal-600 border-teal-200 hover:bg-teal-50" onClick={() => handleSimpleAction('wellbeing')}>Check Balance</Button>
                     <Button size="sm" variant="secondary" className="flex-1" onClick={() => onNavigate('contact-us')}>Get Coaching</Button>
                  </div>
               </div>

               {/* 27. Global Mentorship */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                     <Handshake size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Alumni Mentorship</h3>
                  <p className="text-sm text-gray-500 mb-6">Connect with IMI graduates and industry leaders worldwide.</p>
                  <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => handleSimpleAction('mentor')}>Find Mentor</Button>
                     <Button size="sm" variant="secondary" className="flex-1" onClick={() => onNavigate('contact-us')}>Join Network</Button>
                  </div>
               </div>

               {/* 28. Learning Streaks */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                     <Flame size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Motivation Engine</h3>
                  <p className="text-sm text-gray-500 mb-6">Track your daily learning streaks and earn rewards.</p>
                  <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleSimpleAction('streak')}>View Streak</Button>
                     <Button size="sm" variant="secondary" className="flex-1" onClick={() => onNavigate('dashboard')}>Set Goals</Button>
                  </div>
               </div>

               {/* 29. Career Tracker */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                     <Target size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Career Outcomes</h3>
                  <p className="text-sm text-gray-500 mb-6">Map your skills to real-world job requirements.</p>
                  <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => onNavigate('dashboard')}>Readiness</Button>
                     <Button size="sm" variant="secondary" className="flex-1" onClick={() => onNavigate('contact-us')}>Match Jobs</Button>
                  </div>
               </div>

               {/* 30. Guardian View */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                     <UserPlus size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Guardian Access</h3>
                  <p className="text-sm text-gray-500 mb-6">Grant read-only progress access to parents or sponsors.</p>
                  <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50" onClick={() => handleSimpleAction('guardian')}>Invite</Button>
                     <Button size="sm" variant="secondary" className="flex-1" onClick={() => onNavigate('dashboard')}>Manage</Button>
                  </div>
               </div>

               {/* 31. Pace Controller */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-4">
                     <Gauge size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Pace Controller</h3>
                  <p className="text-sm text-gray-500 mb-6">Adjust AI content delivery speed to match your style.</p>
                  <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSimpleAction('pace', 'Standard')}>Adjust Pace</Button>
                     <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleSimpleAction('pace', 'Intensive')}>Boost Mode</Button>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 8 & 14. SUPPORT & FINAL CTA */}
      <section className="py-12 md:py-24 bg-white text-center">
         <div className="max-w-3xl mx-auto px-4">
            <HelpCircle size={48} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Need Assistance?</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
               Our student support team is here to help you navigate your educational journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
               <Button size="lg" onClick={() => onNavigate('contact-us')} className="bg-[#D62828] hover:bg-red-700 border-none rounded-full px-10">
                  Get Help Instantly
               </Button>
               <Button size="lg" variant="outline" onClick={() => onNavigate('contact-us')} className="rounded-full px-10">
                  View FAQs
               </Button>
            </div>
         </div>
      </section>

   </div>
   );
};

export default StudentsPage;
