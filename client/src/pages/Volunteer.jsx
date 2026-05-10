import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Users, Heart, Shield, Globe, Award, Briefcase, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Volunteer.module.css';

// 195 Countries List Placeholder
const locations = ["Local City", "Kanpur", "Jhansi", "Other UP City", "Other State"];

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10,15}$/, 'Phone number must be between 10-15 digits').required('Phone is required'),
  dob: yup.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), 'You must be at least 16 years old').required('Date of Birth is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  education: yup.string(),
  occupation: yup.string(),
  availability: yup.string().required('Please select availability'),
  message: yup.string().min(50, 'Minimum 50 characters').max(500, 'Maximum 500 characters').required('This field is required'),
});

const Volunteer = () => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { city: 'Local City' }
  });

  const messageVal = watch('message', '');

  const volunteerMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post('/volunteers', data);
    },
    onSuccess: (res) => {
      setFormSuccess(true);
      setRefNumber(`HR-${res.data.data._id.substring(0, 8).toUpperCase()}`);
      reset();
      setTags([]);
      setAreasOfInterest([]);
      window.scrollTo({ top: document.getElementById('apply').offsetTop, behavior: 'smooth' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Application failed. Please try again.");
    }
  });

  const onSubmit = (data) => {
    if (areasOfInterest.length === 0) {
      toast.error("Please select at least one area of interest.");
      return;
    }

    const interestMap = {
      'Teaching Children': 'teaching',
      'Elderly Care': 'elderly-care',
      'Event Management': 'event-help',
      'Social Media / Tech': 'content',
      'Fundraising': 'fundraising'
    };

    const age = new Date().getFullYear() - new Date(data.dob).getFullYear();
    
    const finalData = {
      ...data,
      age,
      skills: tags,
      areaOfInterest: areasOfInterest.map(i => interestMap[i] || 'other')
    };
    
    volunteerMutation.mutate(finalData);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleInterest = (interest) => {
    if (areasOfInterest.includes(interest)) {
      setAreasOfInterest(areasOfInterest.filter(i => i !== interest));
    } else {
      setAreasOfInterest([...areasOfInterest, interest]);
    }
  };

  // --- SECTIONS ---
  const Hero = () => (
    <section className={styles.hero} style={{ background: 'var(--primary)', textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> &gt; Volunteer
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.heroTitle} style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)' }}>Your City Needs You.</motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={styles.heroStat} style={{ color: 'var(--secondary)' }}>
          85 active volunteers transforming our community
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={styles.heroActions}>
          <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}>Apply Now</button>
          <button className="btn btn-outline-white btn-lg" onClick={() => document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
        </motion.div>
      </div>
    </section>
  );

  const Benefits = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const items = [
      { i: <Heart size={32} color="var(--accent)"/>, t: 'Local Impact', d: 'Experience the joy of directly impacting lives in your own city.' },
      { i: <Award size={32} color="var(--accent)"/>, t: 'Certificate of Service', d: 'Receive a recognized certificate for your dedicated hours.' },
      { i: <Shield size={32} color="var(--accent)"/>, t: 'Skills Growth', d: 'Develop leadership, empathy, and crisis management skills.' },
      { i: <Users size={32} color="var(--accent)"/>, t: 'Community Network', d: 'Build lasting friendships with local people who share your values.' }
    ];

    return (
      <section id="benefits" className={styles.benefitsSection} ref={ref}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--primary)' }}>What You Gain</h2>
          <div className={styles.benefitsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {items.map((item, idx) => (
              <motion.div key={idx} className={styles.benefitCard} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.1 }} style={{ backgroundColor: 'var(--light)' }}>
                <div className={styles.benefitIcon}>{item.i}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--dark)' }}>{item.t}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const Roles = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <section className={styles.rolesSection} ref={ref} style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--primary)' }}>Volunteer Roles Available</h2>
          <div className={styles.rolesGrid}>
            {[
              { t: 'Evening Tutor', l: 'On-site (Local)', c: '10h/week' },
              { t: 'Elder Care Companion', l: 'On-site (Local)', c: '5h/week' },
              { t: 'Event Organizer', l: 'On-site / Flexible', c: 'Events only' },
              { t: 'Social Media Manager', l: 'Remote', c: '5h/week' }
            ].map((r, i) => (
              <motion.div key={i} className={styles.roleCard} initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.1 }} style={{ backgroundColor: 'var(--primary)' }}>
                <h3 className={styles.roleTitle} style={{ color: 'var(--white)' }}>{r.t}</h3>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{r.l} • {r.c}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Helmet>
        <title>Volunteer | Hamari Ummeed Mission</title>
        <meta name="description" content="Volunteer locally to teach children and care for the elderly." />
      </Helmet>

      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Hero />
        <Benefits />
        <Roles />

        {/* Application Form */}
        <section id="apply" className={styles.formSection}>
          <div className="container">
            <div className={styles.formWrapper} style={{ boxShadow: 'var(--shadow-md)' }}>
              
              {formSuccess ? (
                <div className={styles.successScreen}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '16px', color: 'var(--primary)' }}>Application Received!</h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '24px' }}>
                    Thank you for stepping up for our community. We'll review your application and reach out soon.
                  </p>
                  <div style={{ background: 'var(--light)', padding: '16px', borderRadius: '8px', display: 'inline-block', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '32px', color: 'var(--dark)' }}>
                    Reference: {refNumber}
                  </div>
                  <div>
                    <button className="btn btn-outline" onClick={() => setFormSuccess(false)}>Submit Another Application</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: 'var(--primary)' }}>Apply to Volunteer</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Basic Info */}
                    <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '24px', color: 'var(--accent)' }}>1. Basic Information</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Full Name *</label>
                        <input type="text" className={`${styles.formControl} ${errors.name ? styles.isInvalid : ''}`} {...register('name')} />
                        {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email Address *</label>
                        <input type="email" className={`${styles.formControl} ${errors.email ? styles.isInvalid : ''}`} {...register('email')} />
                        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Phone Number *</label>
                        <input type="text" className={`${styles.formControl} ${errors.phone ? styles.isInvalid : ''}`} {...register('phone')} />
                        {errors.phone && <p className={styles.errorText}>{errors.phone.message}</p>}
                      </div>
                      <div className={styles.formGroup}>
                        <label>Date of Birth *</label>
                        <input type="date" className={`${styles.formControl} ${errors.dob ? styles.isInvalid : ''}`} {...register('dob')} />
                        {errors.dob && <p className={styles.errorText}>{errors.dob.message}</p>}
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>City / Location *</label>
                        <select className={`${styles.formControl} ${errors.city ? styles.isInvalid : ''}`} {...register('city')}>
                          {locations.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
                      </div>
                      <div className={styles.formGroup}>
                        <label>Address *</label>
                        <input type="text" className={`${styles.formControl} ${errors.address ? styles.isInvalid : ''}`} {...register('address')} placeholder="Local address" />
                        {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
                      </div>
                    </div>

                    {/* Profile */}
                    <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: '40px', marginBottom: '24px', color: 'var(--accent)' }}>2. Professional Profile</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Current Status</label>
                        <select className={styles.formControl} {...register('education')}>
                          <option value="school">School Student</option>
                          <option value="college">College Student</option>
                          <option value="working">Working Professional</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Occupation / School Name</label>
                        <input type="text" className={styles.formControl} {...register('occupation')} placeholder="e.g. Public School, Engineer" />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Skills & Expertise (Type and press Enter)</label>
                      <div className={styles.tagInputWrapper}>
                        {tags.map(tag => (
                          <div key={tag} className={styles.tagPill} style={{ background: 'var(--secondary)', color: 'var(--dark)' }}>
                            {tag} <button type="button" onClick={() => removeTag(tag)}><X size={14}/></button>
                          </div>
                        ))}
                        <input 
                          type="text" 
                          className={styles.tagInputField} 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder={tags.length === 0 ? "e.g. Teaching Math, Social Media" : ""}
                        />
                      </div>
                    </div>

                    {/* Preferences */}
                    <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: '40px', marginBottom: '24px', color: 'var(--accent)' }}>3. Volunteer Preferences</h3>
                    
                    <div className={styles.formGroup}>
                      <label>Areas of Interest *</label>
                      <div className={styles.checkboxGrid}>
                        {['Teaching Children', 'Elderly Care', 'Event Management', 'Social Media / Tech', 'Fundraising'].map(interest => (
                          <label key={interest} className={styles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              checked={areasOfInterest.includes(interest)}
                              onChange={() => toggleInterest(interest)}
                            /> {interest}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Availability *</label>
                      <select className={`${styles.formControl} ${errors.availability ? styles.isInvalid : ''}`} {...register('availability')}>
                        <option value="">Select availability</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="evenings">Weekday Evenings</option>
                        <option value="events-only">Only for special events</option>
                      </select>
                      {errors.availability && <p className={styles.errorText}>{errors.availability.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Why do you want to volunteer with us? *</label>
                      <textarea 
                        className={`${styles.formControl} ${errors.message ? styles.isInvalid : ''}`} 
                        rows="4" 
                        placeholder="Tell us about your motivation..."
                        {...register('message')} 
                      ></textarea>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{errors.message && <p className={styles.errorText} style={{ marginTop: 0 }}>{errors.message.message}</p>}</div>
                        <span className={styles.charCount}>{messageVal.length}/500</span>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-secondary btn-lg w-full" disabled={volunteerMutation.isPending} style={{ marginTop: '24px' }}>
                      {volunteerMutation.isPending ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                    
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default Volunteer;
