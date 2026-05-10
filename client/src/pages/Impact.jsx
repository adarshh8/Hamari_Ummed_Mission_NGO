import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import styles from '../styles/Impact.module.css';



const sdgs = [
  { id: 1, title: 'No Poverty', color: '#E5243B' },
  { id: 3, title: 'Good Health', color: '#4C9F38' },
  { id: 4, title: 'Quality Education', color: '#C5192D' },
  { id: 5, title: 'Gender Equality', color: '#FF3A21' },
  { id: 6, title: 'Clean Water', color: '#26BDE2' },
  { id: 13, title: 'Climate Action', color: '#3F7E44' }
];

const Impact = () => {
  const { data: statsData } = useQuery({
    queryKey: ['platformStats'],
    queryFn: async () => {
      const res = await api.get('/stats');
      return res.data.data;
    }
  });

  const Hero = () => {
    const { ref, inView } = useInView({ triggerOnce: true });
    return (
      <section className={styles.hero} ref={ref}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ color: 'var(--primary)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Our Impact
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.heroTitle}>Numbers That Tell the Real Story</motion.h1>
          
          <div className={styles.megaCounters}>
            <div className={styles.megaItem}>
              <div className={styles.megaNum}>{inView ? <CountUp end={statsData?.livesImpacted || 0} duration={2.5} separator="," /> : '0'}</div>
              <div className={styles.megaLabel}>Lives Impacted</div>
            </div>
            <div className={styles.megaItem}>
              <div className={styles.megaNum}>{inView ? <CountUp end={statsData?.activeVolunteers || 0} duration={2.5} separator="," /> : '0'}</div>
              <div className={styles.megaLabel}>Active Volunteers</div>
            </div>
            <div className={styles.megaItem}>
              <div className={styles.megaNum}>{inView ? <CountUp end={statsData?.activeProjects || 0} duration={2.5} /> : '0'}</div>
              <div className={styles.megaLabel}>Active Projects</div>
            </div>
            <div className={styles.megaItem}>
              <div className={styles.megaNum}>{inView ? <CountUp end={statsData?.countries || 1} duration={2.5} /> : '0'}</div>
              <div className={styles.megaLabel}>Regions Served</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const EmptyStateSection = ({ title, message }) => (
    <section style={{ padding: '80px 0', background: 'var(--light)', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '16px' }}>{title}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          {message}
        </p>
      </div>
    </section>
  );

  const SDGs = () => (
    <section className={styles.sdgSection}>
      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center' }}>Aligned with UN Sustainable Development Goals</h2>
        <div className={styles.sdgGrid}>
          {sdgs.map(sdg => (
            <div key={sdg.id} className={styles.sdgBadge} style={{ background: sdg.color }}>
              <div className={styles.sdgNum}>{sdg.id}</div>
              <div className={styles.sdgTitle}>{sdg.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>Our Impact | Humari Umeed Mission</title>
        <meta name="description" content="Explore our data-driven impact reports and real metrics." />
      </Helmet>

      <main>
        <Hero />
        <EmptyStateSection 
          title="Growth & Reach" 
          message="Detailed impact maps and growth charts are currently being compiled. As our mission expands, we'll share transparent visualizations of our localized and global impact right here." 
        />
        <SDGs />
      </main>
    </>
  );
};

export default Impact;
