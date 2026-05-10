import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import useStore from '../store/useStore';
import styles from '../styles/Campaigns.module.css';

const CardSkeleton = () => <div className={`${styles.skeleton}`} style={{ height: '350px', width: '100%', borderRadius: '12px' }}></div>;

const Events = () => {
  const [filter, setFilter] = useState('all');
  const { openDonationModal } = useStore();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => { const res = await api.get('/events'); return res.data.data; }
  });

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Past Events' }
  ];

  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });

  const openLightbox = (images, index) => setLightbox({ isOpen: true, images, index });
  const closeLightbox = () => setLightbox({ isOpen: false, images: [], index: 0 });
  const nextImage = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
  const prevImage = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  const allEvents = eventsData || [];

  const filteredEvents = allEvents.filter(ev => {
    if (filter === 'all') return true;
    return ev.status === filter;
  });

  return (
    <>
      <Helmet>
        <title>Community Events | Hamari Ummeed Mission</title>
      </Helmet>
      
      <Navbar />
      
      <main style={{ paddingTop: '80px' }}>
        <section className={styles.hero} style={{ background: 'var(--primary)', color: 'white', padding: '60px 0' }}>
          <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Events
              </div>
            </motion.div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '16px' }}>Join Us on the Ground</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px' }}>
              From reward ceremonies to door-to-door campaigns. See where we are gathering next and come be a part of it.
            </p>
          </div>
        </section>

        <section className="section bg-light">
          <div className="container">
            <div className={styles.filterBar} style={{ background: 'var(--white)', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <Filter size={20} /> Filter By:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    className={`btn ${filter === cat.id ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => setFilter(cat.id)}
                    style={{ padding: '8px 16px', borderRadius: '20px' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-3">
              {isLoading ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />) : (
                <AnimatePresence>
                  {filteredEvents.map((ev, idx) => {
                    const dateObj = new Date(ev.date);
                    return (
                      <motion.div 
                        key={ev._id || idx}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className={styles.eventCard}
                      >
                        <div className={styles.eventImgWrapper}>
                          {ev.gallery && ev.gallery.length > 0 ? (
                            <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', height: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
                              {ev.gallery.map((img, i) => (
                                <img key={i} src={img} alt={`${ev.title} ${i+1}`} onClick={() => openLightbox(ev.gallery, i)} className={styles.eventImg} style={{ cursor: 'pointer', scrollSnapAlign: 'start', flexShrink: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                              ))}
                            </div>
                          ) : (
                            <img src={ev.coverImage || `https://picsum.photos/400/250?random=${idx}`} alt={ev.title} onClick={() => openLightbox([ev.coverImage || `https://picsum.photos/400/250?random=${idx}`], 0)} className={styles.eventImg} style={{ cursor: 'pointer' }} />
                          )}
                          
                          <div className={styles.eventDateBadge}>
                            <span className={styles.month}>{dateObj.toLocaleString('default', { month: 'short' })}</span>
                            <span className={styles.day}>{dateObj.getDate()}</span>
                          </div>
                          
                          <div className={`${styles.eventStatusBadge} ${ev.status === 'upcoming' ? styles.statusUpcoming : styles.statusPast}`}>
                            {ev.status.toUpperCase()}
                          </div>
                        </div>
                        
                        <div className={styles.eventContent}>
                          <h3 className={styles.eventTitle}>{ev.title}</h3>
                          
                          <div className={styles.eventAboutHeader}>About the Event</div>
                          <p className={styles.eventDesc}>{ev.description}</p>
                          
                          <div className={styles.eventDetailsGrid}>
                            <div className={styles.eventDetailItem}>
                              <div className={styles.eventDetailIcon}><Calendar size={16} /></div>
                              <span>{dateObj.toLocaleDateString()} at {ev.time}</span>
                            </div>
                            <div className={styles.eventDetailItem}>
                              <div className={styles.eventDetailIcon}><MapPin size={16} /></div>
                              <span>{ev.venue}, {ev.city || 'Orai'}</span>
                            </div>
                            <div className={styles.eventDetailItem}>
                              <div className={styles.eventDetailIcon}><Users size={16} /></div>
                              <span>{ev.volunteersInvolved || 0} Volunteers Involved</span>
                            </div>
                          </div>
                          
                          {ev.status === 'upcoming' ? (
                            <button className="btn btn-secondary w-full" style={{ padding: '12px', fontWeight: 'bold' }} onClick={() => window.location.href='/volunteer'}>I Want to Volunteer</button>
                          ) : (
                            <button className="btn btn-outline w-full" style={{ padding: '12px' }} disabled>Event Completed</button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {!isLoading && filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                <h3>No events found for this category.</h3>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {lightbox.isOpen && createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <button onClick={closeLightbox} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10 }}>
              <X size={32} />
            </button>

            {lightbox.images.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                <ChevronLeft size={32} />
              </button>
            )}

            <motion.img 
              key={lightbox.index}
              src={lightbox.images[lightbox.index]} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            />

            {lightbox.images.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                <ChevronRight size={32} />
              </button>
            )}
            
            {lightbox.images.length > 1 && (
              <div style={{ position: 'absolute', bottom: 20, color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            )}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Events;
