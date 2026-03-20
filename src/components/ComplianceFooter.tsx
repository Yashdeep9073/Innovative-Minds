
import React from 'react';
import { ShieldCheck, Lock, Globe, CheckCircle, Shield } from 'lucide-react';

export const ComplianceFooter: React.FC = () => {
  return (
    <div className="bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={24} />
              Platform Security & Compliance
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              IMI adheres to the highest international standards for educational technology, ensuring a secure and private learning environment for all students globally.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
              <Lock className="text-blue-500" size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Secure SSL Encrypted</p>
                <p className="text-[10px] text-gray-500">TLS 1.3 Enterprise Grade</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
              <Globe className="text-emerald-500" size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Global Web Standards 2026</p>
                <p className="text-[10px] text-gray-500">W3C & ISO Compliant</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
              <Shield className="text-purple-500" size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Data Protection Standards</p>
                <p className="text-[10px] text-gray-500">GDPR & International Privacy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
              <CheckCircle className="text-yellow-500" size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Trusted Learning Platform</p>
                <p className="text-[10px] text-gray-500">Verified Educational Institution</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="PCI DSS Compliant">
                <span className="text-[10px] font-bold">PCI</span>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="GDPR Compliant">
                <span className="text-[10px] font-bold">GDPR</span>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="ISO 27001 Certified">
                <span className="text-[10px] font-bold">ISO</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 text-center md:text-right">
              Verified Secure Platform <br/>
              Innovative Minds Institute Global Compliance 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
