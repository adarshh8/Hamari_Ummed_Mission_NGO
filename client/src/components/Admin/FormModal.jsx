import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FormModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getWidth = () => {
    switch(size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      case 'md':
      default: return '600px';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: getWidth(),
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--dark)' }}>{title}</h3>
                <button 
                  onClick={onClose}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
