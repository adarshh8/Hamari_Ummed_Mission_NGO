import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import styles from './SlideContent.module.css';

const SlideContent = ({ slide }) => {
  return (
    <motion.div 
      className={styles.contentContainer}
      key={slide.id} // forces re-render/re-animation when slide changes
    >
      <motion.div
        className={styles.badge}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {slide.badge}
      </motion.div>

      <motion.h2
        className={styles.headlineLine}
        initial={{ opacity: 0, y: 40, skewY: 3 }}
        animate={{ opacity: 1, y: 0, skewY: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {slide.headline}
      </motion.h2>

      <motion.h2
        className={`${styles.headlineLine} ${styles.headlineAccent}`}
        initial={{ opacity: 0, y: 40, skewY: 3 }}
        animate={{ opacity: 1, y: 0, skewY: 0 }}
        transition={{ delay: 0.65, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {slide.headlineAccent}
      </motion.h2>

      <motion.div
        className={styles.decorativeLine}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      />

      <motion.p
        className={styles.subheadline}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {slide.subheadline}
      </motion.p>

      <motion.div
        className={styles.ctaContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.96 }}>
          <Link to={slide.primaryCTA.link} className={styles.btnPrimary}>
            {slide.primaryCTA.label}
          </Link>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.96 }}>
          <Link to={slide.secondaryCTA.link} className={styles.btnSecondary}>
            {slide.secondaryCTA.label}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.statsRow}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        {slide.stats.map((stat, idx) => (
          <React.Fragment key={idx}>
            <div className={`${styles.statItem} ${idx === 1 ? 'desktop-only-stat' : ''}`}>
              <div className={styles.statNumber}>
                <CountUp start={0} end={stat.number} duration={2} delay={1.5} />
                {stat.suffix}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
            {idx === 0 && slide.stats.length > 1 && (
              <div className={`${styles.statSeparator} desktop-only-stat`} />
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SlideContent;
