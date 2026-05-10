import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import NGOLogo from '../assets/icons/NGO_logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openDonationModal, lang, toggleLang } = useStore();

  const t = {
    en: {
      home: 'Home', about: 'About Us', whatWeDo: 'What We Do', events: 'Events', stories: 'Stories', gallery: 'Gallery', contact: 'Contact', donate: 'Donate Now', volunteer: 'Volunteer'
    },
    hi: {
      home: 'होम', about: 'हमारे बारे में', whatWeDo: 'हमारे कार्य', events: 'कार्यक्रम', stories: 'कहानियाँ', gallery: 'गैलरी', contact: 'संपर्क', donate: 'अभी दान करें', volunteer: 'स्वयंसेवक बनें'
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger Google Translate whenever lang changes
  useEffect(() => {
    const changeGoogleTranslateLang = () => {
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        // If switching back to English, we need to clear the translation
        if (lang === 'en') {
          // Google Translate sets a cookie. The easiest way to revert is to clear it and reload, 
          // or select 'en' if it exists. But 'en' is usually not in the dropdown if it's the source.
          // Wait, 'en' IS in the dropdown if we use includedLanguages: 'en,hi'.
          selectField.value = 'en';
          selectField.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Also try to click the "Show original" button if it exists
          const iframe = document.querySelector('iframe.goog-te-banner-frame');
          if (iframe) {
            const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            const restoreBtn = innerDoc.getElementById('restore');
            if (restoreBtn) restoreBtn.click();
          }
        } else {
          selectField.value = lang;
          selectField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };
    
    changeGoogleTranslateLang();
    
    // Poll a few times in case the widget is still loading
    let attempts = 0;
    const intervalId = setInterval(() => {
      attempts++;
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        changeGoogleTranslateLang();
        clearInterval(intervalId);
      }
      if (attempts > 10) clearInterval(intervalId); // Stop after 5 seconds
    }, 500);

    return () => clearInterval(intervalId);
  }, [lang]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container flex-between nav-content">
        <Link to="/" className="brand">
          <img src={NGOLogo} alt="Hamari Ummeed Mission Logo" className="brand-logo" />
          <span className="brand-text notranslate">
            {lang === 'hi' ? <>हमारी <span className="text-primary">उम्मीद</span> मिशन</> : <>Hamari <span className="text-primary">Ummeed</span> Mission</>}
          </span>
        </Link>

        <div className="nav-links desktop-only">
          <Link to="/">{t[lang].home}</Link>
          <Link to="/about">{t[lang].about}</Link>
          <Link to="/what-we-do">{t[lang].whatWeDo}</Link>
          <Link to="/events">{t[lang].events}</Link>
          <Link to="/stories">{t[lang].stories}</Link>
          <Link to="/gallery">{t[lang].gallery}</Link>
          <Link to="/contact">{t[lang].contact}</Link>
        </div>

        <div className="nav-actions desktop-only">
          <button className="btn btn-outline notranslate" onClick={toggleLang} style={{ marginRight: '16px', padding: '8px 16px' }}>
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
          <button className="btn btn-primary notranslate" onClick={openDonationModal}>
            <Heart size={18} /> {t[lang].donate}
          </button>
        </div>

        <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Social icons pinned to true right corner of navbar */}
      <div className="social-icons-corner desktop-only">
        <a href="https://www.instagram.com/hamari_ummeed_mission/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/share/1GoQWUNw49/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Facebook" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
          </svg>
        </a>
        <a href="https://wa.me/919696294789" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="WhatsApp" aria-label="WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.054-1.105l-.29-.172-2.868.853.853-2.868-.172-.29A7.95 7.95 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.845c-.242-.121-1.432-.707-1.654-.787-.222-.08-.384-.121-.545.121-.161.242-.626.787-.767.949-.141.161-.282.181-.524.06-.242-.121-1.021-.376-1.944-1.199-.718-.641-1.203-1.432-1.344-1.674-.141-.242-.015-.373.106-.494.109-.109.242-.282.363-.423.121-.141.161-.242.242-.403.08-.162.04-.303-.02-.424-.06-.121-.545-1.314-.747-1.8-.197-.473-.397-.409-.545-.417l-.464-.008c-.161 0-.424.06-.646.303-.222.242-.848.829-.848 2.02 0 1.192.868 2.344.989 2.505.121.161 1.708 2.607 4.139 3.554 1.43.548 1.992.596 2.71.502.435-.06 1.344-.549 1.534-1.08.19-.53.19-.985.133-1.08-.056-.096-.218-.156-.46-.277z"/>
          </svg>
        </a>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu glass"
          >
            <button className="btn btn-outline w-full notranslate" onClick={() => { toggleLang(); setIsMobileMenuOpen(false); }}>
              {lang === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
            </button>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].home}</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].about}</Link>
            <Link to="/what-we-do" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].whatWeDo}</Link>
            <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].events}</Link>
            <Link to="/stories" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].stories}</Link>
            <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].gallery}</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t[lang].contact}</Link>
            <button className="btn btn-primary w-full mt-4 notranslate" onClick={() => { openDonationModal(); setIsMobileMenuOpen(false); }}>
              {t[lang].donate}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 16px 0;
          background: var(--white);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: padding 0.3s ease, box-shadow 0.3s ease;
        }
        .social-icons-corner {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 10;
        }
        .social-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--light);
          color: var(--dark);
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .social-icon-btn:hover {
          transform: translateY(-2px);
        }
        .social-icon-btn[title="Instagram"]:hover {
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
          color: white;
        }
        .social-icon-btn[title="Facebook"]:hover {
          background: #1877F2;
          color: white;
        }
        .social-icon-btn[title="WhatsApp"]:hover {
          background: #25D366;
          color: white;
        }
        .navbar.scrolled {
          padding: 10px 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }
        .nav-content {
          position: relative;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
        }
        .brand-logo {
          height: 64px;
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .brand:hover .brand-logo {
          transform: scale(1.05);
        }
        .nav-links {
          display: flex;
          gap: 32px;
          font-weight: 500;
        }
        .nav-links a {
          position: relative;
          color: var(--dark);
          text-decoration: none;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.25s ease;
        }
        .nav-links a:hover::after,
        .nav-links a.active::after {
          width: 100%;
        }
        .mobile-toggle {
          display: none;
          cursor: pointer;
          color: var(--dark);
        }
        .mobile-menu {
          position: absolute;
          top: 100%; left: 0; right: 0;
          background: var(--white);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .mobile-menu a {
          color: var(--dark);
          font-weight: 500;
          text-decoration: none;
          padding: 4px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .w-full { width: 100%; justify-content: center; }
        .mt-4 { margin-top: 16px; }
        
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-toggle { display: block; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
