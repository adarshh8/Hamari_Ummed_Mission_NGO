import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Heart, Shirt, Home, Monitor, UserCheck, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import styles from '../styles/Programs.module.css';

const WhatWeDo = () => {
  const { lang } = useStore();
  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => { const res = await api.get('/activities'); return res.data.data; }
  });

  const getIcon = (category) => {
    switch(category) {
      case 'education': return <BookOpen size={32} />;
      case 'elderly': return <Heart size={32} />;
      case 'awareness': return <Users size={32} />;
      case 'cultural': return <Home size={32} />;
      default: return <UserCheck size={32} />;
    }
  };

  const fixedActivities = [
    { title: 'Free Evening Tuition', desc: 'Helping weak students from local government schools excel in their studies.', icon: <BookOpen size={32} />, category: 'education' },
    { title: 'School Admissions', desc: 'Sponsoring the education of brilliant underprivileged children in good private schools.', icon: <UserCheck size={32} />, category: 'education' },
    { title: 'Books & Uniforms', desc: 'Distributing course books, stationary, bags, and uniforms at the start of every session.', icon: <Shirt size={32} />, category: 'education' },
    { title: 'Elder Companionship', desc: 'Regular visits to old age homes and lonely elderly to spend quality time and provide care.', icon: <Heart size={32} />, category: 'elderly' },
    { title: 'Elder Medical Support', desc: 'Providing basic medicines and arranging health checkups for the elderly.', icon: <Stethoscope size={32} />, category: 'elderly' },
    { title: 'Computer Literacy', desc: 'Teaching basic computer skills to youth to make them employable.', icon: <Monitor size={32} />, category: 'education' },
    { title: 'Awareness Drives', desc: 'Door-to-door campaigns on hygiene, child rights, and environmental protection.', icon: <Users size={32} />, category: 'awareness' },
    { title: 'Cultural Events', desc: 'Organizing plays and functions to give children a stage to showcase their talent.', icon: <Home size={32} />, category: 'cultural' }
  ];

  return (
    <>
      <Helmet>
        <title>What We Do | Hamari Ummeed Mission</title>
      </Helmet>
      
      <Navbar />
      
      <main style={{ paddingTop: '80px' }}>
        <section className={styles.hero} style={{ background: 'var(--primary)', color: 'white', padding: '60px 0' }}>
          <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; What We Do
              </div>
            </motion.div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '16px' }}>Our Daily Mission in <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span></h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px' }}>
              We don't try to change the whole world at once. We focus on our city, making sure our children are educated and our elders are cared for.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="grid-3">
              {fixedActivities.map((act, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.1 }}
                  style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderTop: `4px solid ${act.category === 'education' ? 'var(--accent)' : 'var(--secondary)'}` }}
                >
                  <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>{act.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '12px', color: 'var(--dark)' }}>{act.title}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>{act.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default WhatWeDo;
