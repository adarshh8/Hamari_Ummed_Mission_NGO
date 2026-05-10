import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './SliderControls.module.css';

const SliderControls = ({ onPrev, onNext }) => {
  return (
    <>
      <motion.button
        className={`${styles.arrowBtn} ${styles.prevBtn}`}
        onClick={onPrev}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{
          scale: 1.08,
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
        whileTap={{ scale: 0.94 }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        className={`${styles.arrowBtn} ${styles.nextBtn}`}
        onClick={onNext}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{
          scale: 1.08,
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
        whileTap={{ scale: 0.94 }}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </motion.button>
    </>
  );
};

export default SliderControls;
