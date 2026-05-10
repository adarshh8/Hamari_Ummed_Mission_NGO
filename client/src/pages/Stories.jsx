import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Award, BookOpen, Bike, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import styles from '../styles/Stories.module.css';

const Stories = () => {
  const { lang } = useStore();
  const [activeYear, setActiveYear] = useState('All');
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedStory]);

  const { data: childrenData, isLoading } = useQuery({
    queryKey: ['rewardedChildren'],
    queryFn: async () => { 
      const res = await api.get('/rewarded-children');
      return res.data.data;
    }
  });

  const years = ['All', ...new Set(childrenData?.map(c => c.year.toString()) || [])].sort((a, b) => b - a);

  const sortedChildren = childrenData ? [...childrenData].sort((a, b) => b.year - a.year) : [];
  const featuredChild = sortedChildren[0];
  const filteredChildren = childrenData?.filter(c => activeYear === 'All' || c.year.toString() === activeYear) || [];

  const Hero = () => (
    <section className={styles.hero} style={{ background: 'var(--primary)', textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.breadcrumb} style={{ color: 'var(--white)', display: 'inline-block', marginBottom: '16px' }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Success Stories</div>
          <h1 className={styles.heroTitle} style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', fontSize: '3rem' }}>Rising Stars of <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span></h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>Celebrating the brilliance of children who overcame all odds.</p>
        </motion.div>
      </div>
    </section>
  );

  const Spotlight = ({ child }) => {
    if (!child) return null;
    return (
      <section className={styles.featuredSection}>
        <div className="container">
          <motion.div className={styles.featuredCard} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'var(--light)' }}>
            <div className={styles.featuredImg}>
              <img src={child.photo || "https://images.unsplash.com/photo-1595454223600-91fbbeb7cc5c?q=80&w=800&auto=format&fit=crop"} alt={child.name} />
            </div>
            <div className={styles.featuredContent}>
              <Award size={40} color="var(--secondary)" style={{ marginBottom: '16px' }} />
              <p className={styles.pullQuote} style={{ color: 'var(--dark)' }}>
                "{child.story}"
              </p>
              <div className={styles.authorMeta}>
                <div>
                  <h4 style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>{child.name}</h4>
                  <p style={{ color: 'var(--muted)', marginBottom: '12px' }}>Humari Umeed Mission, Orai | {child.class}</p>
                  <div className={styles.badge} style={{ background: 'var(--secondary)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Bike size={16} /> Rewarded with a New Bicycle
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  const Grid = () => (
    <section className={styles.gridSection}>
      <div className="container">
        {years.length > 1 && (
          <div className={styles.filterContainer} style={{ marginBottom: '40px' }}>
            {years.map(y => (
              <button 
                key={y} 
                className={`btn ${activeYear === y ? 'btn-secondary' : 'btn-outline'}`} 
                onClick={() => setActiveYear(y)}
                style={{ borderRadius: '20px' }}
              >
                {y === 'All' ? 'All Years' : y}
              </button>
            ))}
          </div>
        )}

        <motion.div layout className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <motion.div key={`sk-${i}`} className="skeleton" style={{ height: '400px', borderRadius: '16px' }}/>)
            ) : filteredChildren.length > 0 ? (
              filteredChildren.map((child, idx) => {
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={child._id || idx} 
                    className={styles.storyCard}
                    style={{ backgroundColor: 'var(--white)' }}
                  >
                    <div className={styles.imageContainer} onClick={() => setSelectedStory(child)}>
                      <img src={child.photo || `https://picsum.photos/400/300?random=${idx}`} alt={child.name} className={styles.storyImg} />
                      <div className={styles.imageOverlay}>
                        <span className={styles.readStoryBtn}>Read Full Story</span>
                      </div>
                    </div>
                    
                    <div style={{ padding: '24px' }}>
                      <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '4px' }}>{child.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                        <BookOpen size={14} color="var(--secondary)" /> Humari Umeed Mission, Orai
                      </div>
                      <p style={{ color: 'var(--text)', fontSize: '0.93rem', lineHeight: '1.65', marginBottom: '16px', borderTop: '1px solid #eee', paddingTop: '14px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {child.story}
                      </p>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--secondary)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '600' }}>
                        <Bike size={14} /> Rewarded with a New Bicycle
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                No success stories found{activeYear !== 'All' ? ` for ${activeYear}` : ''}.
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>Success Stories | Hamari Ummeed Mission</title>
        <meta name="description" content="Read about the brilliant children of Orai who achieved academic excellence despite hardships." />
      </Helmet>

      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Hero />
        <Spotlight child={featuredChild} />
        <Grid />
        
        <AnimatePresence>
          {selectedStory && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{
                position: 'fixed', inset: 0, zIndex: 1000, 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px'
              }}
              onClick={() => setSelectedStory(null)}
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
                  height: '90vh',
                  maxHeight: '90vh',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: window.innerWidth > 768 ? 'row' : 'column',
                  position: 'relative'
                }}
              >
                <button 
                  onClick={() => setSelectedStory(null)}
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
                
                <div style={{
                  width: window.innerWidth > 768 ? '380px' : '100%',
                  minWidth: window.innerWidth > 768 ? '380px' : 'unset',
                  minHeight: window.innerWidth > 768 ? 'unset' : '260px',
                  flexShrink: 0,
                  backgroundColor: '#f0f0f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={selectedStory.photo || `https://picsum.photos/800/800?random=${selectedStory._id}`} 
                    alt={selectedStory.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', position: 'absolute', inset: 0 }} 
                  />
                </div>
                
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                  <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '6px' }}>
                    {selectedStory.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--muted)', fontSize: '1rem', marginBottom: '20px' }}>
                    <BookOpen size={18} color="var(--secondary)" />
                    <span>Humari Umeed Mission, Orai</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--secondary)', color: 'white', padding: '8px 18px', borderRadius: '24px', fontSize: '0.95rem', fontWeight: '600', marginBottom: '28px', width: 'fit-content' }}>
                    <Bike size={18} /> Rewarded with a New Bicycle
                  </div>

                  <h3 style={{ fontSize: '1.3rem', color: 'var(--dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={20} color="var(--secondary)" /> How Humari Umeed Mission Helped
                  </h3>
                  <p style={{ color: 'var(--text)', fontSize: '1.05rem', lineHeight: '1.85', marginBottom: '28px' }}>
                    {selectedStory.story}
                  </p>

                  <div style={{ background: 'var(--light)', borderLeft: '4px solid var(--primary)', padding: '14px 18px', borderRadius: '6px', fontSize: '0.95rem', color: 'var(--primary)', fontWeight: '600' }}>
                    <Award size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    10th Board Pass-out — Batch {selectedStory.year}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

export default Stories;
