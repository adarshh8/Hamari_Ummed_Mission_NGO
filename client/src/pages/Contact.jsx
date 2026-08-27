import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Phone, Mail, ChevronDown, ChevronUp, Linkedin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Contact.module.css';

const schema = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  subject: yup.string().required('Subject is required'),
  category: yup.string().required('Please select a category'),
  message: yup.string().min(20, 'Message must be at least 20 characters').max(1000, 'Maximum 1000 characters').required('Message is required'),
  honeypot: yup.string() // Should be empty
});

const Contact = () => {
  const { lang } = useStore();
  const [activeTab, setActiveTab] = useState('main');
  const [openFaq, setOpenFaq] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const messageVal = watch('message', '');

  const contactMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/contact', data);
      return res.data;
    },
    onSuccess: () => {
      setFormSuccess(true);
      reset();
      toast.success("Message sent successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to send message. Please try again.");
    }
  });

  const onSubmit = (data) => {
    if (data.honeypot) return; // Spam detected
    contactMutation.mutate(data);
  };

  const offices = {
    main: { name: 'Head Office', address: `Near Mandapam Guest House • Palledar Union Chabutra, Grain Market (Galla Mandi), ${lang === 'hi' ? 'उरई' : 'Orai'}, Uttar Pradesh – 285001`, phone: '+91-96962-94789', email: 'hamariummeedmission2000@gmail.com', map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114631.32832560372!2d79.38713295254117!3d25.992224097489246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3975d2757041a027%3A0xc6e4b55e396bb7db!2sOrai%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin' }
  };

  const faqs = [
    { q: 'Is my donation tax deductible?', a: 'Yes. All donations are eligible for 50% tax deduction under Section 80G of the Income Tax Act.' },
    { q: 'Can I visit the tuition center?', a: 'Absolutely! We encourage locals to visit our center during evening hours (4 PM - 7 PM).' },
    { q: 'Do you accept old clothes or books?', a: 'Yes, we accept course books and winter clothes in good condition at our head office.' },
    { q: 'How can I volunteer if I work full time?', a: 'You can volunteer on weekends for our elder care visits or during special events.' }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Hamari Ummeed Mission</title>
        <meta name="description" content="Get in touch with Hamari Ummeed Mission." />
      </Helmet>

      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section className={styles.hero} style={{ background: 'var(--primary)', textAlign: 'center' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Contact Us
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.heroTitle} style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)' }}>Get In Touch</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={styles.heroSub} style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px' }}>
              We'd love to hear from you — locals, volunteers, partners, and well-wishers.
            </motion.p>
          </div>
        </section>

        {/* Info Cards */}
        <div className="container" style={{ marginTop: '40px' }}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard} style={{ backgroundColor: 'var(--light)' }}>
              <div className={styles.infoIcon} style={{ color: 'var(--accent)' }}><MapPin size={32} /></div>
              <h3 className={styles.infoTitle} style={{ color: 'var(--dark)' }}>Our Office</h3>
              <p className={styles.infoDetail}>Near Mandapam Guest House &bull; Palledar Union Chabutra<br/>Grain Market (Galla Mandi), UP – 285001</p>
              <a href="#map" className="btn btn-outline">View on Map</a>
            </div>
            <div className={styles.infoCard} style={{ backgroundColor: 'var(--light)' }}>
              <div className={styles.infoIcon} style={{ color: 'var(--accent)' }}><Phone size={32} /></div>
              <h3 className={styles.infoTitle} style={{ color: 'var(--dark)' }}>Call Us</h3>
              <p className={styles.infoDetail}>Phone: +91 96962 94789<br/>WhatsApp: +91 96962 94789</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Mon–Sat 10AM–6PM</p>
            </div>
            <div className={styles.infoCard} style={{ backgroundColor: 'var(--light)' }}>
              <div className={styles.infoIcon} style={{ color: 'var(--accent)' }}><Mail size={32} /></div>
              <h3 className={styles.infoTitle} style={{ color: 'var(--dark)' }}>Email Us</h3>
              <p className={styles.infoDetail}>hamariummeedmission2000@gmail.com</p>
              <a href="mailto:hamariummeedmission2000@gmail.com" className="btn btn-outline">Send Email</a>
            </div>
          </div>
        </div>

        {/* Form & Map Section */}
        <section className={styles.contactSection}>
          <div className="container">
            <div className={styles.mainGrid}>
              
              {/* Form */}
              <div className={styles.formWrapper} style={{ boxShadow: 'var(--shadow-md)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '24px', color: 'var(--primary)' }}>Send us a Message</h2>
                
                {formSuccess ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--light)', borderRadius: '12px' }}>
                    <div style={{ color: 'var(--secondary)', fontSize: '3rem', marginBottom: '16px' }}>✓</div>
                    <h3 style={{ marginBottom: '16px', color: 'var(--dark)' }}>Thank you for reaching out!</h3>
                    <p style={{ color: 'var(--muted)' }}>We have received your message and will get back to you soon.</p>
                    <button className="btn btn-outline" style={{ marginTop: '24px' }} onClick={() => setFormSuccess(false)}>Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register('honeypot')} className={styles.honeypot} tabIndex="-1" autoComplete="off" />
                    
                    <div className={styles.formGroup}>
                      <label>Full Name *</label>
                      <input type="text" className={`${styles.formControl} ${errors.name ? styles.isInvalid : ''}`} {...register('name')} />
                      {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className={styles.formGroup}>
                        <label>Email Address *</label>
                        <input type="email" className={`${styles.formControl} ${errors.email ? styles.isInvalid : ''}`} {...register('email')} />
                        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone (Optional)</label>
                        <input type="text" className={styles.formControl} {...register('phone')} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className={styles.formGroup}>
                        <label>Subject *</label>
                        <input type="text" className={`${styles.formControl} ${errors.subject ? styles.isInvalid : ''}`} {...register('subject')} />
                        {errors.subject && <p className={styles.errorText}>{errors.subject.message}</p>}
                      </div>
                      <div className={styles.formGroup}>
                        <label>Category *</label>
                        <select className={`${styles.formControl} ${errors.category ? styles.isInvalid : ''}`} {...register('category')}>
                          <option value="">Select a category</option>
                          <option value="General">General Inquiry</option>
                          <option value="Donation">Donation Query</option>
                          <option value="Volunteering">Volunteer</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Media">Media</option>
                        </select>
                        {errors.category && <p className={styles.errorText}>{errors.category.message}</p>}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Your Message *</label>
                      <textarea 
                        className={`${styles.formControl} ${errors.message ? styles.isInvalid : ''}`} 
                        rows="5" 
                        {...register('message')} 
                      ></textarea>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{errors.message && <p className={styles.errorText} style={{ marginTop: 0 }}>{errors.message.message}</p>}</div>
                        <span className={styles.charCount}>{messageVal.length}/1000</span>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-secondary w-full" disabled={contactMutation.isPending}>
                      {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Map & Tabs */}
              <div id="map">
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '24px', color: 'var(--primary)' }}>Find Us Here</h2>
                
                <div className={styles.officeDetails} style={{ backgroundColor: 'var(--white)', borderTop: '4px solid var(--accent)' }}>
                  <p><strong>Address:</strong> {offices.main.address}</p>
                  <p style={{ margin: '8px 0' }}><strong>Phone:</strong> {offices.main.phone}</p>
                  <p><strong>Email:</strong> {offices.main.email}</p>
                </div>

                <div className={styles.mapWrapper}>
                  <iframe src={offices.main.map} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="office map"></iframe>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className={styles.socialsSection} style={{ backgroundColor: 'var(--light)' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: 'var(--primary)' }}>Connect With Our Community</h2>
            <div className={styles.socialGrid} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px' }}>
              {[
                { i: <Instagram size={32}/>, n: 'Instagram', h: '@hamari_ummeed_mission', c: '2.5K', color: '#E1306C', href: 'https://www.instagram.com/hamari_ummeed_mission/' },
                { i: <Facebook size={32}/>, n: 'Facebook', h: '/humariumeed', c: '4.2K', color: '#1877F2', href: 'https://www.facebook.com/share/1GoQWUNw49/' }
              ].map((s, idx) => (
                <a key={idx} href={s.href} target={s.href !== '#' ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className={styles.socialCard} style={{ '--brand-color': s.color, backgroundColor: 'var(--white)', minWidth: '200px' }}>
                    <div className={styles.sIcon} style={{ color: s.color }}>{s.i}</div>
                    <div className={styles.sCount} style={{ color: 'var(--dark)' }}>{s.c}</div>
                    <div className={styles.sHandle}>{s.h}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className={styles.faqSection}>
          <div className={`container ${styles.faqContainer}`}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: 'var(--primary)' }}>Frequently Asked Questions</h2>
            <div>
              {faqs.map((faq, idx) => (
                <div key={idx} className={styles.accordionItem} style={{ borderBottomColor: 'var(--secondary)' }}>
                  <button className={styles.accordionHeader} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    {faq.q}
                    {openFaq === idx ? <ChevronUp size={20} color="var(--accent)"/> : <ChevronDown size={20} color="var(--accent)"/>}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionContent}>
                          <p style={{ paddingBottom: '20px', color: 'var(--text)' }}>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default Contact;
