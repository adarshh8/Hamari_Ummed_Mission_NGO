import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import NGOHome1 from '../assets/images/NGOHome1.jpg';

const Hero = () => {
  const { openDonationModal, lang } = useStore();

  const t = {
    en: {
      subtitle: 'Hamari Ummeed Mission',
      title1: 'Empowering Lives.',
      title2: 'Transforming Communities.',
      desc: 'Join us in bringing education, healthcare, and clean water to underserved regions across India.',
      donate: 'Donate Now',
      volunteer: 'Become a Volunteer'
    },
    hi: {
      subtitle: 'हमारी उम्मीद मिशन',
      title1: 'जीवन को सशक्त बनाना।',
      title2: 'समुदायों को बदलना।',
      desc: 'पूरे भारत में वंचित क्षेत्रों में शिक्षा, स्वास्थ्य सेवा और स्वच्छ जल लाने में हमारे साथ जुड़ें।',
      donate: 'अभी दान करें',
      volunteer: 'स्वयंसेवक बनें'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      
      <motion.div 
        className="container hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={itemVariants} className="hero-subtitle">
          {t[lang].subtitle}
        </motion.span>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          {t[lang].title1}<br/>
          <span className="text-secondary">{t[lang].title2}</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="hero-desc">
          {t[lang].desc}
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-actions">
          <button className="btn btn-secondary btn-lg" onClick={openDonationModal}>
            <Heart size={20} /> {t[lang].donate}
          </button>
          <Link to="/volunteer" className="btn btn-outline-white btn-lg">
            {t[lang].volunteer} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </motion.div>

      <div className="scroll-indicator">
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mouse"
        >
          <div className="wheel"></div>
        </motion.div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          background: url('${NGOHome1}') center/cover no-repeat;
          color: var(--white);
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(13,27,15,0.9) 0%, rgba(13,27,15,0.4) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
        }
        .hero-subtitle {
          display: inline-block;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          color: var(--secondary);
          border-left: 3px solid var(--secondary);
          padding-left: 12px;
        }
        .hero-title {
          font-size: clamp(3rem, 5vw, 5.5rem);
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--white);
        }
        .hero-desc {
          font-size: 1.25rem;
          margin-bottom: 40px;
          max-width: 600px;
          opacity: 0.9;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .btn-lg {
          padding: 16px 32px;
          font-size: 1.1rem;
        }
        .btn-outline-white {
          background: transparent;
          color: var(--white);
          border: 2px solid var(--white);
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: var(--radius-full);
          padding: 14px 30px;
          transition: all var(--transition-normal);
        }
        .btn-outline-white:hover {
          background: var(--white);
          color: var(--dark);
        }
        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }
        .mouse {
          width: 30px;
          height: 45px;
          border: 2px solid var(--white);
          border-radius: 15px;
          display: flex;
          justify-content: center;
          padding-top: 8px;
        }
        .wheel {
          width: 4px;
          height: 8px;
          background: var(--white);
          border-radius: 2px;
        }
        @media (max-width: 768px) {
          .hero-section {
            background-position: 70% center;
          }
          .hero-overlay {
            background: linear-gradient(to top, rgba(13,27,15,0.95) 0%, rgba(13,27,15,0.6) 100%);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
