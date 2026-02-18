
import React, { useState, useEffect } from 'react';
import { Button, Input, Logo } from '../components/UI';
import { User, UserRole } from '../types';
import { 
  loginWithEmail, registerWithEmail, logLoginAttempt, enrollUserInWorkshop, 
  auth, signInAnonymously, db, doc, setDoc, serverTimestamp 
} from '../services/firebase';
import { Eye, EyeOff, Copy, ArrowLeft, X, Shield, Check } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate?: (page: string) => void;
}

// 🔹 Default Logins for Testing (As per prompt)
const MOCK_DEFAULTS = [
  { email: "admin@imlearn.org", number: "0010", passkey: "12345", role: 'admin' as UserRole, name: "System Admin" },
  { email: "student@imlearn.org", number: "0001", passkey: "1234567", role: 'student' as UserRole, name: "Test Student" },
  { email: "uni@imlearn.org", number: "0010", passkey: "123456789", role: 'university' as UserRole, name: "CT University" },
  { email: "gov@imlearn.org", number: "00101", passkey: "12345678910", role: 'government' as UserRole, name: "Ministry of Education" }
];

export const LoginPage: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('admin@imlearn.org');
  const [studentNumber, setStudentNumber] = useState('');
  const [passkey, setPasskey] = useState('');
  
  // Registration specific state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Generate random passkey for new registrations
  useEffect(() => {
    if (isRegistering) {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setPasskey(generated);
      setStatusMsg(`Passkey Generated: ${generated}`);
    } else {
      setPasskey('');
      setStatusMsg('');
    }
  }, [isRegistering]);

  const checkPendingEnrollment = async (uid: string): Promise<{id: string, type: string} | null> => {
    // Check new persistent object first
    const pendingData = localStorage.getItem('pending_enrollment_data');
    if (pendingData) {
        const data = JSON.parse(pendingData);
        if (data.course_id) {
            setStatusMsg(`Resuming enrollment for ${data.course_title}...`);
            try {
                const enrollmentId = await enrollUserInWorkshop(uid, data.course_id);
                localStorage.removeItem('pending_enrollment_data');
                localStorage.removeItem('pending_workshop_id');
                return { id: enrollmentId, type: 'wizard' };
            } catch (e) {
                console.error("Enrollment resume error", e);
            }
        }
    }

    // Fallback Legacy Check
    const pendingWorkshopId = localStorage.getItem('pending_workshop_id');
    if (pendingWorkshopId) {
       setStatusMsg("Resuming your enrollment...");
       try {
          const enrollmentId = await enrollUserInWorkshop(uid, pendingWorkshopId);
          localStorage.removeItem('pending_workshop_id');
          return { id: enrollmentId, type: 'legacy' };
       } catch (e: any) {
          console.error("Failed to resume enrollment", e);
       }
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatusMsg('');

    try {
      const mockUser = MOCK_DEFAULTS.find(d => 
        ((d.email === email && email !== '') || (d.number === studentNumber && studentNumber !== '')) && 
        d.passkey === passkey
      );

      if (mockUser) {
        await logLoginAttempt(mockUser.email || mockUser.number, true, 'mock_default');
        setStatusMsg("Login Successful! Authenticating...");
        
        let firebaseUid = 'mock-' + mockUser.role;
        try {
           const anonCred = await signInAnonymously(auth);
           firebaseUid = anonCred.user.uid;
           await setDoc(doc(db, 'users', firebaseUid), {
               id: firebaseUid,
               name: mockUser.name,
               email: mockUser.email,
               role: mockUser.role, 
               createdAt: serverTimestamp(),
               isMock: true
           }, { merge: true });
        } catch (authErr) {
           console.warn("Anonymous auth failed, proceeding with mock ID", authErr);
        }

        const pendingResult = await checkPendingEnrollment(firebaseUid);

        setTimeout(() => {
          onLogin({
            id: firebaseUid, 
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            studentNumber: mockUser.number,
            passkey: mockUser.passkey
          });
          
          if (pendingResult && onNavigate) {
             onNavigate(`payment/${pendingResult.id}`);
          }
        }, 1000);
        return;
      }

      if (email) {
        const result = await loginWithEmail(email, passkey); 
        setStatusMsg("Verified. Checking enrollments...");
        await logLoginAttempt(email, true, 'firebase');
        const pendingResult = await checkPendingEnrollment(result.uid);
        if (pendingResult && onNavigate) {
           onNavigate(`payment/${pendingResult.id}`);
        }
      } else {
        throw new Error("Please enter Email or Student Number.");
      }

    } catch (err: any) {
      console.error(err);
      let msg = "Invalid credentials. Please try again.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') msg = "Invalid Passkey or Email.";
      if (err.code === 'auth/user-not-found') msg = "User not found.";
      setError(msg);
      await logLoginAttempt(email || studentNumber, false, 'failed_attempt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email || !passkey || !regName) {
        throw new Error("All fields are required.");
      }
      
      const newUser = await registerWithEmail(email, passkey, regName, regRole, studentNumber);
      
      setStatusMsg("Registration successful! Setting up profile...");
      await logLoginAttempt(email, true, 'registration');

      const pendingResult = await checkPendingEnrollment(newUser.uid);
      
      if (pendingResult && onNavigate) {
         onNavigate(`payment/${pendingResult.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyPasskey = () => {
    if (passkey) {
      navigator.clipboard.writeText(passkey);
      alert("Passkey copied to clipboard!");
    }
  };

  const handleBack = () => {
    if (onNavigate) onNavigate('landing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-y-auto font-inter px-4 py-8">
      {/* Background Animation */}
      <div className="fixed inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1509062522246-37559cc79276?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center animate-pulse pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-[#D62828] relative animate-in fade-in zoom-in duration-300">
          
           {/* Navigation Controls */}
           <div className="absolute top-4 left-4 z-20">
             <button 
               onClick={handleBack} 
               className="text-gray-400 hover:text-[#D62828] transition-colors p-2 rounded-full hover:bg-gray-100"
               title="Back"
             >
               <ArrowLeft size={24} />
             </button>
           </div>
           <div className="absolute top-4 right-4 z-20">
             <button 
               onClick={handleBack} 
               className="text-gray-400 hover:text-[#D62828] transition-colors p-2 rounded-full hover:bg-gray-100"
               title="Close"
             >
               <X size={24} />
             </button>
           </div>

          <div className="flex flex-col items-center mb-6 mt-4">
            <Logo />
            <h3 className="text-xl font-bold text-gray-800 mt-4 text-center">
              {isRegistering ? 'Register New Account' : 'Welcome to IMI'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Secure Access Portal</p>
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            
            {isRegistering && (
              <>
                 <Input 
                   label="Full Name"
                   placeholder="Enter full name"
                   value={regName}
                   onChange={(e) => setRegName(e.target.value)}
                   required={isRegistering}
                 />
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Role</label>
                    <select 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D62828] bg-white"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                    >
                      <option value="student">Student</option>
                      <option value="university">University</option>
                      <option value="government">Government</option>
                      <option value="partner">Partner</option>
                    </select>
                 </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <Input 
                type="email" 
                id="email"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {!isRegistering && (
              <>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Student / Employee Number</label>
                  <Input 
                    type="text" 
                    id="number"
                    placeholder="Enter your ID number" 
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passkey</label>
              <div className="relative flex items-center">
                <input 
                  type={showPasskey ? "text" : "password"} 
                  id="passkey"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D62828] focus:border-transparent font-mono"
                  placeholder="Enter your passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                  style={{ fontSize: '16px' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="bg-gray-50 hover:bg-gray-100 border-t border-b border-gray-300 px-4 py-3 transition-colors h-full flex items-center"
                  title={showPasskey ? "Hide Passkey" : "Show Passkey"}
                >
                  {showPasskey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button 
                  type="button"
                  onClick={copyPasskey}
                  className="bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl px-4 py-3 transition-colors h-full flex items-center"
                  title="Copy Passkey"
                >
                  <Copy size={20} />
                </button>
              </div>
              {isRegistering && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Shield size={12} />
                  Please save this passkey securely.
                </p>
              )}
            </div>

            {/* Status & Error Messages */}
            {statusMsg && <div className="text-green-600 text-sm font-bold text-center bg-green-50 p-3 rounded-lg animate-pulse">{statusMsg}</div>}
            {error && <div className="text-red-600 text-sm font-bold text-center bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2"><Shield size={16}/> {error}</div>}

            {isRegistering ? (
              <div className="space-y-3 pt-4">
                <Button type="submit" className="w-full font-bold" size="lg" isLoading={isLoading}>COMPLETE REGISTRATION</Button>
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(false)} 
                  className="w-full text-gray-500 hover:text-gray-900 text-sm underline py-2"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <Button type="submit" id="loginBtn" className="w-full font-bold tracking-wide" size="lg" isLoading={isLoading}>ENTER PORTAL</Button>
                <button 
                  type="button" 
                  id="registerBtn"
                  onClick={() => setIsRegistering(true)} 
                  className="w-full py-3 text-[#D62828] font-bold border-2 border-[#D62828] rounded-xl hover:bg-red-50 transition-colors text-sm"
                >
                  REGISTER NEW ACCOUNT
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-4 opacity-60">
             <span className="text-xs flex items-center gap-1"><Shield size={12}/> 256-bit SSL Secured</span>
             <span className="text-xs flex items-center gap-1"><Check size={12}/> IMI Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
