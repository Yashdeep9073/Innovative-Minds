
import React, { useState } from 'react';
import { Logo, Button } from './UI';
import { Menu, X, Globe, Lock, ShieldCheck, User as UserIcon, LogOut, CheckCircle, Search, Facebook, Twitter, Linkedin, Instagram, Phone, Mail, GraduationCap } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentPage: string;
}

// WhatsApp Brand Icon SVG
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.472 14.382C17.11 14.196 15.333 13.3 15 13.159C14.667 13.018 14.423 12.948 14.179 13.341C13.935 13.734 13.242 14.582 13.033 14.819C12.823 15.056 12.613 15.087 12.251 14.897C11.889 14.707 10.723 14.312 9.341 13.045C8.257 12.051 7.525 10.823 7.315 10.453C7.105 10.083 7.293 9.882 7.474 9.696C7.636 9.53 7.834 9.263 8.015 9.043C8.196 8.823 8.257 8.665 8.378 8.413C8.499 8.161 8.438 7.94 8.347 7.751C8.256 7.562 7.563 5.799 7.276 5.083C6.995 4.386 6.711 4.481 6.509 4.471C6.319 4.461 6.102 4.461 5.885 4.461C5.668 4.461 5.313 4.544 5.016 4.876C4.719 5.208 3.88 6.012 3.88 7.649C3.88 9.286 5.037 10.908 5.2 11.137C5.363 11.366 7.509 14.792 10.795 16.273C11.577 16.626 12.187 16.837 12.667 16.994C13.433 17.244 14.135 17.208 14.693 17.121C15.313 17.024 16.602 16.313 16.87 15.533C17.138 14.753 17.138 14.092 17.065 13.965C16.992 13.838 16.8 13.765 16.438 13.575H17.472ZM12.037 22.001C10.237 22.001 8.556 21.521 7.085 20.672L6.732 20.457L2.91 21.48L3.957 17.657L3.725 17.276C2.793 15.753 2.302 13.976 2.302 12.146C2.302 6.712 6.669 2.279 12.037 2.279C14.639 2.279 17.086 3.315 18.924 5.195C20.762 7.075 21.774 9.575 21.774 12.146C21.774 17.58 17.407 22.001 12.037 22.001Z" />
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, onSearch, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const NavItem = ({ page, label }: { page: string; label: string }) => (
    <button
      onClick={() => { onNavigate(page); setIsMobileMenuOpen(false); }}
      className={`px-4 py-3 text-base font-medium transition-colors rounded-lg text-left ${
        currentPage === page ? 'text-[#D62828] bg-red-50' : 'text-gray-700 hover:text-[#D62828] hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    onSearch(searchQuery);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#D62828] text-white px-4 py-2 rounded z-50">
        Skip to Main Content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
              <Logo />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              <button onClick={() => onNavigate('landing')} className={`px-3 py-2 text-sm font-medium transition-colors ${currentPage === 'landing' ? 'text-[#D62828]' : 'text-gray-600 hover:text-[#D62828]'}`}>Home</button>
              <button onClick={() => onNavigate('about')} className={`px-3 py-2 text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-[#D62828]' : 'text-gray-600 hover:text-[#D62828]'}`}>About</button>
              <button onClick={() => onNavigate('learners')} className={`px-3 py-2 text-sm font-medium transition-colors ${currentPage === 'learners' ? 'text-[#D62828]' : 'text-gray-600 hover:text-[#D62828]'}`}>Students</button>
              <button onClick={() => onNavigate('library')} className={`px-3 py-2 text-sm font-medium transition-colors ${currentPage === 'library' ? 'text-[#D62828]' : 'text-gray-600 hover:text-[#D62828]'}`}>Library</button>
              <button onClick={() => onNavigate('innovation')} className={`px-3 py-2 text-sm font-medium transition-colors ${currentPage === 'innovation' ? 'text-[#D62828]' : 'text-gray-600 hover:text-[#D62828]'}`}>Innovation</button>
              <button onClick={() => onNavigate('contact-us')} className={`px-3 py-2 text-sm font-medium transition-colors ${currentPage === 'contact-us' ? 'text-[#D62828]' : 'text-gray-600 hover:text-[#D62828]'}`}>Contact Us</button>
            </nav>

            {/* Right Side Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {/* WhatsApp Header Icon */}
              <a 
                href="https://api.whatsapp.com/send?phone=15817019840&text=76MD4T" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" 
                title="WhatsApp Support"
                aria-label="Contact support on WhatsApp"
              >
                <WhatsAppIcon size={22} />
              </a>

              {/* Expandable Search */}
              <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#D62828]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      aria-label="Search"
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600" aria-label="Close search">
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-600 hover:text-[#D62828] transition-colors" aria-label="Open search">
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">Hi, {user.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Verified</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'dashboard')}>
                    Dashboard
                  </Button>
                  <button onClick={onLogout} className="text-gray-400 hover:text-[#D62828] transition-colors" title="Logout" aria-label="Log out">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={() => onNavigate('login')}>
                  Login Portal
                </Button>
              )}
            </div>

            {/* Mobile Actions & Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="p-2 text-gray-600 active:bg-gray-100 rounded-full" 
                aria-label="Toggle mobile search"
              >
                <Search size={24} />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 text-gray-600 active:bg-gray-100 rounded-full" 
                aria-label="Toggle main menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Search Bar (Collapsible) */}
          {isSearchOpen && (
             <div className="md:hidden pb-4 px-1 animate-in slide-in-from-top-2">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search courses, library..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-base focus:ring-2 focus:ring-[#D62828] focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    aria-label="Mobile Search"
                  />
                  <button type="submit" className="absolute right-3 top-3 text-[#D62828]">
                    <Search size={20} />
                  </button>
                </form>
             </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white fixed inset-0 top-16 z-50 overflow-y-auto animate-in fade-in slide-in-from-right-10 duration-200 flex flex-col">
            <div className="px-4 pt-4 pb-20 space-y-2 flex flex-col">
              {user && (
                 <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-bold text-lg text-gray-900">{user.name}</p>
                    <div className="flex gap-2 mt-3">
                       <Button size="sm" className="flex-1" onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}>Dashboard</Button>
                       <Button size="sm" variant="outline" className="flex-1" onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}>Log Out</Button>
                    </div>
                 </div>
              )}

              <NavItem page="landing" label="Home" />
              <NavItem page="all-workshops" label="Course Catalogue" />
              <NavItem page="about" label="About Us" />
              <NavItem page="learners" label="Student Life" />
              <NavItem page="library" label="Digital Library" />
              <NavItem page="innovation" label="Innovation Hub" />
              <NavItem page="contact-us" label="Contact & Support" />
              
              {/* Mobile Quick Access Buttons (If not logged in) */}
              {!user && (
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                   <Button 
                      variant="primary" 
                      onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                      className="w-full justify-center py-3"
                   >
                      Portal Login
                   </Button>
                   <Button 
                      variant="outline" 
                      onClick={() => { onNavigate('all-workshops'); setIsMobileMenuOpen(false); }}
                      className="w-full justify-center py-3"
                   >
                      Apply Now
                   </Button>
                </div>
              )}

              {/* Mobile Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                 <a 
                   href="https://api.whatsapp.com/send?phone=15817019840&text=76MD4T"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold"
                 >
                   <WhatsAppIcon size={24} /> WhatsApp Support
                 </a>
                 <button 
                   onClick={() => { onNavigate('contact-us'); setIsMobileMenuOpen(false); }} 
                   className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold w-full text-left"
                 >
                   <Phone size={20} /> Free Call Request
                 </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
        {children}
      </main>

      {/* Global Floating WhatsApp Button - Optimized for Mobile */}
      <a 
        href="https://api.whatsapp.com/send?phone=15817019840&text=76MD4T" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-40 bg-[#25D366] text-white p-3.5 md:p-3 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all active:scale-95 flex items-center justify-center animate-in slide-in-from-bottom-10"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={32} />
      </a>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-24 md:pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Logo className="text-white mb-6" />
              <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
                "Inventing the Future through Education" <br/>
                Empowering the next generation of African leaders through AI-driven, solar-powered, and accessible digital learning.
              </p>
              <div className="flex gap-4">
                 <a href="#" className="text-gray-400 hover:text-[#D62828] transition-colors p-2" aria-label="Facebook"><Facebook size={20} /></a>
                 <a href="#" className="text-gray-400 hover:text-[#D62828] transition-colors p-2" aria-label="Twitter"><Twitter size={20} /></a>
                 <a href="#" className="text-gray-400 hover:text-[#D62828] transition-colors p-2" aria-label="LinkedIn"><Linkedin size={20} /></a>
                 <a href="#" className="text-gray-400 hover:text-[#D62828] transition-colors p-2" aria-label="Instagram"><Instagram size={20} /></a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold mb-6 text-[#D62828]">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li onClick={() => onNavigate('landing')} className="cursor-pointer hover:text-white transition-colors py-1">Home</li>
                <li onClick={() => onNavigate('about')} className="cursor-pointer hover:text-white transition-colors py-1">About Us</li>
                <li onClick={() => onNavigate('learners')} className="cursor-pointer hover:text-white transition-colors py-1">Students</li>
                <li onClick={() => onNavigate('library')} className="cursor-pointer hover:text-white transition-colors py-1">Library</li>
                <li onClick={() => onNavigate('innovation')} className="cursor-pointer hover:text-white transition-colors py-1">Innovation Hub</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold mb-6 text-[#D62828]">Programs</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li onClick={() => onNavigate('all-workshops')} className="cursor-pointer hover:text-white transition-colors py-1">Workshops</li>
                <li onClick={() => onNavigate('contact-us')} className="cursor-pointer hover:text-white transition-colors py-1">Scholarships</li>
                <li onClick={() => window.open('https://www.ctuniversity.in/', '_blank')} className="cursor-pointer hover:text-white transition-colors py-1">Full-Time Study</li>
                <li onClick={() => onNavigate('governments')} className="cursor-pointer hover:text-white transition-colors py-1">Gov Partnerships</li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold mb-6 text-[#D62828]">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone size={14}/> +260 977 123 456</li>
                <li className="flex items-center gap-2"><Mail size={14}/> info@imlearn.org</li>
                <li onClick={() => onNavigate('contact-us')} className="cursor-pointer hover:text-white transition-colors py-1 text-[#D62828]">Support Center</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <p className="text-xs text-gray-500">© 2026 Innovative Minds Institute. All rights reserved.</p>
              <p className="text-[10px] text-gray-600 mt-1">This site complies with all GDPR, SSL, and Global Digital Data Standards.</p>
            </div>
            
            <div className="flex gap-3 flex-wrap justify-center">
               <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                 <Globe size={14} className="text-green-500" /> Verified
               </div>
               <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                 <Lock size={14} className="text-blue-500" /> SSL Secure
               </div>
               <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                 <ShieldCheck size={14} className="text-yellow-500" /> Analytics
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
