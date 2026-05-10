import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Share2, BookOpen, Droplet, Stethoscope, Sprout, GraduationCap, ShieldCheck, Lock, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../services/api';
import styles from '../styles/Campaigns.module.css';

const Campaigns = () => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sliderValue, setSliderValue] = useState(2500);

  const openDonationModal = useStore(state => state.openDonationModal);

  // Fetch Campaigns
  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ['campaigns', { filter, sort, page }],
    queryFn: async () => {
      let url = `/campaigns?page=${page}&limit=9`;
      if (filter !== 'All') {
        if (filter === 'Active') url += '&status=active';
        if (filter === 'Completed') url += '&status=completed';
      }
      
      // Since backend doesn't have complex native sorting out of the box without mapping,
      // we will sort client side for this demo, or append simple sort params if supported.
      // For now, we fetch the page and sort client side if needed, or pass &sort=-createdAt
      
      const res = await api.get(url);
      return res.data;
    }
  });

  const { data: featuredData } = useQuery({
    queryKey: ['featuredCampaigns'],
    queryFn: async () => {
      const res = await api.get('/campaigns/featured');
      return res.data.data;
    }
  });

  const featuredCampaign = featuredData?.[0]; // Get the top one

  // Client side search
  let displayCampaigns = campaignsData?.data || [];
  if (search) {
    displayCampaigns = displayCampaigns.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  }

  // Client side sorting fallback
  if (sort === 'most_funded') displayCampaigns.sort((a, b) => b.raised - a.raised);
  if (sort === 'goal_amount') displayCampaigns.sort((a, b) => b.goal - a.goal);
  // 'newest' is default from backend usually, or we can sort by _id
  if (sort === 'newest') displayCampaigns.sort((a, b) => (a._id < b._id ? 1 : -1));

  const totalPages = campaignsData?.pagination?.total 
    ? Math.ceil(campaignsData.pagination.total / 9) 
    : 1;

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/campaigns/${id}`);
    toast.success('Link copied to clipboard!');
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const Hero = () => (
    <section className={styles.hero}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Campaigns
          </div>
          <h1 className={styles.heroTitle}>Make a Difference Today</h1>
          <p style={{ fontSize: '1.2rem', color: '#ffccb3' }}>Every minute counts. Your support brings hope to those in urgent need.</p>
          <div className={styles.liveCounter}>
            <div className={styles.pulseDot}></div>
            124 people donated in the last 24 hours
          </div>
        </motion.div>
      </div>
    </section>
  );

  const FilterSortBar = () => (
    <div className={styles.filterBar}>
      <div className="container">
        <div className={styles.filterControls}>
          <div className={styles.tabs}>
            {['All', 'Active', 'Urgent', 'Completed'].map(t => (
              <button 
                key={t} 
                className={`${styles.tab} ${filter === t ? styles.active : ''}`}
                onClick={() => { setFilter(t); setPage(1); }}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className={styles.searchSort}>
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="most_funded">Most Funded</option>
              <option value="goal_amount">Goal Amount</option>
            </select>
          </div>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '16px' }}>
          Showing {displayCampaigns.length} campaigns
        </div>
      </div>
    </div>
  );

  const CampaignsGrid = () => (
    <section className={styles.campaignsSection}>
      <div className="container">
        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => <motion.div key={i} className="skeleton" style={{ height: '500px', borderRadius: '16px' }}/>)
            ) : displayCampaigns.map((camp) => {
              const daysLeft = calculateDaysLeft(camp.endDate);
              const percent = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
              
              let badgeClass = styles.badgeOngoing;
              let badgeText = "ONGOING";
              if (camp.urgencyLevel === 'critical') { badgeClass = styles.badgeCritical; badgeText = "CRITICAL"; }
              else if (camp.urgencyLevel === 'high') { badgeClass = styles.badgeUrgent; badgeText = "URGENT"; }

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={camp._id} 
                  className={styles.card}
                >
                  <div className={styles.imgWrapper}>
                    <div className={`${styles.urgencyBadge} ${badgeClass}`}>{badgeText}</div>
                    {daysLeft !== null && (
                      <div className={`${styles.daysBadge} ${daysLeft < 7 ? styles.red : ''}`}>
                        {daysLeft} days left
                      </div>
                    )}
                    <img src={camp.coverImage || `https://picsum.photos/400/225?random=${camp._id}`} alt={camp.title} />
                  </div>
                  
                  <div className={styles.cardBody}>
                    <div className={styles.category}>{camp.category}</div>
                    <h3 className={styles.title}>{camp.title}</h3>
                    <p className={styles.desc}>{camp.description}</p>
                    
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>
                      📍 🇮🇳 {camp.location || 'India'}
                    </div>

                    <div className={styles.progressSection}>
                      <div className={styles.progressTrack}>
                        <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }}></motion.div>
                      </div>
                      <div className={styles.statsText}>
                        <div><span className={styles.raisedAmt}>₹{camp.raised.toLocaleString()}</span> raised</div>
                        <div>of ₹{camp.goal.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button className={`btn btn-secondary ${styles.donateBtn}`} onClick={() => openDonationModal(camp)}>Donate Now</button>
                      <button className={styles.shareBtn} onClick={() => handleCopyLink(camp._id)} title="Share Campaign"><Share2 size={20}/></button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && !search && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => { setPage(p => p-1); window.scrollTo(0, 400); }}>&lt;</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}
                onClick={() => { setPage(i+1); window.scrollTo(0, 400); }}
              >
                {i + 1}
              </button>
            ))}
            <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => { setPage(p => p+1); window.scrollTo(0, 400); }}>&gt;</button>
          </div>
        )}
      </div>
    </section>
  );

  const Calculator = () => {
    const getImpact = (val) => {
      if (val < 1000) return { icon: <BookOpen size={48}/>, text: `${Math.floor(val/500)} child's school supplies for a year` };
      if (val < 2500) return { icon: <Droplet size={48}/>, text: `Clean water for a family for ${Math.floor((val/1000)*6)} months` };
      if (val < 5000) return { icon: <Stethoscope size={48}/>, text: `Medical checkup for ${Math.floor((val/2500)*5)} children` };
      if (val < 10000) return { icon: <Sprout size={48}/>, text: `Seeds and tools for ${Math.floor(val/5000)} farming families` };
      return { icon: <GraduationCap size={48}/>, text: `Sponsor ${Math.floor(val/10000)} girl's education for 1 year` };
    };

    const impact = getImpact(sliderValue);

    return (
      <section className={styles.calcSection}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>See What Your Donation Does</h2>
          <div className={styles.sliderWrapper}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
              ₹{sliderValue.toLocaleString()}
            </div>
            <input 
              type="range" 
              min="500" 
              max="50000" 
              step="500" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(Number(e.target.value))} 
              style={{ margin: '24px 0' }}
            />
            <AnimatePresence mode="wait">
              <motion.div 
                key={impact.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={styles.impactResult}
              >
                <div style={{ color: 'var(--secondary)' }}>{impact.icon}</div>
                <div>{impact.text}</div>
              </motion.div>
            </AnimatePresence>
            
            <button className="btn btn-secondary btn-lg" style={{ marginTop: '24px' }} onClick={openDonationModal}>
              Donate ₹{sliderValue.toLocaleString()}
            </button>
          </div>
        </div>
      </section>
    );
  };

  const FeaturedTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
      const target = new Date(endDate).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = target - now;
        if (distance < 0) {
          clearInterval(interval);
          return;
        }
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [endDate]);

    return (
      <div className={styles.timerBox}>
        <div className={styles.timeUnit}><div className={styles.timeVal}>{timeLeft.d}</div><div className={styles.timeLabel}>Days</div></div>
        <div className={styles.timeUnit}><div className={styles.timeVal}>{timeLeft.h}</div><div className={styles.timeLabel}>Hours</div></div>
        <div className={styles.timeUnit}><div className={styles.timeVal}>{timeLeft.m}</div><div className={styles.timeLabel}>Mins</div></div>
        <div className={styles.timeUnit}><div className={styles.timeVal}>{timeLeft.s}</div><div className={styles.timeLabel}>Secs</div></div>
      </div>
    );
  };

  const FeaturedSpotlight = () => {
    if (!featuredCampaign) return null;
    return (
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.featuredCard}>
            <div className={styles.featuredImg}>
              <img src={featuredCampaign.coverImage || "https://picsum.photos/800/600?random=featured"} alt="Featured" />
            </div>
            <div className={styles.featuredContent}>
              <div style={{ color: 'var(--error)', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={styles.pulseDot} style={{ background: 'var(--error)' }}></div> URGENT APPEAL
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '16px' }}>{featuredCampaign.title}</h2>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '32px' }}>{featuredCampaign.description}</p>
              
              {featuredCampaign.endDate && <FeaturedTimer endDate={featuredCampaign.endDate} />}
              
              <div className={styles.progressSection}>
                <div className={styles.progressTrack} style={{ height: '12px' }}>
                  <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (featuredCampaign.raised/featuredCampaign.goal)*100)}%` }} transition={{ duration: 1 }}></motion.div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>₹{featuredCampaign.raised.toLocaleString()} raised</span>
                  <span>Goal: ₹{featuredCampaign.goal.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button className="btn btn-secondary btn-lg" onClick={() => openDonationModal(featuredCampaign)}>Donate Now</button>
                <button className="btn btn-outline btn-lg" onClick={() => handleCopyLink(featuredCampaign._id)}>Share</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const TrustSignals = () => (
    <section className={styles.trustSection}>
      <div className="container">
        <div className={styles.trustGrid}>
          <div className={styles.trustCard}>
            <ShieldCheck size={40} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
            <h4>80G Tax Exemption</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px' }}>50% tax deduction available</p>
          </div>
          <div className={styles.trustCard}>
            <Lock size={40} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
            <h4>Secure Payment</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px' }}>128-bit encryption via Razorpay</p>
          </div>
          <div className={styles.trustCard}>
            <Eye size={40} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
            <h4>100% Transparent</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px' }}>Direct tracking to beneficiaries</p>
          </div>
          <div className={styles.trustCard}>
            <CheckCircle size={40} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
            <h4>FCRA Approved</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px' }}>Authorized for global funds</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>Campaigns | HopeRise Foundation</title>
        <meta name="description" content="Make a difference today. View our active campaigns and donate to a cause." />
      </Helmet>

      <main>
        <Hero />
        <FilterSortBar />
        <CampaignsGrid />
        <FeaturedSpotlight />
        <Calculator />
        <TrustSignals />
      </main>
    </>
  );
};

export default Campaigns;
