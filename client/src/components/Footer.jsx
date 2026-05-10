import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Footer = () => {
  const { lang } = useStore();

  const t = {
    en: {
      desc: 'Empowering children and caring for the elderly right here in our community. Every child deserves a chance, every elder deserves care.',
      quickLinks: 'Quick Links',
      about: 'About Us',
      whatWeDo: 'What We Do',
      events: 'Events',
      volunteer: 'Volunteer',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refunds: 'Refund Policy',
      contact: 'Contact Us',
      rights: 'Hamari Ummeed Mission. All rights reserved. Registered NGO.'
    },
    hi: {
      desc: 'हमारे समुदाय में बच्चों को सशक्त बनाना और बुजुर्गों की देखभाल करना। हर बच्चे को एक मौका चाहिए, हर बुजुर्ग को देखभाल चाहिए।',
      quickLinks: 'त्वरित लिंक',
      about: 'हमारे बारे में',
      whatWeDo: 'हमारे कार्य',
      events: 'कार्यक्रम',
      volunteer: 'स्वयंसेवक',
      legal: 'कानूनी',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      refunds: 'धनवापसी नीति',
      contact: 'संपर्क करें',
      rights: 'हमारी उम्मीद मिशन। सर्वाधिकार सुरक्षित। पंजीकृत एनजीओ।'
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2 className="notranslate">
              {lang === 'hi'
                ? <>हमारी <span className="text-secondary">उम्मीद</span> मिशन</>
                : <>Hamari <span className="text-secondary">Ummeed</span> Mission</>}
            </h2>
            <p>{t[lang].desc}</p>
          </div>
          
          <div className="footer-links">
            <h3>{t[lang].quickLinks}</h3>
            <ul>
              <li><Link to="/about">{t[lang].about}</Link></li>
              <li><Link to="/what-we-do">{t[lang].whatWeDo}</Link></li>
              <li><Link to="/events">{t[lang].events}</Link></li>
              <li><Link to="/volunteer">{t[lang].volunteer}</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>{t[lang].legal}</h3>
            <ul>
              <li><Link to="/privacy">{t[lang].privacy}</Link></li>
              <li><Link to="/terms">{t[lang].terms}</Link></li>
              <li><Link to="/refunds">{t[lang].refunds}</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>{t[lang].contact}</h3>
            <p>Near Mandapam Guest House &bull; Palledar Union Chabutra, Grain Market (Galla Mandi), Orai</p>
            <p>Email: hamariummeedmission2000@gmail.com</p>
            <p>Phone: +91 96962 94789</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {t[lang].rights}</p>
        </div>
      </div>
      
      <style>{`
        .footer {
          background-color: var(--dark);
          color: var(--white);
          padding: 80px 0 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 60px;
        }
        .footer-brand h2 {
          color: var(--white);
          margin-bottom: 16px;
        }
        .footer-brand p {
          color: rgba(255,255,255,0.7);
        }
        .footer-links h3, .footer-contact h3 {
          color: var(--white);
          margin-bottom: 24px;
          font-size: 1.2rem;
        }
        .footer-links ul {
          list-style: none;
        }
        .footer-links li {
          margin-bottom: 12px;
        }
        .footer-links a {
          color: rgba(255,255,255,0.7);
        }
        .footer-links a:hover {
          color: var(--secondary);
        }
        .footer-contact p {
          color: rgba(255,255,255,0.7);
          margin-bottom: 12px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
