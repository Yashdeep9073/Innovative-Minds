
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatBot } from './components/ChatBot';
import { LandingPage } from './pages/LandingPage';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { LibraryPage } from './pages/LibraryPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { WorkshopPlayer } from './pages/WorkshopPlayer';
import { StudentsPage } from './pages/StudentsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UniversityDashboard } from './pages/UniversityDashboard';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { LoginPage } from './pages/LoginPage';
import { UniversitiesPage, GovernmentsPage, InnovationHubPage, KidsPage, GovernmentDashboard } from './pages/InstitutionalPages';
import { CourseBuilder } from './pages/CourseBuilder';
import { CourseLandingPage } from './pages/CourseLandingPage';
import { PaymentPage } from './pages/PaymentPage'; 
import { EnrollmentWizard } from './pages/EnrollmentWizard';
import { CourseOrientationPage } from './pages/CourseOrientationPage'; // NEW IMPORT
import { User } from './types';
import { auth, getUserProfile, testFirebaseConnection, onAuthStateChanged } from './services/firebase';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentWorkshopId, setCurrentWorkshopId] = useState<string | undefined>(undefined);
  const [currentEnrollmentId, setCurrentEnrollmentId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState('All');

  // Initialize Firebase Auth Listener
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        // Fetch detailed profile from Firestore
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
          // Only redirect to dashboard if currently on login or landing AND not anonymous
          if (!firebaseUser.isAnonymous && (currentPage === 'login' || currentPage === 'landing')) {
             routeUserByRole(userProfile.role);
          }
        } else {
           // Fallback for new users or anonymous guests
           setUser({
             id: firebaseUser.uid,
             name: firebaseUser.isAnonymous ? 'Guest User' : (firebaseUser.displayName || 'Learner'),
             email: firebaseUser.email || '',
             role: firebaseUser.isAnonymous ? 'guest' : 'student' // Assign guest role to anonymous
           });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Run once on mount

  // SEO: Update Document Title
  useEffect(() => {
    const pageTitles: Record<string, string> = {
        'landing': 'Home - Innovative Minds Institute',
        'login': 'Login - IMI',
        'dashboard': 'My Dashboard - IMI',
        'all-workshops': 'Course Catalogue - IMI',
        'contact-us': 'Contact Support - IMI',
        'about': 'About Us - IMI',
        'library': 'Digital Library - IMI',
        'learners': 'Student Life - IMI',
        'innovation': 'Innovation Hub - IMI',
        'admin': 'Admin Portal - IMI',
        'course-landing': 'Course Details - IMI',
        'workshop-player': 'Learning Room - IMI',
        'enroll': 'Application Wizard - IMI',
        'orientation': 'Course Orientation - IMI'
    };
    
    document.title = pageTitles[currentPage] || 'Innovative Minds Institute - Future of Education';
    window.scrollTo(0, 0);
  }, [currentPage]);

  const routeUserByRole = (role: string) => {
      switch(role) {
          case 'admin': setCurrentPage('admin'); break;
          case 'university': setCurrentPage('university'); break;
          case 'partner': setCurrentPage('partner'); break;
          case 'government': setCurrentPage('government'); break;
          default: setCurrentPage('dashboard'); break;
      }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    
    // Check for login redirects
    const redirect = sessionStorage.getItem('redirect_after_login');
    if (redirect) {
        sessionStorage.removeItem('redirect_after_login');
        handleNavigate(redirect);
    } else {
        routeUserByRole(userData.role);
    }
  };

  const handleLogout = () => {
    auth.signOut(); // Trigger Firebase SignOut
    setUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    // Dynamic Route Handling
    if (page.startsWith('workshops/')) {
        const id = page.split('/')[1];
        setCurrentWorkshopId(id);
        setCurrentPage('course-landing'); 
    } else if (page.startsWith('enroll/')) {
        const id = page.split('/')[1];
        setCurrentWorkshopId(id);
        setCurrentPage('enroll'); 
    } else if (page.startsWith('player/')) {
        const id = page.split('/')[1];
        setCurrentWorkshopId(id);
        setCurrentPage('workshop-player'); 
    } else if (page.startsWith('orientation/')) {
        const id = page.split('/')[1];
        setCurrentWorkshopId(id);
        setCurrentPage('orientation');
    } else if (page.startsWith('payment/')) {
        const id = page.split('/')[1];
        setCurrentEnrollmentId(id);
        setCurrentPage('payment'); 
    } else if (page.startsWith('workshops-category/')) {
        const cat = page.split('/')[1];
        setCurrentCategory(cat);
        setCurrentPage('all-workshops');
    } else {
        setCurrentWorkshopId(undefined);
        setCurrentPage(page);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentCategory('All');
    setCurrentPage('all-workshops');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D62828]"></div>
      </div>
    );
  }

  // Render specific page content based on route
  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'dashboard':
        return user ? <LearnerDashboard user={user} onNavigate={handleNavigate} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'course-landing': 
        return <CourseLandingPage courseId={currentWorkshopId} onNavigate={handleNavigate} user={user} />;
      case 'enroll':
        return <EnrollmentWizard courseId={currentWorkshopId} onNavigate={handleNavigate} user={user} />;
      case 'orientation':
        return <CourseOrientationPage courseId={currentWorkshopId} onNavigate={handleNavigate} />;
      case 'payment':
        return currentEnrollmentId ? <PaymentPage enrollmentId={currentEnrollmentId} onNavigate={handleNavigate} /> : <div className="p-20 text-center">Invalid Payment Link</div>;
      case 'workshop-player':
        return user ? <WorkshopPlayer workshopId={currentWorkshopId} onNavigate={handleNavigate} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'all-workshops':
        return <WorkshopsPage onNavigate={handleNavigate} initialSearchTerm={searchQuery} initialCategory={currentCategory} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard onNavigate={handleNavigate} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'course-builder': 
        return (user?.role === 'admin' || user?.role === 'university') ? <CourseBuilder onNavigate={handleNavigate} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'university':
        return user?.role === 'university' ? <UniversityDashboard user={user} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'partner':
        return user?.role === 'partner' ? <PartnerDashboard user={user} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'government':
        return user?.role === 'government' ? <GovernmentDashboard user={user} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'universities':
        return <UniversitiesPage />;
      case 'governments':
        return <GovernmentsPage />;
      case 'innovation':
        return <InnovationHubPage />;
      case 'kids':
        return <KidsPage />;
      case 'learners': 
        return <StudentsPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutUsPage onNavigate={handleNavigate} />;
      case 'library':
        return <LibraryPage onNavigate={handleNavigate} />;
      case 'contact-us':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'security':
      case 'legal':
      case 'terms':
      case 'privacy':
      case 'faq':
        return (
          <div className="max-w-4xl mx-auto p-8 font-inter min-h-screen">
            <h1 className="text-3xl font-bold mb-6 capitalize">{currentPage.replace('-', ' ')}</h1>
            <div className="prose">
              <p>This platform adheres to GDPR, ISO 9001:2015, and global ed-tech data standards. Content for {currentPage} is currently being updated by the legal team.</p>
              <button onClick={() => handleNavigate('contact-us')} className="text-[#D62828] underline mt-4">Contact Support for details</button>
            </div>
          </div>
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // Kids page has its own layout, others share the main layout
  if (currentPage === 'kids') {
    return (
      <div className="relative">
        <button onClick={() => setCurrentPage('landing')} className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-full shadow font-bold">← Exit Kids Mode</button>
        <KidsPage />
      </div>
    );
  }

  // Login page has no layout
  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={handleNavigate} onSearch={handleSearch} currentPage={currentPage}>
      {renderContent()}
      <ChatBot />
    </Layout>
  );
}

export default App;
