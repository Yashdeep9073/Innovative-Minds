
import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { Button } from './UI';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('imi_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('imi_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('imi_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Shield size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Privacy & Cookies</h3>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          We use cookies to enhance your learning experience, analyze site traffic, and ensure platform security. By clicking "Accept All", you consent to our use of cookies in accordance with our <button className="text-[#D62828] underline">Cookie Policy</button>.
        </p>

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1" onClick={handleAccept}>
            Accept All
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDecline}>
            Essential Only
          </Button>
        </div>
      </div>
    </div>
  );
};
