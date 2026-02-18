
import React, { useEffect, useState } from 'react';
import { getEnrollmentById, completeEnrollmentPayment } from '../services/firebase';
import { Enrollment } from '../types';
import { Button, Card, Input } from '../components/UI';
import { CreditCard, CheckCircle, ShieldCheck, Lock } from 'lucide-react';

interface PaymentPageProps {
  enrollmentId: string;
  onNavigate: (p: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ enrollmentId, onNavigate }) => {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (enrollmentId) {
        const data = await getEnrollmentById(enrollmentId);
        if (data) {
          setEnrollment(data);
          // Auto-redirect if already paid
          if (data.payment_status === 'paid') {
             onNavigate(`player/${data.workshopId}`);
          }
        }
      }
      setLoading(false);
    };
    fetchEnrollment();
  }, [enrollmentId]);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate API delay
    setTimeout(async () => {
      if (enrollment) {
        await completeEnrollmentPayment(enrollment.id);
        setPaymentSuccess(true);
      }
      setProcessing(false);
    }, 2000);
  };

  const handleContinue = () => {
    if (enrollment) {
      onNavigate(`player/${enrollment.workshopId}`);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-[#D62828] border-t-transparent rounded-full"></div></div>;

  if (!enrollment) return <div className="p-20 text-center">Enrollment not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Secure Payment Gateway</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Complete your enrollment for <span className="font-bold text-[#D62828]">{enrollment.course_title}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {paymentSuccess ? (
            <div className="text-center animate-in fade-in zoom-in">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Successful</h3>
              <p className="mt-2 text-sm text-gray-500">
                Thank you! Your enrollment is confirmed. You can now access all course materials.
              </p>
              <div className="mt-6">
                <Button className="w-full" onClick={handleContinue}>Continue to Course Orientation</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">$150.00</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-green-600">
                    <ShieldCheck size={12} /> SSL Encrypted Transaction
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-[#D62828] focus:border-[#D62828] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Expiry</label>
                    <input 
                       type="text" 
                       placeholder="MM/YY"
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#D62828] focus:border-[#D62828] sm:text-sm"
                       value={expiry}
                       onChange={e => setExpiry(e.target.value)}
                    />
                 </div>
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input 
                       type="text" 
                       placeholder="123"
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#D62828] focus:border-[#D62828] sm:text-sm"
                       value={cvv}
                       onChange={e => setCvv(e.target.value)}
                    />
                 </div>
              </div>

              <Button 
                onClick={handlePayment} 
                className="w-full" 
                isLoading={processing}
                icon={Lock}
              >
                {processing ? 'Processing Securely...' : 'Pay Now & Enroll'}
              </Button>
              
              <div className="flex justify-center gap-4 mt-4 opacity-50">
                 {/* Placeholder icons for Visa/Mastercard */}
                 <div className="h-6 w-10 bg-gray-200 rounded"></div>
                 <div className="h-6 w-10 bg-gray-200 rounded"></div>
                 <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
