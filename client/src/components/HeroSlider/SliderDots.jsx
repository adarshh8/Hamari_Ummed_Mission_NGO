import { motion } from 'framer-motion';
import styles from './SliderDots.module.css';

const SliderDots = ({ totalSlides, currentIndex, onDotClick, isPaused }) => {
  return (
    <>
      <div className={styles.dotsWrapper} role="tablist">
        {Array.from({ length: totalSlides }).map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <motion.button
              key={index}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={isActive}
              className={`${styles.dot} ${isActive ? styles.dotActive : ''}`}
              onClick={() => onDotClick(index)}
              layout // Framer motion layout morphing
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              whileHover={{
                scale: 1.2,
                backgroundColor: isActive ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.7)'
              }}
            />
          );
        })}
      </div>
      
      {/* Autoplay Progress Bar */}
      <div className={styles.progressBar}>
        <div 
          key={currentIndex} 
          className={`${styles.progressFill} ${isPaused ? styles.paused : ''}`} 
        />
      </div>
    </>
  );
};

export default SliderDots;
