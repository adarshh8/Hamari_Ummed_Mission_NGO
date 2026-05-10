import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { X, ArrowRight, Search, FileText, CheckCircle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../services/api';
import styles from '../styles/Programs.module.css';

const categories = ['All', 'Education', 'Healthcare', 'Clean Water', 'Women Empowerment', 'Climate', 'Emergency Relief'];

const chartData = [
  { year: '2019', beneficiaries: 150000 },
  { year: '2020', beneficiaries: 220000 },
  { year: '2021', beneficiaries: 450000 },
  { year: '2022', beneficiaries: 680000 },
  { year: '2023', beneficiaries: 950000 },
  { year: '2024', beneficiaries: 1200000 }
];

const Programs = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const openDonationModal = useStore(state => state.openDonationModal);

  const { data: programs, isLoading } = useQuery({
    queryKey: ['allPrograms'],
    queryFn: async () => { const res = await api.get('/programs'); return res.data.data; },
    staleTime: 5 * 60 * 1000
  });

  const filteredPrograms = programs?.filter(p => activeFilter === 'All' || p.category === activeFilter) || [];

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedProgram(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedProgram) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedProgram]);

  const Hero = () => (
    <section className={styles.hero}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={styles.breadcrumb}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Programs</div>
          <h1 className={styles.heroTitle}>What We Fight For</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Six pillars of sustainable impact across five countries.</p>
        </motion.div>
      </div>
    </section>
  );

  const FilterTabs = () => (
    <div className={styles.filterContainer}>
      <div className="container">
        <div className={styles.tabList}>
          {categories.map(cat => (
            <button key={cat} className={`${styles.tabBtn} ${activeFilter === cat ? styles.active : ''}`} onClick={() => setActiveFilter(cat)}>
              {activeFilter === cat && <motion.div layoutId="activePill" className={styles.activePill} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Grid = () => {
    return (
      <section className={styles.gridSection}>
        <div className="container">
          <motion.div layout className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <motion.div key={`skel-${i}`} className="skeleton" style={{ height: '450px', borderRadius: '16px' }} />
                ))
              ) : filteredPrograms.length > 0 ? (
                filteredPrograms.map((prog, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={prog._id} 
                    className={styles.programCard}
                  >
                    <div className={styles.imgWrapper}>
                      <img src={`https://picsum.photos/400/240?random=${idx}`} alt={prog.title} className={styles.coverImg} />
                      <div className={styles.badge}>{prog.category}</div>
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.title}>{prog.title}</h3>
                      <p className={styles.desc}>{prog.description}</p>
                      
                      <div className={styles.statsRow}>
                        <div className={styles.stat}><div className={styles.sNum}>10K+</div><div className={styles.sLabel}>Beneficiaries</div></div>
                        <div className={styles.stat}><div className={styles.sNum}>24</div><div className={styles.sLabel}>Projects</div></div>
                        <div className={styles.stat}><div className={styles.sNum}>3</div><div className={styles.sLabel}>Countries</div></div>
                      </div>

                      <div className={styles.progressTrack}>
                        <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ delay: 0.2, duration: 1 }}></motion.div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'right', marginBottom: '16px' }}>65% Funded</div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.8rem', background: '#eee', padding: '4px 8px', borderRadius: '4px' }}>📍 India</span>
                        <span style={{ fontSize: '0.8rem', background: '#eee', padding: '4px 8px', borderRadius: '4px' }}>📍 Kenya</span>
                      </div>

                      <div className={styles.actions}>
                        <button className="btn btn-outline" onClick={() => setSelectedProgram(prog)}>Learn More</button>
                        <button className="btn btn-primary" onClick={openDonationModal}>Donate</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No programs found</h3>
                  <p style={{ color: 'var(--muted)' }}>Try selecting a different category.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    );
  };

  const ImpactChart = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <section className={styles.chartSection} ref={ref}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center' }}>Impact by Numbers</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '24px' }}>
            Showing growth for: <strong>{activeFilter}</strong>
          </p>
          
          {inView && (
            <motion.div className={styles.chartWrapper} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="year" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }} />
                  <Bar dataKey="beneficiaries" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </section>
    );
  };

  const Explainer = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <section className={styles.explainerSection} ref={ref}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center' }}>How Our Programs Work</h2>
          <div className={styles.explainGrid}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
              <div className={styles.explainIcon}><Search size={32}/></div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>We Research</h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>We identify communities with the highest need through rigorous data analysis and local partnerships.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
              <div className={styles.explainIcon}><FileText size={32}/></div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>We Plan</h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>Detailed implementation strategies are built ensuring 100% sustainability and local ownership.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
              <div className={styles.explainIcon}><CheckCircle size={32}/></div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>We Execute</h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>Funds are deployed directly to the field with full transparency, tracking every milestone.</p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  const PartnerCTA = () => (
    <section className={styles.ctaSection}>
      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px' }}>Want to fund a specific program?</h2>
        <Link to="/contact" className="btn btn-secondary btn-lg">Contact Our Partnerships Team <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }}/></Link>
      </div>
    </section>
  );

  const ProgramModal = ({ prog }) => {
    return createPortal(
      <AnimatePresence>
        {prog && (
          <motion.div 
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.modalClose} onClick={() => setSelectedProgram(null)}><X size={24}/></button>
              
              <div className={styles.modalHero}>
                <img src={`https://picsum.photos/1200/600?random=${prog._id}`} alt={prog.title} className={styles.modalImg} />
              </div>
              
              <div className={styles.modalBody}>
                <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--light)', color: 'var(--primary)', fontWeight: '600', borderRadius: '20px', marginBottom: '16px' }}>
                  {prog.category}
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '24px' }}>{prog.title}</h2>
                
                <div style={{ display: 'flex', gap: '32px', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '24px' }}>
                  <div><span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>10K+</span><br/><span style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Beneficiaries</span></div>
                  <div><span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>24</span><br/><span style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Projects</span></div>
                  <div><span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>3</span><br/><span style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Countries</span></div>
                </div>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text)', marginBottom: '24px' }}>
                  {prog.description}
                  <br/><br/>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <div className={styles.modalMiniGrid}>
                  <img src="https://picsum.photos/300/200?random=a" alt="field" className={styles.modalMiniImg}/>
                  <img src="https://picsum.photos/300/200?random=b" alt="field" className={styles.modalMiniImg}/>
                  <img src="https://picsum.photos/300/200?random=c" alt="field" className={styles.modalMiniImg}/>
                  <img src="https://picsum.photos/300/200?random=d" alt="field" className={styles.modalMiniImg}/>
                </div>

                <div className={styles.modalTestimonial}>
                  "This program completely changed our community. Before, we had to walk 5km for water. Now, we have a well right in our village."
                  <div style={{ fontWeight: 'bold', marginTop: '16px', color: 'var(--primary)' }}>- Beneficiary from Rajasthan</div>
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center' }}>
                  <button className="btn btn-primary btn-lg" onClick={() => { setSelectedProgram(null); openDonationModal(); }}>Donate to This Program</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <Helmet>
        <title>Programs | HopeRise Foundation</title>
        <meta name="description" content="Explore our six pillars of sustainable impact." />
      </Helmet>

      <main>
        <Hero />
        <FilterTabs />
        <Grid />
        <ImpactChart />
        <Explainer />
        <PartnerCTA />
      </main>

      {selectedProgram && <ProgramModal prog={selectedProgram} />}
    </>
  );
};

export default Programs;
