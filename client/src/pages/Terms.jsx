import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Hamari Ummeed Mission</title>
        <meta name="description" content="Terms of Service for Hamari Ummeed Mission." />
      </Helmet>
      
      <Navbar />
      
      <main style={{ paddingTop: '100px', paddingBottom: '80px', backgroundColor: 'var(--light)', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--white)', padding: '48px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ color: 'var(--muted)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Terms of Service
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '24px', fontSize: '2.5rem' }}>Terms of Service</h1>
            
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Last updated: May 2026</p>
            
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>1. Agreement to Terms</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>2. Use License</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                Permission is granted to temporarily download one copy of the materials on Hamari Ummeed Mission's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text)' }}>
                <li style={{ marginBottom: '8px' }}>Modify or copy the materials;</li>
                <li style={{ marginBottom: '8px' }}>Use the materials for any commercial purpose, or for any public display;</li>
                <li style={{ marginBottom: '8px' }}>Attempt to decompile or reverse engineer any software contained on the website;</li>
                <li style={{ marginBottom: '8px' }}>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>3. Disclaimer</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                The materials on Hamari Ummeed Mission's website are provided on an 'as is' basis. Hamari Ummeed Mission makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>4. Limitations</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                In no event shall Hamari Ummeed Mission or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hamari Ummeed Mission's website.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>5. Revisions and Errata</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                The materials appearing on Hamari Ummeed Mission's website could include technical, typographical, or photographic errors. Hamari Ummeed Mission does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms;
