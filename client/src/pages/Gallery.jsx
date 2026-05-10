import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Download, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useStore from '../store/useStore';
import styles from '../styles/Gallery.module.css';

const categories = ['All', 'children', 'events', 'volunteers', 'elderly', 'awards'];

const Gallery = () => {
  const { lang } = useStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => { 
      // Fetching all for client side masonry filter
      const res = await api.get('/gallery'); 
      return res.data.data; 
    },
    staleTime: 5 * 60 * 1000
  });

  const displayData = galleryImages || [];
  
  const filteredData = displayData.filter(img => activeFilter === 'All' || img.category === activeFilter);
  const paginatedData = filteredData.slice(0, visibleCount);

  // Lightbox Handlers
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredData.length);
    }
  }, [lightboxIndex, filteredData.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredData.length) % filteredData.length);
    }
  }, [lightboxIndex, filteredData.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  useEffect(() => {
    if (lightboxIndex !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [lightboxIndex]);

  const Hero = () => (
    <section className={styles.hero} style={{ background: 'var(--primary)', textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Gallery
          </div>
          <h1 className={styles.heroTitle} style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', fontSize: '3rem' }}>From the Ground</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>Moments captured in <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span>.</p>
        </motion.div>
      </div>
    </section>
  );

  const FilterBar = () => (
    <div className={styles.filterBar}>
      <div className="container">
        <div className={styles.tabList}>
          {categories.map(cat => (
            <button key={cat} className={`${styles.tabBtn} ${activeFilter === cat ? styles.active : ''}`} onClick={() => { setActiveFilter(cat); setVisibleCount(12); }}>
              {activeFilter === cat && <motion.div layoutId="activeGalPill" className={styles.activePill} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              {cat}
            </button>
          ))}
        </div>
        <div className={styles.resultsCount}>Showing {filteredData.length} photos</div>
      </div>
    </div>
  );

  const MasonryGrid = () => (
    <section className={styles.gallerySection}>
      <div className="container">
        <div className={styles.masonry}>
          <AnimatePresence>
            {paginatedData.map((img, idx) => (
              <motion.div 
                key={img._id} 
                className={styles.galleryItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(idx)}
              >
                <img src={img.imageUrl} alt={img.caption} loading="lazy" />
                <div className={styles.overlay}>
                  <div className={styles.imgCaption}>{img.caption}</div>
                  <div className={styles.imgMeta}>
                    <span>📍 {img.location}</span>
                    <span>{img.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {visibleCount < filteredData.length && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn btn-outline btn-lg" onClick={() => setVisibleCount(prev => prev + 12)}>Load More</button>
          </div>
        )}
      </div>
    </section>
  );

  const Lightbox = () => {
    if (lightboxIndex === null) return null;
    const currentImg = filteredData[lightboxIndex];

    return createPortal(
      <AnimatePresence>
        <motion.div 
          className={styles.lightboxBackdrop}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <motion.div 
            initial={{ y: 50, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: window.innerWidth > 768 ? 'row' : 'column',
              position: 'relative'
            }}
          >
            <button 
              onClick={closeLightbox}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(0,0,0,0.5)', color: 'white',
                border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10, transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <X size={24} />
            </button>
            
            <div style={{ flex: 1.5, height: window.innerWidth > 768 ? '100%' : '300px', backgroundColor: '#000', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={lightboxIndex}
                  src={currentImg.imageUrl} 
                  alt={currentImg.caption} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0 }} 
                />
              </AnimatePresence>
              
              {/* Image Navigation inside image container */}
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 'auto' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {lightboxIndex + 1} of {filteredData.length}
                </div>
                <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '16px' }}>
                  {currentImg.caption}
                </h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--dark)' }}>
                  <span>📍</span> {currentImg.location}
                </div>
                
                <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--light)', color: 'var(--secondary)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '32px', textTransform: 'capitalize' }}>
                  {currentImg.category}
                </div>
              </div>
              
              <div style={{ marginTop: '32px' }}>
                <a 
                  href={currentImg.imageUrl} 
                  download={`HopeRise_${currentImg._id}.jpg`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline w-full"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Download size={20} style={{ marginRight: '8px' }} /> Download Image
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Hamari Ummeed Mission</title>
        <meta name="description" content="View our gallery of moments captured in Orai." />
      </Helmet>

      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Hero />
        <FilterBar />
        <MasonryGrid />
      </main>
      <Footer />

      <Lightbox />
    </>
  );
};

export default Gallery;
