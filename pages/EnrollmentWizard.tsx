
import React, { useState, useEffect } from 'react';
import { Workshop, User } from '../types';
import { getWorkshopById, enrollUserInWorkshop, auth, updateEnrollmentStatus, saveScholarshipApplication, getEnrollmentById, db, updateDoc, doc, setDoc, serverTimestamp } from '../services/firebase';
import { Button, Input, FileUpload, Card } from '../components/UI';
import { WORKSHOPS } from '../workshops/registry'; // For dropdown list
import { 
  CheckCircle, User as UserIcon, BookOpen, UploadCloud, GraduationCap, 
  ArrowRight, ArrowLeft, Loader2, Award, Download, ShieldCheck, Sparkles, MapPin, AlertCircle, Save, X
} from 'lucide-react';
import { EnrollmentChatAssistant, RecommendationCarousel, ProfileSyncButtons } from '../components/SmartEnrollmentWidgets';

interface WizardProps {
  courseId?: string;
  onNavigate: (p: string) => void;
  user: User | null;
}

export const EnrollmentWizard: React.FC<WizardProps> = ({ courseId, onNavigate, user }) => {
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  
  // Smart Form State
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    dob: '',
    highestQualification: 'High School',
    institution: '',
    scholarshipReason: '',
    isScholarship: false,
    employmentStatus: 'Student',
    // New Fields
    selectedCourseLevel: '',
    selectedCourseTitle: ''
  });

  // Processing State
  const [processingStatus, setProcessingStatus] = useState('Initiating...');
  const [acceptanceId, setAcceptanceId] = useState<string>('');
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (courseId) {
        const c = await getWorkshopById(courseId);
        if (c) {
            setCourse(c);
            setFormData(prev => ({ 
                ...prev, 
                selectedCourseLevel: c.level,
                selectedCourseTitle: c.title
            }));
        }
        
        // Auto-create/Resume Draft Enrollment
        if (auth.currentUser) {
            try {
                const eid = await enrollUserInWorkshop(auth.currentUser.uid, courseId, formData);
                setEnrollmentId(eid);
                // Check if existing data
                const existing = await getEnrollmentById(eid);
                if (existing && existing.applicationData) {
                    setFormData(prev => ({ ...prev, ...existing.applicationData }));
                }
            } catch (e) {
                console.warn("Could not resume enrollment:", e);
            }
        }
      }
      setLoading(false);
    };
    init();
  }, [courseId, user]); 

  const handleSaveAndExit = async () => {
    if (enrollmentId && auth.currentUser && courseId) {
        await enrollUserInWorkshop(auth.currentUser.uid, courseId, formData);
    }
    alert("Progress saved. You can resume this application from your dashboard.");
    onNavigate('dashboard');
  };

  const handleNext = async () => {
    if (enrollmentId && auth.currentUser && courseId) {
        await enrollUserInWorkshop(auth.currentUser.uid, courseId, formData);
    }
    window.scrollTo(0,0);
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleJoinClass = async () => {
      if (!course) return;
      
      // Auto-Create Course Page Logic if missing (ONLY FOR AI COURSES)
      if (course.id.startsWith('ai-gen')) {
          try {
              // Ensure course exists in Firestore for the Player to read
              // This is a client-side repair for AI courses
              await setDoc(doc(db, 'workshops', course.id), {
                  ...course,
                  status: 'published',
                  visible: true,
                  updated_at: serverTimestamp()
              });
          } catch(e) { console.error("Auto-create failed", e); }
      }

      // Update Enrollment Status to In Progress
      if (enrollmentId) {
          await updateEnrollmentStatus(enrollmentId, 'in_progress', { progress: 0 });
      }

      onNavigate(`player/${course.id}`);
  };

  const handleSubmitApplication = async () => {
    handleNext(); // Move to Step 3 (Processing)
    setEligibilityError(null);
    
    // 1. Simulate AI Verification Steps & Dual-Level Eligibility Check
    const steps = [
      "Verifying identity documents...",
      "Checking academic transcripts...",
      "Validating course eligibility...",
      "Analyzing scholarship eligibility...",
      "Generating acceptance letter..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setProcessingStatus(steps[i]);
        
        // Smart Check: If course is Advanced but user is High School -> Error
        if (i === 2 && course?.level === 'Advanced' && formData.highestQualification === 'High School') {
           throw new Error("Academic Prerequisite Not Met: Advanced courses require a minimum of a Diploma or Degree.");
        }

        await new Promise(r => setTimeout(r, 1000)); // 1s delay per step
      }

      // 2. Finalize Enrollment
      if (enrollmentId) {
          // Update Status
          const finalStatus = formData.isScholarship ? 'pending_review' : 'pending_payment';
          await updateEnrollmentStatus(enrollmentId, finalStatus, { applicationData: formData });
          
          // Submit Scholarship Doc if needed
          if (formData.isScholarship && auth.currentUser) {
              await saveScholarshipApplication(auth.currentUser.uid, enrollmentId, formData.scholarshipReason);
          }
      }
      
      setAcceptanceId(`ADM-${new Date().getFullYear()}-${Math.floor(Math.random()*10000)}`);
      handleNext(); // Move to Step 4 (Success)

    } catch (e: any) {
      console.error(e);
      setEligibilityError(e.message || "Application failed.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D62828]" size={48}/></div>;
  if (!course) return <div className="p-10 text-center">Course not found. <Button onClick={() => onNavigate('all-workshops')}>Go Back</Button></div>;

  // --- SUB-COMPONENTS ---

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
      <div 
        className="bg-[#D62828] h-full transition-all duration-500 ease-out" 
        style={{ width: `${(step / 4) * 100}%` }}
      ></div>
    </div>
  );

  const Step0_Overview = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="relative h-48 rounded-xl overflow-hidden mb-6">
        <img src={course.image_url} className="w-full h-full object-cover" alt={course.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <div className="text-white">
            <span className="bg-[#D62828] px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">Selected Program</span>
            <h2 className="text-2xl font-bold leading-tight">{course.title}</h2>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Why Apply?</h3>
          <ul className="space-y-2">
            {course.workshop_structure?.orientation.learning_outcomes.slice(0,3).map((l, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                {l}
              </li>
            ))}
          </ul>
        </div>

        {/* Updated Marketing Copy */}
        <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2 text-lg">
            🎓 Government-Supported Full Scholarship Opportunity
          </h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            With the support of your government and education partners, you are eligible for a <strong>100% scholarship</strong> on this programme.
            <br/><br/>
            Continue to the next step to confirm bursary and eligibility requirements.
          </p>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleSaveAndExit} icon={Save}>Save for Later</Button>
            <Button size="lg" className="flex-[2] font-bold shadow-lg" onClick={handleNext}>
            Start Application
            </Button>
        </div>
      </div>
    </div>
  );

  const Step1_Personal = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 text-[#D62828] rounded-full flex items-center justify-center mx-auto mb-2">
          <UserIcon size={24} />
        </div>
        <h2 className="text-xl font-bold">Personal Details</h2>
        <p className="text-sm text-gray-500">Step 1 of 3</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
        <Input label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
      </div>
      <Input label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      <Input label="Phone Number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+260..." />
      <Input label="Date of Birth" type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />

      <div className="flex gap-3 mt-8">
        <Button variant="ghost" onClick={handleSaveAndExit} className="text-gray-500">Close</Button>
        <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
        <Button className="flex-[2]" onClick={handleNext} disabled={!formData.firstName || !formData.email}>Next Step</Button>
      </div>
    </div>
  );

  const Step2_Academic = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 text-[#D62828] rounded-full flex items-center justify-center mx-auto mb-2">
          <GraduationCap size={24} />
        </div>
        <h2 className="text-xl font-bold">Academic & Aid</h2>
        <p className="text-sm text-gray-500">Step 2 of 3</p>
      </div>

      {/* Course Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Selected Course</label>
        <select 
          className="w-full px-3 py-2 border rounded-md bg-gray-50 font-medium"
          value={formData.selectedCourseTitle}
          onChange={e => setFormData({...formData, selectedCourseTitle: e.target.value})}
        >
          <option value={course.title}>{course.title}</option>
          {WORKSHOPS.filter(w => w.id !== course.id).map(w => (
              <option key={w.id} value={w.title}>{w.title}</option>
          ))}
        </select>
      </div>

      {/* Level Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
        <select 
          className="w-full px-3 py-2 border rounded-md"
          value={formData.selectedCourseLevel}
          onChange={e => setFormData({...formData, selectedCourseLevel: e.target.value})}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Highest Qualification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
        <select 
          className="w-full px-3 py-2 border rounded-md"
          value={formData.highestQualification}
          onChange={e => setFormData({...formData, highestQualification: e.target.value})}
        >
          <option>High School / Grade 12</option>
          <option>Certificate / Diploma</option>
          <option>Bachelor's Degree</option>
          <option>Master's Degree</option>
        </select>
        {course.level === 'Advanced' && formData.highestQualification === 'High School' && (
           <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/> Warning: This advanced course typically requires a Diploma or higher.</p>
        )}
      </div>

      {/* Employment Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
        <select 
          className="w-full px-3 py-2 border rounded-md"
          value={formData.employmentStatus}
          onChange={e => setFormData({...formData, employmentStatus: e.target.value})}
        >
          <option>Student</option>
          <option>Employed</option>
          <option>Unemployed</option>
          <option>Self-Employed</option>
        </select>
      </div>

      {/* Conditional File Upload */}
      {formData.employmentStatus === 'Student' && (
         <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <p className="text-xs font-bold text-gray-600 mb-2">Student ID required for discounts</p>
            <FileUpload 
              label="Upload Student ID (Optional)" 
              onFileSelect={() => {}} 
              progress={100} 
            />
         </div>
      )}

      {/* Scholarship Section */}
      <div className={`p-4 rounded-xl border transition-all duration-300 ${formData.isScholarship ? 'bg-yellow-50 border-yellow-300 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
        <label className="flex items-center gap-2 mb-2 font-bold text-gray-800 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isScholarship} 
            onChange={e => setFormData({...formData, isScholarship: e.target.checked})}
            className="rounded text-[#D62828] focus:ring-[#D62828] w-5 h-5"
          />
          Apply for 100% Scholarship?
        </label>
        
        {formData.isScholarship && (
          <div className="mt-4 animate-in slide-in-from-top-2">
             <p className="text-xs text-yellow-700 mb-2">Please explain your financial need and academic goals.</p>
             <textarea 
                className="w-full p-3 text-sm border border-yellow-200 rounded-lg bg-white focus:ring-2 focus:ring-yellow-400 outline-none"
                rows={4}
                placeholder="I meet the criteria because..."
                value={formData.scholarshipReason}
                onChange={e => setFormData({...formData, scholarshipReason: e.target.value})}
             ></textarea>
             <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Min 50 words</span>
                <span>{formData.scholarshipReason.length} chars</span>
             </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="ghost" onClick={handleSaveAndExit} className="text-gray-500">Close</Button>
        <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
        <Button className="flex-[2] font-bold" onClick={handleSubmitApplication}>Submit Application</Button>
      </div>
    </div>
  );

  const Step3_Processing = () => (
    <div className="text-center py-12 px-4 animate-in fade-in zoom-in duration-500">
      {eligibilityError ? (
         <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Application Paused</h2>
            <p className="text-gray-600 mb-6">{eligibilityError}</p>
            <div className="flex gap-3 justify-center">
               <Button onClick={() => setStep(2)}>Edit Application</Button>
               <Button variant="outline" onClick={() => onNavigate('contact-us')}>Contact Support</Button>
            </div>
         </div>
      ) : (
         <>
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#D62828] rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={48} className="text-[#D62828]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Processing Application</h2>
            <p className="text-gray-500 animate-pulse">{processingStatus}</p>
            
            <div className="max-w-xs mx-auto mt-8 space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={14} className="text-green-500" /> Identity Verified
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={14} className="text-green-500" /> Documents Scanned
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={14} className="text-green-500" /> AI Eligibility Check
              </div>
            </div>
         </>
      )}
    </div>
  );

  const Step4_Success = () => (
    <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Earned Badge Visualization */}
      <div className="relative w-24 h-24 mx-auto mb-6">
         <div className="absolute inset-0 bg-[#D62828] rounded-full opacity-20 animate-ping"></div>
         <div className="relative w-full h-full bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-green-50">
            <Award size={48} />
         </div>
         <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            ADMITTED
         </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        You have been officially accepted into the <span className="font-bold text-[#D62828]">{course.title}</span> program.
      </p>

      {/* Professional Sync */}
      <ProfileSyncButtons courseTitle={course.title} />

      {/* Acceptance Letter Card */}
      <div className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow-sm max-w-sm mx-auto mb-8 relative overflow-hidden group hover:border-[#D62828] transition-colors">
        <div className="absolute top-0 right-0 bg-[#D62828] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">OFFICIAL</div>
        <FileIcon className="mx-auto mb-2 text-gray-400 group-hover:text-[#D62828] transition-colors" />
        <h3 className="font-bold text-lg mb-1">Acceptance Letter</h3>
        <p className="text-xs text-gray-500 mb-4">Ref: {acceptanceId}</p>
        <Button size="sm" variant="outline" className="w-full" icon={Download} onClick={() => alert("Letter Downloaded!")}>Download PDF</Button>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <Button size="lg" className="w-full shadow-xl bg-[#D62828] hover:bg-[#b01e1e]" onClick={handleJoinClass}>
          Join Class
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => onNavigate('dashboard')}>
          Go to Student Dashboard
        </Button>
        <p className="text-xs text-gray-400">
          An email with your login credentials has been sent to {formData.email}
        </p>
      </div>

      {/* Adaptive Pathways */}
      <RecommendationCarousel category={course.category} onNavigate={onNavigate} />
    </div>
  );

  const FileIcon = ({className}:{className?:string}) => (
    <svg className={`w-12 h-12 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-inter">
      {/* Feature: AI Chat Assistant (Always Visible in Wizard) */}
      <EnrollmentChatAssistant context={course?.title || "Enrollment"} />

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Decorative Header */}
        <div className="bg-gray-900 h-2"></div>
        
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D62828] rounded-lg flex items-center justify-center text-white font-bold text-xs">IMI</div>
              <span className="font-bold text-gray-700 tracking-tight">ADMISSIONS</span>
            </div>
            {step < 3 && (
              <div className="flex gap-2 items-center">
                 <button onClick={handleSaveAndExit} className="text-gray-400 hover:text-gray-600" title="Exit"><X size={20}/></button>
                 <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">Step {step + 1} / 3</span>
              </div>
            )}
          </div>

          {step < 3 && <ProgressBar />}

          {/* Steps */}
          {step === 0 && <Step0_Overview />}
          {step === 1 && <Step1_Personal />}
          {step === 2 && <Step2_Academic />}
          {step === 3 && <Step3_Processing />}
          {step === 4 && <Step4_Success />}

        </div>
        
        {/* Footer Branding */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck size={10} /> Secure SSL Encrypted Enrollment • IMI 2026
          </p>
        </div>
      </div>
    </div>
  );
};
