
import React, { useState, useEffect } from 'react';
import { User, StudentSettings, PaymentRecord, Certificate, Notice, FAQItem } from '../types';
import { Card, Button, Input } from './UI';
import { 
  getStudentSettings, updateStudentSettings, getStudentPayments, 
  getStudentCertificates, getNotices, getFAQs 
} from '../services/firebase';
import { 
  Settings, CreditCard, Award, Bell, HelpCircle, ChevronDown, ChevronUp, 
  Download, CheckCircle, AlertCircle, Shield, Globe, Type
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

// --- 1. SETTINGS VIEW ---
export const SettingsView: React.FC<{ user: User }> = ({ user }) => {
  const [settings, setSettings] = useState<StudentSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStudentSettings(user.id).then(setSettings);
  }, [user.id]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateStudentSettings(user.id, settings);
      alert("Settings saved successfully!");
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Settings className="text-[#D62828]" /> Account Settings
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Bell size={18}/> Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <input type="checkbox" checked={settings.notifications.email} onChange={e => setSettings({...settings, notifications: {...settings.notifications, email: e.target.checked}})} className="w-5 h-5 text-[#D62828] rounded focus:ring-red-500" />
            </label>
            <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm text-gray-700">SMS Alerts</span>
              <input type="checkbox" checked={settings.notifications.sms} onChange={e => setSettings({...settings, notifications: {...settings.notifications, sms: e.target.checked}})} className="w-5 h-5 text-[#D62828] rounded focus:ring-red-500" />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={18}/> Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Language</label>
              <select 
                value={settings.language} 
                onChange={e => setSettings({...settings, language: e.target.value})}
                className="w-full border rounded p-2 text-sm"
              >
                <option>English</option>
                <option>French</option>
                <option>Swahili</option>
                <option>Portuguese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Accessibility</label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.accessibility.highContrast} onChange={e => setSettings({...settings, accessibility: {...settings.accessibility, highContrast: e.target.checked}})} />
                High Contrast Mode
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={18}/> Security</h3>
          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm font-medium">Password</p>
               <p className="text-xs text-gray-500">Last changed 3 months ago</p>
             </div>
             <Button variant="outline" size="sm">Reset Password</Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
      </div>
    </div>
  );
};

// --- 2. PAYMENTS VIEW ---
export const PaymentsView: React.FC<{ user: User }> = ({ user }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentPayments(user.id).then(data => {
      setPayments(data);
      setLoading(false);
    });
  }, [user.id]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="text-[#D62828]" /> Payments & Fees
        </h2>
        <Button variant="outline" size="sm" icon={Download}>Download Statement</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="p-6 bg-blue-50 border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-blue-900">$200.00</p>
         </Card>
         <Card className="p-6 bg-red-50 border-red-100">
            <p className="text-xs font-bold text-red-600 uppercase mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-red-900">$20.00</p>
         </Card>
         <Card className="p-6 bg-green-50 border-green-100">
            <p className="text-xs font-bold text-green-600 uppercase mb-1">Status</p>
            <p className="text-2xl font-bold text-green-900">Good Standing</p>
         </Card>
      </div>

      <Card className="overflow-hidden">
        {/* Added overflow wrapper for mobile table support */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">{formatDate(p.date)}</td>
                  <td className="p-4 font-medium">{p.description}</td>
                  <td className="p-4">{p.currency} {p.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      p.status === 'paid' ? 'bg-green-100 text-green-700' : 
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                      <Download size={12} /> {p.invoiceId}
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && !loading && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No payment history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- 3. CERTIFICATES VAULT ---
export const CertificatesView: React.FC<{ user: User }> = ({ user }) => {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    getStudentCertificates(user.id).then(setCerts);
  }, [user.id]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Award className="text-[#D62828]" /> Certificates Vault
      </h2>
      <p className="text-gray-600">Verify, download, and share your earned credentials.</p>

      {certs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map(cert => (
            <div key={cert.id} className="bg-white border-l-4 border-green-500 shadow-sm rounded-r-xl p-6 flex flex-col justify-between">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg">{cert.workshopName}</h3>
                   <Award className="text-green-500" size={24} />
                 </div>
                 <p className="text-sm text-gray-500 mb-4">Issued: {formatDate(cert.issuedDate)}</p>
                 <div className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-600 mb-4 break-all">
                   ID: {cert.verificationCode}
                 </div>
               </div>
               <div className="flex gap-2 mt-auto">
                 <Button size="sm" variant="primary" className="flex-1" icon={Download}>Download PDF</Button>
                 <Button size="sm" variant="outline" className="flex-1">Share</Button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
             <Award size={32} />
           </div>
           <h3 className="text-lg font-bold text-gray-700">No Certificates Yet</h3>
           <p className="text-gray-500">Complete a workshop with 85% or higher to earn your first certificate.</p>
        </Card>
      )}
    </div>
  );
};

// --- 4. NOTICE BOARD ---
export const NoticesView: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Bell className="text-[#D62828]" /> Notice Board
      </h2>
      
      <div className="space-y-4">
        {notices.map(notice => (
          <Card key={notice.id} className={`p-6 border-l-4 ${
            notice.priority === 'high' ? 'border-red-500 bg-red-50' : 
            notice.priority === 'normal' ? 'border-blue-500' : 'border-gray-300'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-bold ${notice.priority === 'high' ? 'text-red-800' : 'text-gray-900'}`}>{notice.title}</h3>
              <span className="text-xs text-gray-500">{formatDate(notice.date)}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{notice.message}</p>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Posted by: {notice.author}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- 5. SUPPORT HUB ---
export const SupportView: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getFAQs().then(setFaqs);
  }, []);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <HelpCircle className="text-[#D62828]" /> Student Support & FAQ
      </h2>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for help..." 
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D62828]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredFaqs.map(faq => (
          <div key={faq.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <button 
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded mr-3 uppercase">{faq.category}</span>
                {faq.question}
              </span>
              {openId === faq.id ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
            </button>
            {openId === faq.id && (
              <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100 bg-gray-50/50">
                <div className="mt-3">{faq.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Card className="p-6 bg-blue-50 border-blue-100 mt-8 text-center">
        <h3 className="font-bold text-blue-900 mb-2">Still need help?</h3>
        <p className="text-sm text-blue-700 mb-4">Our support team is available Mon-Fri, 8am - 5pm.</p>
        <Button size="sm">Contact Support</Button>
      </Card>
    </div>
  );
};
