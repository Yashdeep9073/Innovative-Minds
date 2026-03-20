
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from './UI';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Check if already installed or dismissed
      const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-[#D62828] rounded-lg">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">I.M Institute App</h3>
              <p className="text-xs text-gray-500">Official Learning Platform</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          Install the I.M Institute learning app for faster access, offline lessons, and a better learning experience.
        </p>

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1 flex items-center justify-center gap-2" onClick={handleInstall}>
            <Download size={18} />
            Install App
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDismiss}>
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
};
