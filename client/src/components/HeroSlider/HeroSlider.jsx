import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlideContent from './SlideContent';
import SliderControls from './SliderControls';
import SliderDots from './SliderDots';
import styles from './HeroSlider.module.css';

import slider1 from '../../assets/animations/slider1.jpeg';
import slider2 from '../../assets/animations/slider2.jpeg';
import slider3 from '../../assets/animations/slider3.jpeg';
import slider4 from '../../assets/animations/slider4.jpeg';
import slider5 from '../../assets/animations/slider5.jpeg';

const slides = [
  {
    id: 2,
    image: slider2,
    overlayColor: "linear-gradient(120deg, rgba(180,80,20,0.85) 0%, rgba(180,80,20,0.35) 60%, rgba(0,0,0,0.1) 100%)",
    badge: "🏆 Awards",
    headline: "Celebrating Children Who",
    headlineAccent: "Never Gave Up",
    subheadline: "We honour every child who scores well and works hard — because every achievement deserves to be celebrated.",
    primaryCTA: { label: "See Our Winners", link: "/events" },
    secondaryCTA: { label: "Nominate a Child", link: "/contact" },
    stats: [
      { number: 120, suffix: "+", label: "Children Rewarded" },
      { number: 8, suffix: "", label: "Annual Ceremonies" }
    ]
  },
  {
    id: 1,
    image: slider1,
    overlayColor: "linear-gradient(120deg, rgba(11,40,20,0.88) 0%, rgba(11,40,20,0.4) 60%, rgba(0,0,0,0.1) 100%)",
    badge: "📚 Education",
    headline: "Every Child Deserves",
    headlineAccent: "a Chance to Learn",
    subheadline: "We provide free books, stationery, and private coaching to underprivileged children across the city.",
    primaryCTA: { label: "Help a Child Today", link: "/donate" },
    secondaryCTA: { label: "Our Programs", link: "/what-we-do" },
    stats: [
      { number: 500, suffix: "+", label: "Children Supported" },
      { number: 1200, suffix: "+", label: "Books Distributed" }
    ]
  },
  {
    id: 3,
    image: slider3,
    overlayColor: "linear-gradient(120deg, rgba(20,60,100,0.87) 0%, rgba(20,60,100,0.38) 60%, rgba(0,0,0,0.1) 100%)",
    badge: "👕 Clothes Drive",
    headline: "Warmth is More Than",
    headlineAccent: "Just a Feeling",
    subheadline: "We distribute school uniforms and clothing to children and families who need it most — with dignity and love.",
    primaryCTA: { label: "Donate Clothes", link: "/donate" },
    secondaryCTA: { label: "Learn More", link: "/what-we-do" },
    stats: [
      { number: 800, suffix: "+", label: "Clothes Distributed" },
      { number: 15, suffix: "", label: "Drives This Year" }
    ]
  },
  {
    id: 4,
    image: slider4,
    overlayColor: "linear-gradient(120deg, rgba(80,20,100,0.86) 0%, rgba(80,20,100,0.36) 60%, rgba(0,0,0,0.1) 100%)",
    badge: "🎭 Cultural Events",
    headline: "Stories That Teach,",
    headlineAccent: "Plays That Inspire",
    subheadline: "Our theatre and cultural programs teach children values, confidence, and creativity through the joy of performance.",
    primaryCTA: { label: "Upcoming Events", link: "/events" },
    secondaryCTA: { label: "View Gallery", link: "/gallery" },
    stats: [
      { number: 24, suffix: "+", label: "Plays Organised" },
      { number: 600, suffix: "+", label: "Children Performed" }
    ]
  },
  {
    id: 5,
    image: slider5,
    overlayColor: "linear-gradient(120deg, rgba(10,70,50,0.88) 0%, rgba(10,70,50,0.38) 60%, rgba(0,0,0,0.1) 100%)",
    badge: "🚪 Door to Door",
    headline: "We Come to You —",
    headlineAccent: "No Child Left Behind",
    subheadline: "Our volunteers visit homes in underserved areas to encourage families to send their children to school and access free education support.",
    primaryCTA: { label: "Join as Volunteer", link: "/volunteer" },
    secondaryCTA: { label: "Our Story", link: "/about" },
    stats: [
      { number: 300, suffix: "+", label: "Families Reached" },
      { number: 40, suffix: "+", label: "Volunteers Active" }
    ]
  },
  {
    id: 6,
    image: slider1,
    overlayColor: "linear-gradient(120deg, rgba(100,60,10,0.87) 0%, rgba(100,60,10,0.37) 60%, rgba(0,0,0,0.1) 100%)",
    badge: "🧓 Elder Care",
    headline: "Because Every Elder",
    headlineAccent: "Deserves Respect",
    subheadline: "We visit, support, and care for elderly individuals in our city who live alone or need help — bringing warmth and companionship.",
    primaryCTA: { label: "Support This Cause", link: "/donate" },
    secondaryCTA: { label: "Volunteer With Us", link: "/volunteer" },
    stats: [
      { number: 80, suffix: "+", label: "Elders Supported" },
      { number: 200, suffix: "+", label: "Visits This Year" }
    ]
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef(null);
  const isPausedRef = useRef(isPaused);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Sync state to ref for setInterval access
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const startAutoplay = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) goToNext();
    }, 5000);
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]); // restarts interval on slide change

  // Preload NEXT image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentIndex]);

  // Keyboard support & tab visibility
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    const handleVisibility = () => {
      if (document.hidden) setIsPaused(true);
      else setIsPaused(false);
    };

    window.addEventListener('keydown', handleKey);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    // Pause briefly so user can read before it auto-advances
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  const slideVariants = {
    initial: (direction) => ({
      opacity: 0,
      scale: 1.08,
      x: direction > 0 ? 60 : -60,
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: (direction) => ({
      opacity: 0,
      scale: 0.96,
      x: direction > 0 ? -60 : 60,
      transition: {
        duration: 0.8,
        ease: [0.55, 0, 1, 0.45],
      },
    }),
  };

  const scrollIndicatorVariants = {
    animate: {
      y: [0, 20, 0],
      opacity: [1, 0, 0],
    },
  };

  const handleScrollClick = () => {
    const nextSection = document.getElementById('what-we-do');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className={styles.sliderContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero Slideshow"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          className={styles.slideWrapper}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -80) goToNext();
            if (offset.x > 80) goToPrev();
          }}
          aria-hidden="false"
        >
          {/* Background Image with Ken Burns */}
          <img
            src={slides[currentIndex].image}
            alt="Hero Slide"
            className={`${styles.slideImage} ${styles.kenBurns}`}
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />
          
          {/* Color Gradient Overlay */}
          <div 
            className={styles.overlay} 
            style={{ background: slides[currentIndex].overlayColor }} 
          />
          
          {/* Grain Texture */}
          <div className={styles.grainOverlay} />

          {/* Slide Content */}
          <SlideContent slide={slides[currentIndex]} />
        </motion.div>
      </AnimatePresence>

      <SliderControls onPrev={goToPrev} onNext={goToNext} />
      
      <SliderDots 
        totalSlides={slides.length} 
        currentIndex={currentIndex} 
        onDotClick={handleDotClick} 
        isPaused={isPaused} 
      />

      {/* Scroll Down Indicator */}
      <div className={`${styles.scrollIndicator} desktop-only`} onClick={handleScrollClick}>
        <div className={styles.scrollText}>Scroll</div>
        <div className={styles.scrollLine}>
          <motion.div
            className={styles.scrollCircle}
            animate="animate"
            variants={scrollIndicatorVariants}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
