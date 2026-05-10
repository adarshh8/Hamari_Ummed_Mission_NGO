import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, Shield, CheckCircle, Heart, Users, BookOpen, Bike, HandHeart, Star, Award } from 'lucide-react';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import anilImg from '../assets/volunteers/Anil.jpg';
import akshayImg from '../assets/volunteers/akshay.jpg';
import deependraImg from '../assets/volunteers/deependra.jpg';
import jituImg from '../assets/volunteers/jitu.jpg';
import kunalImg from '../assets/volunteers/kunal kumar.jpeg';
import pawanImg from '../assets/volunteers/pawan.jpg';
import avantikaImg from '../assets/volunteers/Avantika Tiwari.jpeg';
import arijitImg from '../assets/volunteers/Arijit.jpeg';
import winnerImg from '../assets/images/winner.jpeg';
import styles from '../styles/About.module.css';

const About = () => {
  const { lang } = useStore();
  const openDonationModal = useStore(state => state.openDonationModal);




  // Animation variants
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  // Section Components
  const Hero = () => (
    <section className={styles.hero} style={{ textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <div className={styles.breadcrumb} style={{ display: 'inline-block', marginBottom: '16px' }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; About Us</div>
          <h1 className={styles.heroTitle} style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', fontSize: '4rem' }}>Our Story</h1>
          <p className={styles.heroSub}>Working tirelessly since 2016 for the children and elders of <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span>.</p>
        </motion.div>
      </div>
    </section>
  );

  const MissionVision = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <section className="section" ref={ref}>
        <div className="container">
          <div className={styles.missionVisionGrid}>
            <motion.div className={styles.mvCard} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
              <Target size={40} color="var(--secondary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '16px' }}>Our Mission</h3>
              <p style={{ color: 'var(--text)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                To empower underprivileged children through quality education and to provide dignity and care for the elderly in our city.
              </p>
            </motion.div>
            <motion.div className={styles.mvCard} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ delay: 0.2 }}>
              <Eye size={40} color="var(--secondary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.8rem', color: 'var(--secondary)', marginBottom: '16px' }}>Our Vision</h3>
              <p style={{ color: 'var(--text)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                An <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span> where no child drops out of school due to poverty, and no elder spends their twilight years in loneliness.
              </p>
            </motion.div>
          </div>

          <h3 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '1.5rem', color: 'var(--primary)' }}>Our Core Values</h3>
          <div className={styles.valuesGrid}>
            {[
              { i: <Heart/>, t: 'Compassion' }, 
              { i: <Shield/>, t: 'Transparency' }, 
              { i: <Users/>, t: 'Community-Led' }, 
              { i: <CheckCircle/>, t: 'Accountability' },
              { i: <BookOpen/>, t: 'Empowerment' },
              { i: <HandHeart/>, t: 'Respect' }
            ].map((v, idx) => (
              <motion.div key={idx} className={styles.valueCard} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 * idx }} style={{ backgroundColor: 'var(--light)' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{v.i}</div>
                <div style={{ fontWeight: '600', color: 'var(--dark)' }}>{v.t}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const OurApproach = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const approaches = [
      { step: '01', title: 'Community Identification', desc: `Our volunteers conduct grassroots surveys across ${lang === 'hi' ? 'उरई' : 'Orai'} to identify children from low-income families who have the potential but lack the resources for education.` },
      { step: '02', title: 'Holistic Support', desc: 'We provide free tuition, study materials, and personal mentorship. We focus not just on academics, but on overall confidence building and moral support.' },
      { step: '03', title: 'Rewarding Excellence', desc: 'We closely track student progress. When our students achieve significant milestones, like passing their 10th Board exams, we reward them with bicycles to encourage continued education.' }
    ];

    return (
      <section className="section" ref={ref} style={{ backgroundColor: 'var(--light)', padding: '100px 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }}>Our Approach</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>A structured, community-driven method to ensure every effort creates lasting impact in the lives of the children we serve.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {approaches.map((app, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.2 }} style={{ backgroundColor: 'var(--white)', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '8rem', fontWeight: '900', color: 'var(--light)', opacity: 0.6, lineHeight: 1, zIndex: 0 }}>
                  {app.step}
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>{app.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>{app.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const Team = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <section className={styles.teamSection} ref={ref} style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '16px', color: 'var(--primary)' }}>Locals Leading the Change</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Founded by the youth of the city, our core team is deeply connected to the grassroots realities. We believe that sustainable change requires continuous effort, personal connection, and unwavering dedication to the people we serve.
          </p>
          
          <div className={styles.foundersGrid}>
            <motion.div className={styles.founderCard} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ backgroundColor: 'var(--white)' }}>
              <img src={avantikaImg} alt="Advocate Avantika Tiwari" className={styles.founderImg} />
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--primary)' }}>Adv. Avantika Tiwari</h3>
                <p style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Founder</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Advocate and social reformer, Avantika Tiwari founded Humari Umeed Mission with a vision to ensure every child in <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span> gets the education they deserve.</p>
              </div>
            </motion.div>
            <motion.div className={styles.founderCard} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} style={{ backgroundColor: 'var(--white)' }}>
              <img src={arijitImg} alt="Arijit Gupta" className={styles.founderImg} />
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--primary)' }}>Arijit Gupta</h3>
                <p style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Arijit Gupta manages the day-to-day operations of Humari Umeed Mission, coordinating volunteers, programmes, and community outreach across <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span>.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  const Volunteers = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    
    const volunteersList = [
      { name: "Anil", role: "Teacher", img: anilImg },
      { name: "Akshay", role: "Teacher", img: akshayImg },
      { name: "Deependra", role: "Teacher", img: deependraImg },
      { name: "Jitu", role: "Teacher", img: jituImg },
      { name: "Kunal Kumar", role: "Teacher", img: kunalImg },
      { name: "Pawan", role: "Teacher", img: pawanImg }
    ];

    return (
      <section className="section" ref={ref} style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '16px', color: 'var(--primary)' }}>Our Dedicated Volunteers</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', fontSize: '1.1rem' }}>
            The true backbone of Humari Ummeed Mission. These local heroes dedicate their time and energy to ensure our initiatives reach those who need them most.
          </p>
          
          <div className={styles.boardGrid}>
            {volunteersList.map((vol, idx) => (
              <motion.div 
                key={idx} 
                className={styles.boardCard} 
                initial={{ opacity: 0, y: 30 }} 
                animate={inView ? { opacity: 1, y: 0 } : {}} 
                transition={{ delay: idx * 0.1 }}
              >
                <img src={vol.img} alt={vol.name} className={styles.boardImg} />
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '4px' }}>{vol.name}</h4>
                <p style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '600' }}>{vol.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const StatsStrip = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    return (
      <section className={styles.statsStrip} ref={ref} style={{ backgroundColor: 'var(--primary)' }}>
        <div className={`container ${styles.stripGrid}`}>
          <div><div className={styles.stripNum} style={{ color: 'var(--secondary)' }}>{inView ? <CountUp end={2} duration={2}/> : '0'}+</div><div className={styles.stripLabel} style={{ color: 'var(--white)' }}>Years Active</div></div>
          <div><div className={styles.stripNum} style={{ color: 'var(--secondary)' }}>{inView ? <CountUp end={1} duration={2}/> : '0'}</div><div className={styles.stripLabel} style={{ color: 'var(--white)' }}>City Focus</div></div>
          <div><div className={styles.stripNum} style={{ color: 'var(--secondary)' }}>{inView ? <CountUp end={120} duration={2}/> : '0'}+</div><div className={styles.stripLabel} style={{ color: 'var(--white)' }}>Children Taught</div></div>
          <div><div className={styles.stripNum} style={{ color: 'var(--secondary)' }}>{inView ? <CountUp end={85} duration={2}/> : '0'}+</div><div className={styles.stripLabel} style={{ color: 'var(--white)' }}>Elders Cared For</div></div>
          <div><div className={styles.stripNum} style={{ color: 'var(--secondary)' }}>{inView ? <CountUp end={6} duration={2}/> : '0'}</div><div className={styles.stripLabel} style={{ color: 'var(--white)' }}>Volunteers</div></div>
        </div>
      </section>
    );
  };

  const StudentAchievements = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
      <section className="section" ref={ref}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--primary)', marginBottom: '40px' }}>Celebrating Our Bright Stars</h2>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={inView ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.6 }}
            style={{ 
              backgroundColor: 'var(--light)', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: '1 1 350px' }}>
              <img src={winnerImg} alt="Shivam Secures 1st Rank" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '350px' }} />
            </div>
            <div style={{ flex: '1 1 400px', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--secondary)', color: 'var(--white)', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '24px', alignSelf: 'flex-start' }}>
                EXCELLENCE IN EDUCATION
              </div>
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '16px' }}>
                Shivam Secures 1st Rank!
              </h3>
              <p style={{ color: 'var(--text)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '24px' }}>
                We are incredibly proud of our student Shivam for securing the 1st Rank in his class at Shree Natraj International School for the 2024-25 academic session. His hard work, dedication, and beaming smile serve as an inspiration to all our children.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Award size={48} color="var(--accent)" />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--dark)' }}>Rank-1, Class P.G.</h4>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Annual Examination 2024-25</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  const OurImpact = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

    const pillars = [
      {
        icon: <BookOpen size={36} />,
        color: '#1B4332',
        bg: 'rgba(27,67,50,0.08)',
        title: 'Free Education for All',
        desc: 'We provide completely free coaching classes, study materials, sample papers, and dedicated mentorship to underprivileged children in Orai — ensuring no child misses out on learning due to lack of resources.'
      },
      {
        icon: <Bike size={36} />,
        color: '#F4A01C',
        bg: 'rgba(244,160,28,0.1)',
        title: 'Rewarding Excellence',
        desc: 'Every child who passes their 10th Board exam with outstanding dedication receives a brand new bicycle from our mission — a symbol of our pride, love, and commitment to keeping them on the path of education.'
      },
      {
        icon: <HandHeart size={36} />,
        color: '#E76F51',
        bg: 'rgba(231,111,81,0.1)',
        title: 'Elder Care & Dignity',
        desc: 'Our volunteers regularly visit lonely elders across Orai — spending time with them, listening to their stories, and ensuring they feel respected, valued, and never forgotten by their community.'
      },
      {
        icon: <Star size={36} />,
        color: '#2D6A4F',
        bg: 'rgba(45,106,79,0.08)',
        title: 'Community Volunteering',
        desc: 'A growing team of passionate local volunteers drives every programme we run. From teaching sessions to community events, our volunteers are the heartbeat of Humari Umeed Mission in Orai.'
      }
    ];

    return (
      <section className="section" ref={ref} style={{ backgroundColor: 'var(--light)', padding: '100px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }}>
              How We Create Change
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              Every action we take in <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span> is rooted in love, purpose, and a belief that small acts of kindness can transform lives.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px'
          }}>
            {pillars.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: '16px',
                  padding: '36px 28px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  border: '1px solid transparent',
                  transition: 'all 0.3s',
                  cursor: 'default'
                }}
                whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', borderColor: p.color }}
              >
                <div style={{
                  width: '68px', height: '68px',
                  borderRadius: '16px',
                  background: p.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: p.color,
                  marginBottom: '20px'
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '12px' }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.75' }}>
                  {p.desc}
                </p>
                <div style={{ marginTop: '20px', width: '40px', height: '3px', borderRadius: '2px', background: p.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const JoinUs = () => (
    <section className={styles.ctaSection} style={{ backgroundColor: 'var(--primary)', padding: '100px 0', textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '32px', color: 'var(--white)' }}><span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span> Needs You</h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/volunteer" className="btn btn-secondary btn-lg">Volunteer Locally</Link>
          <button className="btn btn-outline-white btn-lg" onClick={openDonationModal}>Donate Now</button>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>About Us | Hamari Ummeed Mission</title>
        <meta name="description" content="Learn about our journey, our local mission, our dedicated team, and our commitment to transparency in Orai." />
      </Helmet>
      
      <Navbar />
      <main>
        <Hero />
        <MissionVision />
        <OurApproach />
        <Team />
        <Volunteers />
        <StatsStrip />
        <StudentAchievements />
        <OurImpact />
        <JoinUs />
      </main>
      <Footer />
    </>
  );
};

export default About;
