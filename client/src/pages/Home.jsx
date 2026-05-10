import { useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { 
  ChevronDown, BookOpen, Heart, Users,
  Search, MapPin, ArrowRight, Calendar, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import SponsorSection from '../components/SponsorSection';
import styles from '../styles/Home.module.css';
import NGOHome1 from '../assets/images/NGOHome1.jpg';
import districtImg from '../assets/images/districtevent1.jpeg';
import oldageImg from '../assets/images/oldage1.jpeg';
import picnicImg from '../assets/images/picnic.jpeg';

// Reusable Skeletons
const StatSkeleton = () => <div className={`${styles.skeleton}`} style={{ height: '80px', width: '100%' }}></div>;
const CardSkeleton = () => <div className={`${styles.skeleton}`} style={{ height: '350px', width: '100%', borderRadius: '12px' }}></div>;
const GallerySkeleton = () => <div className={`${styles.skeleton}`} style={{ height: '250px', width: '100%', borderRadius: '12px', marginBottom: '24px' }}></div>;

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { openDonationModal, lang } = useStore();

  // --- API Queries ---
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => { const res = await api.get('/stats'); return res.data.data; }
  });

  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => { const res = await api.get('/activities'); return res.data.data; }
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => { const res = await api.get('/events/upcoming'); return res.data.data; }
  });

  const { data: testimonialsData, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => { const res = await api.get('/testimonials'); return res.data.data; }
  });

  const { data: galleryData, isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => { const res = await api.get('/gallery?limit=6'); return res.data.data; }
  });


  // --- 2. STATS BAR ---
  const StatsBar = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    
    return (
      <div className={`container ${styles.statsWrapper}`} ref={ref}>
        <div className={styles.statsGrid}>
          {statsLoading ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />) : (
            <>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{inView ? <CountUp end={120} duration={2.5} separator="," /> : '0'}+</div>
                <div className={styles.statLabel}>Children Educated</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{inView ? <CountUp end={85} duration={2.5} separator="," /> : '0'}+</div>
                <div className={styles.statLabel}>Elders Supported</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{inView ? <CountUp end={6} duration={2.5} /> : '0'}</div>
                <div className={styles.statLabel}>Active Volunteers</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{inView ? <CountUp end={2023} duration={2.5} useEasing={false} /> : '0'}</div>
                <div className={styles.statLabel}>Established Since</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // --- 3. ABOUT SNIPPET ---
  const AboutSnippet = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    
    return (
      <section className="section" ref={ref} style={{ overflow: 'hidden', backgroundColor: 'var(--light)' }}>
        <div className={`container ${styles.aboutGrid}`}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <img src={NGOHome1} alt="About Hamari Ummeed" className={styles.aboutImage} style={{ borderRadius: '16px' }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <div className={styles.sectionLine}></div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px', color: 'var(--primary)' }}>Deeply Rooted in {lang === 'hi' ? 'उरई' : 'Orai'}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '16px', lineHeight: '1.8' }}>
              Founded in 2016, Hamari Ummeed Mission was born out of a simple desire: to uplift the underprivileged right here in our city. We focus our energy strictly on <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span>, ensuring our impact is deep and meaningful.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '24px', lineHeight: '1.8' }}>
              We believe that true change starts at home. By educating our children and respecting our elders, we are building a stronger, more compassionate community.
            </p>
            <div className={styles.valuePills}>
              <div className={styles.pill}><Heart size={16} color="var(--accent)" /> Compassion</div>
              <div className={styles.pill}><Users size={16} color="var(--accent)" /> Community</div>
              <div className={styles.pill}><BookOpen size={16} color="var(--accent)" /> Education</div>
            </div>
            <Link to="/about" className="btn btn-primary" style={{ marginTop: '24px' }}>Read Our Story <ArrowRight size={18} style={{ marginLeft: '8px' }}/></Link>
          </motion.div>
        </div>
      </section>
    );
  };

  // --- 4. WHAT WE DO ---
  const WhatWeDoSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    const initiatives = [
      {
        title: "Children's Education",
        category: 'Education',
        desc: 'We run free tuition classes and distribute books & stationery to underprivileged children in Orai, helping them stay in school and build a brighter future.',
        img: districtImg,
        icon: '📚'
      },
      {
        title: 'Elder Care & Support',
        category: 'Elder Care',
        desc: 'Our volunteers make regular visits to elderly citizens in Orai — spending time with them, providing companionship and distributing essential medicines.',
        img: oldageImg,
        icon: '🤝'
      },
      {
        title: 'Community Events',
        category: 'Community',
        desc: 'From Holi celebrations to educational trips, we bring together children, elders and volunteers to create joyful memories that strengthen our community.',
        img: picnicImg,
        icon: '🎉'
      }
    ];

    return (
      <section id="what-we-do" className={styles.programsSection} ref={ref}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 style={{ color: 'var(--primary)' }}>What We Do</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Our core focus areas in the community of Orai</p>
          </div>
          
          <motion.div className="grid-3" initial="hidden" animate={inView ? "visible" : "hidden"} variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            {initiatives.map((act, idx) => (
              <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className={styles.programCard} style={{ backgroundColor: 'var(--white)' }}>
                <div className={styles.programImgWrapper}>
                  <img src={act.img} alt={act.title} className={styles.programImg} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  <div className={styles.badge} style={{ backgroundColor: 'var(--secondary)', color: 'var(--dark)' }}>{act.category}</div>
                </div>
                <div className={styles.programContent}>
                  <h3 className={styles.programTitle} style={{ fontFamily: 'var(--font-heading)' }}>{act.icon} {act.title}</h3>
                  <p className={styles.programDesc}>{act.desc}</p>
                  <Link to="/what-we-do" style={{ color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  };

  // --- 5. UPCOMING DRIVES ---
  const UpcomingDrives = () => {
    return (
      <section className="section bg-light" id="events">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '8px', color: 'var(--primary)' }}>Upcoming Volunteer Drives</h2>
              <p style={{ color: 'var(--text)' }}>Join us on the ground and make a real difference.</p>
            </div>
            <Link to="/events" className="btn btn-outline desktop-only">View All Drives <ArrowRight size={16} style={{ marginLeft: '8px' }}/></Link>
          </div>

          {eventsLoading ? (
            <div className="grid-3">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : eventsData?.length > 0 ? (
            <div className="grid-3">
              {eventsData.slice(0, 3).map((ev, idx) => {
                const dateObj = new Date(ev.date);
                return (
                  <div key={idx} className={styles.campaignCard} style={{ backgroundColor: 'var(--white)' }}>
                    <div className={styles.campaignContent}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '12px', color: 'var(--primary)' }}>{ev.title}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '16px', flex: 1 }}>{ev.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', marginBottom: '8px' }}>
                        <Calendar size={18} color="var(--secondary)" />
                        <span>{dateObj.toLocaleDateString()} at {ev.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', marginBottom: '24px' }}>
                        <MapPin size={18} color="var(--secondary)" />
                        <span>{ev.venue}</span>
                      </div>
                      <button className="btn btn-secondary w-full">I Want to Volunteer</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗓️</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '12px' }}>Coming Soon</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 28px', lineHeight: '1.7' }}>
                We're planning our next volunteer drive in {lang === 'hi' ? 'उरई' : 'Orai'}. Stay tuned — follow us or register as a volunteer to be the first to know!
              </p>
              <Link to="/volunteer" className="btn btn-primary">Register as a Volunteer <UserCheck size={18} style={{ marginLeft: '8px' }} /></Link>
            </div>
          )}
        </div>
      </section>
    );
  };

  // --- 6. GALLERY PREVIEW ---
  const GalleryPreview = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
      <section className="section" ref={ref} style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '12px' }}>
              From the Ground
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>
              Real moments captured during our work in {lang === 'hi' ? 'उरई' : 'Orai'}.
            </p>
          </div>

          {galleryLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {Array(6).fill(0).map((_, i) => <GallerySkeleton key={i} />)}
            </div>
          ) : galleryData?.length > 0 ? (
            <>
              <motion.div
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}
              >
                {galleryData.slice(0, 6).map((img, idx) => (
                  <motion.div
                    key={img._id || idx}
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      aspectRatio: idx === 0 || idx === 3 ? '4/3' : '1/1',
                      position: 'relative',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || 'Gallery'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {img.caption && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                        color: 'white', padding: '20px 12px 12px', fontSize: '0.85rem', fontWeight: '500'
                      }}>
                        {img.caption}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/gallery" className="btn btn-outline btn-lg">
                  View Full Gallery <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📷</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '8px' }}>Gallery Coming Soon</h3>
              <p style={{ color: 'var(--muted)' }}>Photos from our activities will appear here soon.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  // --- 7. VOLUNTEER CTA BAND ---
  const VolunteerBand = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    return (
      <section className={styles.volunteerBand} ref={ref} style={{ backgroundColor: 'var(--primary)' }}>
        <motion.div className={styles.volunteerLeft} initial={{ x: -100, opacity: 0 }} animate={inView ? { x: 0, opacity: 1 } : {}} transition={{ duration: 0.8 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '16px', color: 'var(--white)' }}>Give Your Time.</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '400px' }}>Join the youth of <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span> actively working on the ground.</p>
          <ul className={styles.checkList}>
            <li><div style={{ background: 'var(--secondary)', color: 'var(--dark)', borderRadius: '50%', padding: '4px' }}>✓</div> Teach local children</li>
            <li><div style={{ background: 'var(--secondary)', color: 'var(--dark)', borderRadius: '50%', padding: '4px' }}>✓</div> Spend time with elders</li>
            <li><div style={{ background: 'var(--secondary)', color: 'var(--dark)', borderRadius: '50%', padding: '4px' }}>✓</div> Help organize events</li>
          </ul>
          <div>
            <Link to="/volunteer" className="btn btn-secondary">Become a Volunteer</Link>
          </div>
        </motion.div>
        
        <motion.div className={styles.volunteerRight} initial={{ x: 100, opacity: 0 }} animate={inView ? { x: 0, opacity: 1 } : {}} transition={{ duration: 0.8 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '16px', color: 'var(--white)' }}>Donate Resources.</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '400px', marginBottom: '32px' }}>Your local financial support ensures no child stops learning.</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', color: 'white' }}>₹500</div>
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', color: 'white' }}>₹1000</div>
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', color: 'white' }}>₹5000</div>
          </div>
          <div>
            <button className="btn btn-outline-white" onClick={openDonationModal}>Make a Donation</button>
          </div>
        </motion.div>
      </section>
    );
  };

  return (
    <>
      <Helmet>
        <title>Home | Hamari Ummeed Mission</title>
        <meta name="description" content="Hamari Ummeed Mission is a local NGO in Orai dedicated to children's education and elder care." />
      </Helmet>
      
      <motion.div className={styles.scrollProgress} style={{ scaleX, background: 'var(--accent)' }} />
      
      <Navbar />
      
      <main>
        <HeroSlider />
        <StatsBar />
        <AboutSnippet />
        <WhatWeDoSection />
        <UpcomingDrives />
        <SponsorSection />
        <GalleryPreview />
        <VolunteerBand />
      </main>

      <Footer />
    </>
  );
};

export default Home;
