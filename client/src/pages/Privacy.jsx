import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useStore from '../store/useStore';

const Privacy = () => {
  const { lang } = useStore();
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Hamari Ummeed Mission</title>
        <meta name="description" content="Privacy Policy for Hamari Ummeed Mission." />
      </Helmet>
      
      <Navbar />
      
      <main style={{ paddingTop: '100px', paddingBottom: '80px', backgroundColor: 'var(--light)', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--white)', padding: '48px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ color: 'var(--muted)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Privacy Policy
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '24px', fontSize: '2.5rem' }}>Privacy Policy</h1>
            
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Last updated: May 2026</p>
            
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>1. Information We Collect</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                At Hamari Ummeed Mission, we collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our services, when participating in activities on the site (such as making a donation or applying to volunteer), or otherwise contacting us.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                The personal information that we collect depends on the context of your interactions with us and the site. The personal information we collect can include: names, phone numbers, email addresses, mailing addresses, and payment information.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>2. How We Use Your Information</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                We use personal information collected via our website for a variety of organizational purposes described below:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text)' }}>
                <li style={{ marginBottom: '8px' }}>To send administrative information to you.</li>
                <li style={{ marginBottom: '8px' }}>To process and manage your donations.</li>
                <li style={{ marginBottom: '8px' }}>To evaluate volunteer applications.</li>
                <li style={{ marginBottom: '8px' }}>To respond to user inquiries and offer support.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>3. Will Your Information Be Shared With Anyone?</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell, rent, or trade any of your personal information with third parties for their promotional purposes.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>4. Security of Your Information</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>5. Contact Us</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                If you have questions or comments about this policy, you may email us at <strong>hamariummeedmission2000@gmail.com</strong> or by post to:<br/><br/>
                Hamari Ummeed Mission<br/>
                Near Mandapam Guest House &bull; Palledar Union Chabutra, Grain Market (Galla Mandi), <span className="notranslate">{lang === 'hi' ? 'उरई' : 'Orai'}</span><br/>
                Uttar Pradesh, India
              </p>
            </section>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Privacy;
