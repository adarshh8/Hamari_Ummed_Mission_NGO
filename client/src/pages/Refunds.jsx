import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Refunds = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy | Hamari Ummeed Mission</title>
        <meta name="description" content="Refund and Cancellation Policy for Hamari Ummeed Mission." />
      </Helmet>
      
      <Navbar />
      
      <main style={{ paddingTop: '100px', paddingBottom: '80px', backgroundColor: 'var(--light)', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--white)', padding: '48px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ color: 'var(--muted)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Refund Policy
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '24px', fontSize: '2.5rem' }}>Refund & Cancellation Policy</h1>
            
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Last updated: May 2026</p>
            
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>1. Donation Refunds</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                Hamari Ummeed Mission is grateful for the generous contributions from our donors. We follow a strict policy regarding the refund of donations to ensure transparency and accountability.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                As a general rule, all donations made to Hamari Ummeed Mission are final and non-refundable. Since your contribution is immediately put to use to support our ongoing initiatives for children and the elderly, we cannot process refunds once the transaction is completed.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>2. Exceptional Circumstances</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                We understand that errors can occasionally happen. We will consider a refund request only in the following exceptional circumstances:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text)' }}>
                <li style={{ marginBottom: '8px' }}><strong>Duplicate Transaction:</strong> If an erroneous duplicate payment was charged to your account.</li>
                <li style={{ marginBottom: '8px' }}><strong>Technical Error:</strong> If an incorrect amount was deducted due to a technical glitch on our payment gateway.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>3. How to Request a Refund</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                If you meet the exceptional circumstances mentioned above, you must submit a refund request within <strong>7 days</strong> of the transaction date. Please send an email to <a href="mailto:hamariummeedmission2000@gmail.com" style={{ color: 'var(--secondary)' }}>hamariummeedmission2000@gmail.com</a> containing:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text)' }}>
                <li style={{ marginBottom: '8px' }}>Your full name and contact number</li>
                <li style={{ marginBottom: '8px' }}>Date of transaction</li>
                <li style={{ marginBottom: '8px' }}>Donation amount</li>
                <li style={{ marginBottom: '8px' }}>Transaction ID or Reference Number</li>
                <li style={{ marginBottom: '8px' }}>Reason for the refund request</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '16px' }}>4. Processing Time</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '16px' }}>
                All refund requests will be reviewed by our financial team. We will notify you of the approval or rejection of your refund within 7-10 business days. If approved, the refund will be processed back to the original method of payment within 15-20 business days.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--text)' }}>
                Please note that any transaction fees charged by the payment gateway or bank may be deducted from the refund amount. For further assistance, please <Link to="/contact" style={{ color: 'var(--secondary)' }}>Contact Us</Link>.
              </p>
            </section>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Refunds;
