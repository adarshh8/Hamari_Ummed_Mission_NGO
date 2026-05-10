import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirm", 
  isDangerous = false,
  requireTyping = false,
  typingText = "RESET"
}) => {
  const [inputText, setInputText] = useState('');

  const handleConfirm = () => {
    if (requireTyping && inputText !== typingText) return;
    onConfirm();
  };

  const isButtonDisabled = requireTyping && inputText !== typingText;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999
            }}
          />
          <div style={{
            position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, pointerEvents: 'none', padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                padding: '32px 24px',
                pointerEvents: 'auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: isDangerous ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <AlertTriangle size={32} color={isDangerous ? 'var(--error)' : '#b77904'} />
              </div>

              <h3 style={{ margin: '0 0 12px 0', fontFamily: 'var(--font-heading)', color: 'var(--dark)' }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.5, marginBottom: '24px' }}>{message}</p>

              {requireTyping && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--dark)', marginBottom: '8px' }}>
                    Type <strong>{typingText}</strong> to confirm:
                  </label>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={onClose}
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--dark)' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isButtonDisabled}
                  style={{ 
                    flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: isButtonDisabled ? 'not-allowed' : 'pointer', fontWeight: 600, color: 'white',
                    background: isDangerous ? 'var(--error)' : 'var(--primary)',
                    opacity: isButtonDisabled ? 0.5 : 1
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
