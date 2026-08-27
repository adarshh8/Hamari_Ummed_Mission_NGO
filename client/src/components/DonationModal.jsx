import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useStore from '../store/useStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const DonationModal = () => {
  const { isDonationModalOpen, closeDonationModal, donationPresetAmount } = useStore();
  const [step, setStep] = useState(1);
  const [manualAmount, setManualAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', pan: '', isAnonymous: false, message: '' });

  // The real amount: if a preset was passed (e.g. snack total), use that, else use the manual picker value
  // Guard: only use donationPresetAmount when it's actually a finite positive number
  const presetIsValid = typeof donationPresetAmount === 'number' && isFinite(donationPresetAmount) && donationPresetAmount > 0;
  const amount = presetIsValid ? donationPresetAmount : manualAmount;

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isDonationModalOpen) {
      setStep(1);
      setManualAmount(1000);
      setCustomAmount('');
    }
  }, [isDonationModalOpen]);

  const handleAmountSelect = (val) => {
    setManualAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setManualAmount(Number(e.target.value));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNext = () => {
    if (step === 1 && (!amount || amount < 1)) {
      toast.error('Minimum donation amount is ₹1');
      return;
    }
    if (step === 2 && (!formData.name || !formData.email)) {
      toast.error('Name and Email are required');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleDonate = async () => {
    try {
      // 1. Create order on server
      const { data: { data } } = await api.post('/donations', {
        donor: formData,
        amount,
        isAnonymous: formData.isAnonymous,
        message: formData.message
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Hamari Ummeed Mission',
        description: 'Donation',
        order_id: data.order.id,
        handler: async function (response) {
          // 3. Verify on server
          await api.post('/donations/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donationId: data.donationId
          });
          toast.success('Donation successful! Thank you.');
          setStep(4); // Success step
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1B4332'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment initialization failed. Please try again later.');
    }
  };

  if (!isDonationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <button className="close-btn" onClick={() => { closeDonationModal(); setStep(1); }}>
            <X size={24} />
          </button>
          
          <div className="modal-header">
            <h2 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Donate to Hamari Ummeed</h2>
            <p className="text-muted">Your contribution brings hope and education to the children of Orai.</p>
          </div>

          <div className="modal-body">
            {step === 1 && (
              <div className="step-1">
                {presetIsValid && (
                  <div style={{ background: 'rgba(27,67,50,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Your selected total</span>
                    <span style={{ fontWeight: '700', fontSize: '1.4rem', color: 'var(--primary)' }}>₹{donationPresetAmount}</span>
                  </div>
                )}
                <h3 style={{ color: 'var(--dark)' }}>{presetIsValid ? 'Or choose a different amount' : 'Select Amount'}</h3>
                <div className="amount-grid">
                  {[500, 1000, 2500, 5000].map(val => (
                    <button
                      key={val}
                      className={`amount-btn ${amount === val && !presetIsValid && !customAmount ? 'active' : ''}`}
                      onClick={() => handleAmountSelect(val)}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <div className="custom-amount">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    placeholder="Custom Amount"
                    value={presetIsValid && !customAmount ? donationPresetAmount : customAmount}
                    onChange={handleCustomAmount}
                    min="1"
                  />
                </div>
                <button className="btn btn-primary w-full mt-4" onClick={handleNext}>Continue — ₹{amount}</button>
              </div>
            )}

            {step === 2 && (
              <div className="step-2">
                <h3>Your Information</h3>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <input type="text" name="pan" placeholder="PAN Number (For 80G Tax Exemption)" value={formData.pan} onChange={handleChange} />
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" id="anon" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
                  <label htmlFor="anon">Make my donation anonymous</label>
                </div>
                <div className="btn-group">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={handleNext}>Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-3 text-center">
                <h3>Confirm Payment</h3>
                <div className="amount-display">
                  <h2>₹{amount}</h2>
                </div>
                <p className="tax-note">Eligible for 80G tax deduction.</p>
                <div className="btn-group">
                  <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-primary" onClick={handleDonate}>Pay Now</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step-4 text-center">
                <div className="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your donation of ₹{amount} was successful.</p>
                <p className="text-muted">A receipt has been sent to your email.</p>
                <button className="btn btn-secondary mt-4" onClick={() => { closeDonationModal(); setStep(1); }}>Close</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal-content {
          background: var(--white);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 500px;
          position: relative;
          box-shadow: var(--shadow-hover);
        }
        .close-btn {
          position: absolute;
          top: 16px; right: 16px;
          background: transparent;
          color: var(--muted);
          border: none;
          cursor: pointer;
        }
        .modal-header {
          padding: 32px 32px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          text-align: center;
        }
        .modal-body {
          padding: 32px;
        }
        .amount-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .amount-btn {
          padding: 16px;
          border: 2px solid #eee;
          background: transparent;
          border-radius: var(--radius-md);
          font-size: 1.2rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }
        .amount-btn.active, .amount-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(27, 67, 50, 0.05);
        }
        .custom-amount {
          position: relative;
          margin-bottom: 24px;
        }
        .currency-symbol {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: var(--muted);
        }
        .custom-amount input {
          width: 100%;
          padding: 16px 16px 16px 40px;
          font-size: 1.2rem;
          border: 2px solid #eee;
          border-radius: var(--radius-md);
          outline: none;
        }
        .custom-amount input:focus {
          border-color: var(--primary);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group input[type="text"], .form-group input[type="email"] {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-family: var(--font-body);
        }
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-group {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
        .btn-group .btn {
          flex: 1;
        }
        .w-full { width: 100%; justify-content: center; }
        .text-center { text-align: center; }
        .amount-display h2 {
          font-size: 4rem;
          color: var(--primary);
          margin: 24px 0;
        }
        .tax-note {
          color: var(--success);
          font-weight: 500;
          margin-bottom: 24px;
        }
        .success-icon {
          width: 80px; height: 80px;
          background: var(--success);
          color: white;
          font-size: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default DonationModal;
