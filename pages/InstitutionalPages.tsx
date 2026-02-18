
import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Modal, FileUpload } from '../components/UI';
import { 
  Check, Sun, Zap, User, Building2, GraduationCap, ShieldCheck, FileText, Upload,
  Rocket, Brain, Globe, Cpu, Users, Award, Lightbulb, TrendingUp, Monitor, Code, Target, ArrowRight,
  Trophy, Leaf, Heart
} from 'lucide-react';
import { ASSETS } from '../constants';
import { auth, uploadSecureFile } from '../services/firebase';
import { User as UserType } from '../types';

// --- GOVERNMENT DASHBOARD (SECURED) ---
export const GovernmentDashboard: React.FC<{ user: UserType }> = ({ user }) => {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    if (!docFile) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
      await uploadSecureFile(
        docFile, 
        'government_compliance', 
        { userId: user.id, role: user.role, formName: 'audit_doc' },
        setProgress
      );
      setUploadSuccess(true);
      setDocFile(null);
    } catch (e) {
      alert("Upload failed.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-yellow-900 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center">
             <div>
               <h1 className="text-3xl font-bold flex items-center gap-2">
                 <ShieldCheck size={32} className="text-yellow-400" /> Government Portal
               </h1>
               <p className="text-yellow-200">Secure Audit & Compliance Access</p>
             </div>
             <div className="text-right text-sm">
               <p className="font-bold">{user.name}</p>
               <p className="opacity-70">Ministry of Education / Regulator</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="p-8">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Upload className="text-yellow-600" /> Secure Document Upload
               </h3>
               <div className="space-y-4">
                 <p className="text-sm text-gray-500">Upload regulatory frameworks, audit requests, or compliance certificates.</p>
                 {uploadSuccess && (
                   <div className="bg-green-50 text-green-700 p-3 rounded text-sm flex items-center gap-2">
                     <Check size={16}/> Document Encrypted & Stored Successfully.
                   </div>
                 )}
                 <FileUpload 
                   label="Select Document (Encrypted)"
                   onFileSelect={setDocFile}
                   uploading={uploading}
                   progress={progress}
                 />
                 <Button className="w-full bg-yellow-700 hover:bg-yellow-800" onClick={handleUpload} disabled={!docFile || uploading}>
                   {uploading ? 'Encrypting & Uploading...' : 'Submit Document'}
                 </Button>
               </div>
             </Card>

             <Card className="p-8">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <FileText className="text-blue-600" /> System Audit Log
               </h3>
               <div className="space-y-4 text-sm text-gray-600">
                 <div className="flex justify-between border-b pb-2">
                   <span>User Registrations (Last 24h)</span>
                   <span className="font-mono font-bold">145</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                   <span>Active Course Modules</span>
                   <span className="font-mono font-bold">892</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                   <span>Data Privacy Check</span>
                   <span className="font-mono font-bold text-green-600">PASSED</span>
                 </div>
               </div>
               <Button variant="outline" className="w-full mt-4">Generate Compliance Report</Button>
             </Card>
          </div>
       </div>
    </div>
  );
};

// --- SHARED FORM COMPONENT ---
const PartnershipForm: React.FC<{ type: string }> = ({ type }) => {
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
      const unsub = auth.onAuthStateChanged(u => setCurrentUser(u));
      return () => unsub();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && file) {
      alert("Please login to upload verification documents.");
      return;
    }

    setUploading(true);
    try {
      if (file && currentUser) {
        // Upload secure file
        await uploadSecureFile(
          file, 
          'application', 
          { userId: currentUser.uid, formName: `${type}_partnership`.toLowerCase() },
          setProgress
        );
      }
      setTimeout(() => {
        setSubmitted(true);
        setUploading(false);
      }, 1000);
    } catch (e) {
      console.error(e);
      alert("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-xl">
         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
           <Check size={32} />
         </div>
         <h3 className="text-xl font-bold text-green-800">Application Submitted!</h3>
         <p className="text-green-600 mt-2">We have received your {type} partnership request. A confirmation email has been sent to <strong>zambiansinindia@gmail.com</strong>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label={`${type} Name`} required />
      <Input label="Country" required />
      <Input label="Contact Person (Dean/Official)" required />
      <Input label="Email Address" type="email" required />
      
      {currentUser ? (
        <FileUpload 
           label="Official Verification Document (PDF)"
           accept=".pdf,.doc,.docx"
           onFileSelect={setFile}
           uploading={uploading}
           progress={progress}
        />
      ) : (
        <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
           Please <a href="#" className="font-bold underline">Login</a> to attach verification documents.
        </div>
      )}

      <div className="flex items-center gap-2">
        <input type="checkbox" id="waiver" className="rounded text-red-600 focus:ring-red-500" />
        <label htmlFor="waiver" className="text-sm text-gray-700">Request Fee Waiver (Standard Fee: $1000)</label>
      </div>
      <Button type="submit" className="w-full" isLoading={uploading}>Submit Application</Button>
    </form>
  );
};

// --- UNIVERSITIES PAGE ---
export const UniversitiesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white">
      <div className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{backgroundImage: `url(${ASSETS.graduate})`}}></div>
        <div className="relative z-10">
          <GraduationCap className="mx-auto text-[#D62828] mb-4" size={48} />
          <h1 className="text-4xl font-bold mb-4">Empower Your Faculty & Students</h1>
          <p className="max-w-2xl mx-auto text-gray-300">Join the IMI Global Network of universities. Access cutting-edge AI curriculum, faculty development, and joint research opportunities.</p>
          <Button className="mt-8" onClick={() => setShowForm(true)}>Become a Partner University</Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Partnership Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map((i) => (
             <Card key={i} className="p-6 hover:shadow-lg transition-all border border-gray-100">
               <h3 className="text-xl font-bold mb-3">Service Module {i}</h3>
               <p className="text-gray-600 text-sm mb-4">Comprehensive faculty training in digital pedagogy and AI integration. Access to IMI's global research database.</p>
               <ul className="text-sm space-y-2 mb-6">
                 <li className="flex gap-2"><Check size={16} className="text-green-500" /> Accreditation Support</li>
                 <li className="flex gap-2"><Check size={16} className="text-green-500" /> Student Exchange</li>
                 <li className="flex gap-2"><Check size={16} className="text-green-500" /> Joint Certification</li>
               </ul>
               <Button variant="outline" size="sm" className="w-full" onClick={() => setShowForm(true)}>Register Interest</Button>
             </Card>
           ))}
        </div>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="University Partnership Application">
        <PartnershipForm type="University" />
      </Modal>
    </div>
  );
};

// --- GOVERNMENTS PAGE ---
export const GovernmentsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white">
      <div className="bg-blue-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{backgroundImage: `url(${ASSETS.gov})`}}></div>
        <div className="relative z-10">
          <Building2 className="mx-auto text-blue-300 mb-4" size={48} />
          <h1 className="text-4xl font-bold mb-4">Digital Transformation for Nations</h1>
          <p className="max-w-2xl mx-auto text-blue-100">Upskill civil servants and modernize national education infrastructure with IMI.</p>
          <Button className="mt-8 bg-white text-blue-900 hover:bg-gray-100" onClick={() => setShowForm(true)}>Partner Now</Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Government Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {['Civil Service Digital Literacy', 'National AI Strategy', 'Green Energy Infrastructure', 'Rural Education Access'].map((prog, i) => (
             <div key={i} className="flex gap-4 p-6 border rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
               <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors rounded-lg flex items-center justify-center text-blue-700 font-bold text-xl">{i+1}</div>
               <div>
                 <h3 className="text-xl font-bold mb-2">{prog}</h3>
                 <p className="text-gray-600 text-sm">Strategic implementation frameworks tailored for national scale impact. Includes policy advisory and technical training.</p>
               </div>
             </div>
           ))}
        </div>
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Government Partnership Application">
        <PartnershipForm type="Government" />
      </Modal>
    </div>
  );
};

// --- INNOVATION HUB PAGE ---
export const InnovationHubPage: React.FC = () => {
  return (
    <div className="bg-black text-white font-inter overflow-x-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="https://videos.pexels.com/video-files/8538902/8538902-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-block px-4 py-1 mb-6 border border-green-500/50 rounded-full bg-green-500/10 backdrop-blur-md">
            <span className="text-green-400 font-mono text-sm tracking-widest uppercase">Where Ideas Ignite the Future</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            IM Innovation Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Welcome to the beating heart of Innovative Minds Institute. Here, vision meets technology and students transform ideas into real-world impact. We bring together engineers, designers, researchers, and dreamers to co-create the next generation of global solutions.
          </p>
          <button className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <span className="relative z-10 flex items-center gap-2">Join the Revolution <ArrowRight className="group-hover:translate-x-1 transition-transform"/></span>
          </button>
        </div>
      </section>

      {/* SECTION 2: MISSION */}
      <section className="py-24 px-4 bg-gray-900 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform shadow-2xl shadow-blue-500/20">
              <Rocket size={40} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-2xl text-gray-400 font-light leading-relaxed">
            “To cultivate a world-class environment where imagination meets implementation. The IM Innovation Hub empowers learners and professionals to prototype, test, and launch ideas that redefine industries — from AI and robotics to sustainable farming and social innovation.”
          </p>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES */}
      <section className="py-24 px-4 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Key Features at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "AI & Robotics Lab", desc: "Prototyping & Machine Learning" },
              { icon: Lightbulb, title: "Startup Incubator", desc: "From Idea to Enterprise" },
              { icon: Globe, title: "Digital Residency", desc: "For Global Entrepreneurs" },
              { icon: Trophy, title: "Innovation Arena", desc: "Hackathons & Challenges" },
              { icon: Leaf, title: "GreenTech Testbeds", desc: "Sustainable Solutions" },
              { icon: Heart, title: "Social Impact Studio", desc: "Community Driven Design" },
              { icon: Users, title: "Investor Network", desc: "Mentorship & Funding" },
              { icon: Monitor, title: "Virtual Classroom", desc: "Immersive Learning" }
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 transition-all hover:border-blue-500/50 hover:-translate-y-2">
                <f.icon className="text-blue-500 mb-4 group-hover:text-white transition-colors" size={32} />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: COLLABORATION ZONES */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80" 
                alt="Collaboration" 
                className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px] grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-6 text-white">Open Collaboration Zones</h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Inspired by the MIT Media Lab, these creative pods encourage cross-disciplinary teamwork. Students, developers, and industry experts co-design AI, VR, and IoT solutions — live and in-motion. It's not just a workspace; it's a collision space for brilliance.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm border border-gray-700">VR/AR Stations</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm border border-gray-700">IoT Benches</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm border border-gray-700">Focus Pods</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AI & ROBOTICS LAB */}
      <section className="py-24 px-4 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
              <Cpu className="text-green-500 animate-pulse" /> AI & Robotics Prototyping Lab
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Experiment with next-generation technologies in a hands-on environment. From coding machine-learning models to building robotic prototypes, students learn through creation.
            </p>
            <ul className="space-y-4 mb-8">
              {['3D Printing Farms', 'Drone Testing Cage', 'Neural Network Servers', 'Biotech Sensors'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div> {item}
                </li>
              ))}
            </ul>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors">Request Lab Access</button>
          </div>
          <div className="relative group perspective-1000">
             <div className="relative transform group-hover:rotate-y-12 transition-transform duration-700 ease-out preserve-3d">
                <div className="absolute inset-0 border-2 border-green-500/30 rounded-2xl transform translate-x-4 translate-y-4"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581092795360-5c9afc0e6f13?auto=format&fit=crop&w=1200&q=80" 
                  alt="Robotics Lab" 
                  className="rounded-2xl shadow-2xl relative z-10 w-full"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur px-6 py-3 rounded-full border border-green-500 flex items-center gap-2 cursor-pointer hover:bg-black transition-colors z-20">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                   <span className="font-mono text-green-400 text-sm">LIVE 3D TOUR</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: ACCELERATOR */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <TrendingUp size={64} className="mx-auto text-yellow-500 mb-8" />
          <h2 className="text-5xl font-bold mb-6">The IM Startup Accelerator</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Modeled after Silicon Valley’s mentoring system and Oxford Foundry’s social impact vision, IM’s accelerator connects young innovators to global investors, mentors, and venture labs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
               <h3 className="font-bold text-xl mb-2 text-white">Incubation</h3>
               <p className="text-sm text-gray-400">6-month intensive program for early-stage ideas.</p>
             </div>
             <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
               <h3 className="font-bold text-xl mb-2 text-white">Seed Funding</h3>
               <p className="text-sm text-gray-400">Access to micro-grants and investor networks.</p>
             </div>
             <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
               <h3 className="font-bold text-xl mb-2 text-white">Mentorship</h3>
               <p className="text-sm text-gray-400">1-on-1 guidance from industry veterans.</p>
             </div>
          </div>
          <button className="px-10 py-4 bg-yellow-500 text-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            Pitch Your Startup
          </button>
        </div>
      </section>

      {/* SECTION 7: CHALLENGES */}
      <section className="py-24 px-4 bg-black relative border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
             <Target className="text-red-500" /> Future-Tech Challenges
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 hover:border-red-500 transition-colors cursor-pointer">
                 <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">LIVE NOW</div>
                 <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">AI for Good Hackathon</h3>
                    <p className="text-gray-400 mb-6">Build AI solutions that solve pressing community health or education problems.</p>
                    <div className="flex justify-between items-end">
                       <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prize Pool</div>
                          <div className="text-3xl font-bold text-white">$10,000</div>
                       </div>
                       <ArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                 </div>
                 <div className="bg-red-500/10 h-2 w-full">
                    <div className="bg-red-500 h-full w-3/4"></div>
                 </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 hover:border-green-500 transition-colors cursor-pointer">
                 <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">STARTING SOON</div>
                 <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Smart AgriTech Sprint</h3>
                    <p className="text-gray-400 mb-6">Design IoT sensors for soil monitoring and automated irrigation systems.</p>
                    <div className="flex justify-between items-end">
                       <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prize Pool</div>
                          <div className="text-3xl font-bold text-white">$5,000 + Incubation</div>
                       </div>
                       <ArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                 </div>
                 <div className="bg-green-500/10 h-2 w-full">
                    <div className="bg-green-500 h-full w-1/4"></div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

// --- KIDS PAGE ---
export const KidsPage: React.FC = () => {
  return (
    <div className="bg-[#FFD700] min-h-screen font-poppins relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <header className="flex justify-between items-center mb-12">
           <div className="text-4xl font-black text-black tracking-tighter">IMI <span className="text-white text-stroke">KIDS</span></div>
           <Button className="bg-black text-white hover:bg-gray-800 rounded-full shadow-xl">Parents Dashboard</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
             <h1 className="text-5xl md:text-6xl font-black mb-6 text-black leading-tight">
               Learn to Code.<br/>Build Robots.<br/>Have Fun!
             </h1>
             <p className="text-xl font-bold text-black/70 mb-8">Join thousands of kids learning the skills of the future.</p>
             <div className="flex gap-4">
               <button className="bg-white text-black px-8 py-4 rounded-full font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all border-4 border-black">Start Playing</button>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             {['🚀 Coding', '🤖 Robotics', '🎨 Art', '🔒 Safety'].map((item, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                 <div className="text-2xl font-black">{item}</div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
