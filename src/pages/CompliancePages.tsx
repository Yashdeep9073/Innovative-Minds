
import React from 'react';
import { Shield, Lock, FileText, Globe } from 'lucide-react';

const ComplianceLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="min-h-screen bg-gray-50 pt-12 pb-24">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            {icon}
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-4">{title}</h1>
            <p className="text-gray-400 text-lg">Last Updated: March 16, 2026</p>
          </div>
        </div>
        <div className="p-8 md:p-12 prose prose-red max-w-none">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <ComplianceLayout title="Privacy Policy" icon={<Shield size={200} />}>
    <h2>1. Introduction</h2>
    <p>Innovative Minds Institute ("IMI", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website iminstitute.online and use our educational services.</p>
    
    <h2>2. Information We Collect</h2>
    <p>We collect information that you provide directly to us, such as when you create an account, enroll in a course, or communicate with us. This may include:</p>
    <ul>
      <li>Personal identification information (Name, email address, phone number, etc.)</li>
      <li>Academic records and progress data</li>
      <li>Payment information (processed securely via third-party providers)</li>
      <li>Technical data (IP address, browser type, device information)</li>
    </ul>

    <h2>3. GDPR Compliance</h2>
    <p>For users in the European Economic Area (EEA), we process your personal data in accordance with the General Data Protection Regulation (GDPR). Your rights include:</p>
    <ul>
      <li>The right to access your data</li>
      <li>The right to rectification</li>
      <li>The right to erasure ("right to be forgotten")</li>
      <li>The right to data portability</li>
    </ul>

    <h2>4. Data Security</h2>
    <p>We implement enterprise-grade security measures, including TLS 1.3 encryption and secure database rules, to protect your data from unauthorized access or disclosure.</p>
  </ComplianceLayout>
);

export const TermsOfService: React.FC = () => (
  <ComplianceLayout title="Terms of Service" icon={<FileText size={200} />}>
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using the IMI platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
    
    <h2>2. Educational Services</h2>
    <p>IMI provides digital learning resources, workshops, and certification programs. We reserve the right to modify or discontinue any service at any time.</p>

    <h2>3. User Conduct</h2>
    <p>Users are expected to maintain academic integrity and respect the intellectual property rights of IMI and its partners. Any form of harassment or unauthorized distribution of content is strictly prohibited.</p>

    <h2>4. Limitation of Liability</h2>
    <p>IMI shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.</p>
  </ComplianceLayout>
);

export const CookiePolicy: React.FC = () => (
  <ComplianceLayout title="Cookie Policy" icon={<Globe size={200} />}>
    <h2>1. What are Cookies?</h2>
    <p>Cookies are small text files stored on your device that help us improve your experience on our platform.</p>
    
    <h2>2. How We Use Cookies</h2>
    <p>We use cookies for the following purposes:</p>
    <ul>
      <li><strong>Essential Cookies:</strong> Necessary for the platform to function (e.g., authentication).</li>
      <li><strong>Performance Cookies:</strong> Help us understand how users interact with the site.</li>
      <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
    </ul>

    <h2>3. Managing Cookies</h2>
    <p>You can control and manage cookies through your browser settings. However, disabling essential cookies may affect the functionality of the platform.</p>
  </ComplianceLayout>
);

export const DataProtectionStatement: React.FC = () => (
  <ComplianceLayout title="Data Protection Statement" icon={<Lock size={200} />}>
    <h2>Our Commitment to Security</h2>
    <p>At IMI, data protection is at the core of our infrastructure. We utilize Google Cloud Platform's secure environment and Firebase's advanced security rules to ensure that student data is never compromised.</p>
    
    <ul>
      <li><strong>Encryption:</strong> All data is encrypted at rest and in transit using TLS 1.3.</li>
      <li><strong>Access Control:</strong> Strict role-based access control (RBAC) is enforced at the database level.</li>
      <li><strong>Auditing:</strong> Regular security audits are performed to identify and mitigate potential vulnerabilities.</li>
    </ul>
  </ComplianceLayout>
);
